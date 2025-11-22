// backend/api/generate-prompt.js
import fetch from 'node-fetch';
import { getModernSystemPrompt } from '../utils/systemPrompts.js';

export default async function handler(req, res) {
  // ========================================
  // 🔒 CORS & Méthode
  // ========================================
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // ========================================
  // 🔑 SÉCURITÉ
  // ========================================
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Clé API invalide' });
  }

  // ========================================
  // 📥 EXTRACTION & VALIDATION
  // ========================================
  const { selectedTags, subjectData, systemPrompt, context } = req.body;

  if (!selectedTags) {
    return res.status(400).json({ error: 'selectedTags manquant' });
  }

  // ========================================
  // 🛠️ PRÉPARATION DES DONNÉES
  // ========================================
  const finalSystemPrompt = systemPrompt || getModernSystemPrompt();
  
  // Convertir selectedTags (objet) en format lisible
  const formattedTags = formatTagsForPrompt(selectedTags, subjectData);
  
  // Construire le prompt utilisateur
  const userPrompt = buildUserPrompt(formattedTags, context);

  // ========================================
  // 🤖 APPEL À HUGGING FACE (MISTRAL)
  // ========================================
  try {
    console.log('🚀 Envoi vers Mistral-7B...');
    console.log('📝 User Prompt:', userPrompt);

    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${finalSystemPrompt}

${userPrompt} [/INST]`,
          parameters: {
            max_new_tokens: 350,
            temperature: 0.75,
            top_p: 0.92,
            top_k: 50,
            repetition_penalty: 1.15,
            return_full_text: false,
          }
        }),
      }
    );

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('❌ Erreur HF:', errorText);
      throw new Error(`HF API Error ${hfResponse.status}: ${errorText}`);
    }

    const data = await hfResponse.json();
    console.log('✅ Réponse HF:', data);

    // ========================================
    // 🧹 NETTOYAGE DE LA RÉPONSE
    // ========================================
    const generatedText = data[0]?.generated_text || '';
    const cleanedPrompt = cleanGeneratedPrompt(generatedText);

    if (!cleanedPrompt) {
      throw new Error('Prompt vide après génération');
    }

    return res.status(200).json({
      prompt: cleanedPrompt,
      model: 'Mistral-7B-Instruct-v0.2',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Erreur génération:', error);

    // ========================================
    // 🔄 FALLBACK INTELLIGENT
    // ========================================
    const fallbackPrompt = generateSmartFallback(selectedTags, subjectData);
    
    return res.status(200).json({
      prompt: fallbackPrompt,
      model: 'fallback',
      fallback: true,
      error: error.message,
    });
  }
}

// ========================================
// 🛠️ FONCTIONS UTILITAIRES
// ========================================

/**
 * Convertit les tags en format structuré pour le prompt
 */
function formatTagsForPrompt(selectedTags, subjectData) {
  const formatted = {
    count: selectedTags.subject?.[0] || '1girl',
    species: subjectData?.species || 'human',
    gender: subjectData?.gender || 'female',
    physical: [],
    clothing: [],
    pose: [],
    environment: [],
    technical: [],
  };

  // Cheveux
  if (selectedTags.hairColor?.length) {
    formatted.physical.push(...selectedTags.hairColor);
  }
  if (selectedTags.hairLength?.length) {
    formatted.physical.push(...selectedTags.hairLength);
  }

  // Yeux
  if (selectedTags.eyeColor?.length) {
    formatted.physical.push(...selectedTags.eyeColor);
  }

  // Vêtements
  if (selectedTags.clothing?.length) {
    formatted.clothing.push(...selectedTags.clothing);
  }

  // Pose & Expression
  if (selectedTags.pose?.length) {
    formatted.pose.push(...selectedTags.pose);
  }
  if (selectedTags.expression?.length) {
    formatted.pose.push(...selectedTags.expression);
  }

  // Environnement
  if (selectedTags.background?.length) {
    formatted.environment.push(...selectedTags.background);
  }
  if (selectedTags.lighting?.length) {
    formatted.environment.push(...selectedTags.lighting);
  }

  // Qualité technique
  if (selectedTags.quality?.length) {
    formatted.technical.push(...selectedTags.quality);
  }

  return formatted;
}

/**
 * Construit le prompt utilisateur structuré
 */
function buildUserPrompt(tags, context) {
  const parts = [];

  parts.push(`Generate a Stable Diffusion prompt with these specifications:`);
  parts.push(`- Count: ${tags.count}`);
  parts.push(`- Species: ${tags.species}`);
  parts.push(`- Gender: ${tags.gender}`);

  if (tags.physical.length) {
    parts.push(`- Physical features: ${tags.physical.join(', ')}`);
  }

  if (tags.clothing.length) {
    parts.push(`- Clothing: ${tags.clothing.join(', ')}`);
  }

  if (tags.pose.length) {
    parts.push(`- Pose/Expression: ${tags.pose.join(', ')}`);
  }

  if (tags.environment.length) {
    parts.push(`- Environment: ${tags.environment.join(', ')}`);
  }

  if (tags.technical.length) {
    parts.push(`- Technical quality: ${tags.technical.join(', ')}`);
  }

  if (context) {
    parts.push(`\nAdditional context: ${context}`);
  }

  return parts.join('\n');
}

/**
 * Nettoie le prompt généré
 */
function cleanGeneratedPrompt(text) {
  return text
    .replace(/^(Here is|Output:|Prompt:|Generated prompt:)/i, '')
    .replace(/["\n]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/,\s*,/g, ',')
    .trim();
}

/**
 * Génère un prompt de secours si l'IA échoue
 */
function generateSmartFallback(selectedTags, subjectData) {
  const parts = [];

  // 1. Count
  parts.push(selectedTags.subject?.[0] || '1girl');

  // 2. Solo
  parts.push('solo');

  // 3. Species
  if (subjectData?.species && subjectData.species !== 'human') {
    parts.push(subjectData.species);
  }

  // 4. Physical
  if (selectedTags.hairColor) parts.push(...selectedTags.hairColor);
  if (selectedTags.eyeColor) parts.push(...selectedTags.eyeColor);
  if (selectedTags.hairLength) parts.push(...selectedTags.hairLength);

  // 5. Clothing
  if (selectedTags.clothing) parts.push(...selectedTags.clothing);

  // 6. Pose
  if (selectedTags.pose) parts.push(...selectedTags.pose);

  // 7. Background
  if (selectedTags.background) parts.push(...selectedTags.background);

  // 8. Quality
  parts.push('masterpiece', 'best quality', 'highly detailed', '8k');

  return parts.join(', ');
}
