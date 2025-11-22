// ═══════════════════════════════════════════════════════════════
// 📁 backend/api/generate-prompt.js
// Version 100% GRATUITE avec Hugging Face (Mistral-7B)
// ═══════════════════════════════════════════════════════════════

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const API_KEY = process.env.API_KEY;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export default async function handler(req, res) {
  // ═══ CORS ═══
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ═══ VÉRIFICATION API KEY ═══
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== API_KEY) {
    console.error('❌ Invalid API key');
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (!HUGGINGFACE_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    console.log('📥 Requête reçue:', JSON.stringify(req.body, null, 2));

    // ═══ EXTRACTION SÉCURISÉE DES DONNÉES ═══
    const { tags, selectedTags, subject, subjectData, style } = req.body || {};

    // 🛡️ Protection contre undefined/null
    const safeTags = Array.isArray(tags) ? tags : 
                     (Array.isArray(selectedTags) ? selectedTags : []);
    const safeSubject = subject || subjectData || {};
    const safeStyle = style || {};

    console.log('✅ Données validées:', {
      tags: safeTags,
      subjectText: safeSubject.text || 'N/A',
      style: safeStyle
    });

    // ═══ VALIDATION ═══
    if (safeTags.length === 0) {
      console.warn('⚠️ Aucun tag sélectionné');
      return res.status(400).json({
        success: false,
        error: 'At least one tag is required'
      });
    }

    // ═══ CONSTRUCTION DU PROMPT ═══
    const userPrompt = `Create a detailed Stable Diffusion prompt using these elements:
Tags: ${safeTags.join(', ')}
${safeSubject.text ? `Subject: ${safeSubject.text}` : ''}
${safeStyle.name ? `Style: ${safeStyle.name}` : ''}

Generate ONLY the prompt text, no explanations. Make it creative and detailed.`;

    console.log('📤 Envoi à Hugging Face...');

    // ═══ APPEL HUGGING FACE (avec retry) ═══
    let attempt = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempt < maxAttempts) {
      attempt++;
      console.log(`🔄 Tentative ${attempt}/${maxAttempts}`);

      try {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/${MODEL_ID}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: userPrompt,
              parameters: {
                max_new_tokens: 250,
                temperature: 0.8,
                top_p: 0.95,
                return_full_text: false,
                do_sample: true
              },
              options: {
                wait_for_model: true,  // ← Attend que le modèle charge
                use_cache: false
              }
            })
          }
        );

        // ═══ GESTION DES ERREURS HTTP ═══
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Erreur HTTP ${response.status}:`, errorText);

          // Si le modèle charge, attendre et réessayer
          if (response.status === 503 && attempt < maxAttempts) {
            console.log('⏳ Modèle en chargement, attente 5 secondes...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }

          lastError = new Error(`Hugging Face error: ${response.status}`);
          break;
        }

        // ═══ PARSING RÉPONSE ═══
        const result = await response.json();
        console.log('✅ Réponse Hugging Face:', JSON.stringify(result, null, 2));

        let generatedPrompt = '';

        // Formats de réponse possibles
        if (Array.isArray(result) && result[0]?.generated_text) {
          generatedPrompt = result[0].generated_text.trim();
        } else if (result.generated_text) {
          generatedPrompt = result.generated_text.trim();
        } else if (typeof result === 'string') {
          generatedPrompt = result.trim();
        } else {
          console.warn('⚠️ Format inattendu, utilisation du fallback');
          throw new Error('Unexpected response format');
        }

        // ═══ RETOUR SUCCÈS ═══
        return res.status(200).json({
          success: true,
          prompt: generatedPrompt,
          fallback: false,
          metadata: {
            model: MODEL_ID,
            provider: 'huggingface',
            attempt: attempt,
            timestamp: new Date().toISOString()
          }
        });

      } catch (fetchError) {
        console.error(`❌ Erreur tentative ${attempt}:`, fetchError.message);
        lastError = fetchError;

        if (attempt < maxAttempts) {
          console.log('⏳ Nouvelle tentative dans 2 secondes...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // ═══ SI TOUTES LES TENTATIVES ONT ÉCHOUÉ ═══
    console.warn('⚠️ Toutes les tentatives ont échoué, utilisation du fallback');
    
    const fallbackPrompt = generateFallbackPrompt(safeTags, safeSubject, safeStyle);

    return res.status(200).json({
      success: true,
      prompt: fallbackPrompt,
      fallback: true,
      metadata: {
        provider: 'fallback',
        reason: lastError?.message || 'Unknown error',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Erreur serveur:', error);

    return res.status(500).json({
      success: false,
      error: error.message,
      fallback: true,
      prompt: 'An unexpected error occurred.'
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// 🆘 FONCTION FALLBACK (génération locale sans IA)
// ═══════════════════════════════════════════════════════════════

function generateFallbackPrompt(tags, subject, style) {
  const tagText = tags.join(', ');
  const subjectText = subject?.text ? `, featuring ${subject.text}` : '';
  const styleText = style?.name ? ` in ${style.name} style` : '';

  const qualityTerms = [
    'highly detailed',
    'professional quality',
    'masterpiece',
    '8k resolution',
    'photorealistic',
    'intricate details'
  ];

  const randomQuality = qualityTerms[Math.floor(Math.random() * qualityTerms.length)];

  return `${tagText}${subjectText}${styleText}, ${randomQuality}, stunning composition, perfect lighting, award-winning photograph`;
}