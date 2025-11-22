// backend/api/generate-prompt.js
const fetch = require('node-fetch');

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;

// Timeout pour Hugging Face (30s max)
const fetchWithTimeout = (url, options, timeout = 30000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

// Fonction pour appeler Hugging Face
async function callHuggingFace(systemPrompt, userInput, retries = 2) {
  const prompt = `<s>[INST] ${systemPrompt}\n\n${userInput} [/INST]`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        })
      }, 30000);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HF API Error (attempt ${i + 1}):`, errorText);
        
        if (response.status === 503 && i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        throw new Error(`HF API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        return data[0].generated_text.trim();
      }
      
      throw new Error('Invalid response format from Hugging Face');

    } catch (error) {
      console.error(`HF attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Fallback local si Hugging Face échoue
function generateLocalFallback(context, style, tone, tags, customInstructions) {
  const tagList = Array.isArray(tags) ? tags.join(', ') : '';
  
  return `Génère un prompt optimisé avec ces paramètres :

**Contexte :** ${context || 'Non spécifié'}
**Style :** ${style || 'Non spécifié'}  
**Ton :** ${tone || 'Non spécifié'}
**Tags :** ${tagList || 'Aucun'}
**Instructions :** ${customInstructions || 'Aucune'}

Le prompt doit être structuré, détaillé et adapté pour une IA générative.`;
}

// Route API principale
module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { context, style, tone, selectedTags, customInstructions } = req.body;

    // Validation
    if (!context || typeof context !== 'string' || context.trim().length === 0) {
      return res.status(400).json({ error: 'Le contexte est requis' });
    }

    // Construction du prompt système
    const systemPrompt = `Tu es un expert en création de prompts pour IA. Génère un prompt optimisé, structuré et détaillé basé sur les paramètres fournis.`;

    const tags = Array.isArray(selectedTags) ? selectedTags : [];
    const tagList = tags.length > 0 ? tags.join(', ') : 'Aucun';

    const userInput = `Crée un prompt avec :
- Contexte: ${context}
- Style: ${style || 'Non spécifié'}
- Ton: ${tone || 'Non spécifié'}
- Tags: ${tagList}
- Instructions: ${customInstructions || 'Aucune'}`;

    console.log('Appel Hugging Face...');

    let generatedPrompt;

    try {
      // Essaye Hugging Face
      generatedPrompt = await callHuggingFace(systemPrompt, userInput);
      console.log('✅ Hugging Face OK');
      
    } catch (hfError) {
      // Fallback local
      console.warn('⚠️ Hugging Face échoué, fallback local:', hfError.message);
      generatedPrompt = generateLocalFallback(context, style, tone, tags, customInstructions);
    }

    return res.status(200).json({
      prompt: generatedPrompt,
      model: generatedPrompt.includes('Génère un prompt') ? 'fallback' : 'huggingface'
    });

  } catch (error) {
    console.error('❌ Erreur globale:', error);
    return res.status(500).json({
      error: 'Erreur serveur',
      details: error.message
    });
  }
};
