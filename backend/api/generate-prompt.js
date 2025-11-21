// ═══════════════════════════════════════════════════════════════
// 📁 backend/api/generate-prompt.js
// Serverless function pour Vercel (sans Express)
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  
  // ─────────────────────────────────────────────────────────────
  // 🔒 CORS
  // ─────────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─────────────────────────────────────────────────────────────
  // 🔐 VÉRIFICATION DE LA CLÉ API
  // ─────────────────────────────────────────────────────────────
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!validApiKey || apiKey !== validApiKey) {
    return res.status(401).json({ 
      error: 'Clé API invalide ou manquante',
      hint: 'Ajoute le header x-api-key avec ta clé'
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 📝 VALIDATION MÉTHODE HTTP
  // ─────────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // ───────────────────────────────────────────────────────────
    // 🎯 EXTRACTION DES DONNÉES
    // ───────────────────────────────────────────────────────────
    const { selectedTags = [], subjectData = {} } = req.body;

    // Validation
    if (!subjectData.subject) {
      return res.status(400).json({ error: 'Sujet manquant' });
    }

    // ───────────────────────────────────────────────────────────
    // 🧠 CONSTRUCTION DU PROMPT
    // ───────────────────────────────────────────────────────────
    const tagsText = selectedTags.length > 0 
      ? `Style: ${selectedTags.join(', ')}`
      : '';

    const detailsText = subjectData.details 
      ? `Détails: ${subjectData.details}`
      : '';

    const userPrompt = `Génère un prompt Stable Diffusion professionnel pour :
Sujet: ${subjectData.subject}
${tagsText}
${detailsText}

Le prompt doit être en anglais, descriptif et optimisé pour Stable Diffusion.`;

    // ───────────────────────────────────────────────────────────
    // 🤖 APPEL HUGGING FACE
    // ───────────────────────────────────────────────────────────
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      throw new Error('HF_TOKEN manquant sur le serveur');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${userPrompt} [/INST]`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    let generatedText = result[0]?.generated_text || '';

    // ───────────────────────────────────────────────────────────
    // 🧹 NETTOYAGE DU TEXTE GÉNÉRÉ
    // ───────────────────────────────────────────────────────────
    generatedText = generatedText
      .replace(/^.*?\[\/INST\]\s*/s, '')
      .replace(/\n+/g, ' ')
      .trim();

    // ───────────────────────────────────────────────────────────
    // ✅ SUCCÈS
    // ───────────────────────────────────────────────────────────
    console.log('✅ Prompt généré avec succès');
    
    res.status(200).json({
      prompt: generatedText,
      fallback: false,
      model: 'mistralai/Mistral-7B-Instruct-v0.2'
    });

  } catch (error) {
    // ───────────────────────────────────────────────────────────
    // ⚠️ FALLBACK EN CAS D'ERREUR
    // ───────────────────────────────────────────────────────────
    console.error('❌ Erreur génération:', error.message);

    const { selectedTags = [], subjectData = {} } = req.body;
    const fallbackPrompt = `${subjectData.subject}, ${selectedTags.join(', ')}, professional photography, high quality, detailed, 8k resolution`;

    res.status(200).json({
      prompt: fallbackPrompt,
      fallback: true,
      error: error.message
    });
  }
}