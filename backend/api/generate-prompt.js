// backend/api/generate-prompt.js
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const API_KEY = process.env.API_KEY;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export default async function handler(req, res) {
  // ✅ CORS - AUTORISE TOUT (headers + méthodes + origine)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key'); // ← FIX ICI
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight 24h

  // ✅ Répond immédiatement aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Vérifie que c'est bien une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ✅ Vérifie la clé API
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== API_KEY) {
    console.error('❌ Invalid API key:', clientApiKey);
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // ✅ Vérifie que Hugging Face est configuré
  if (!HUGGINGFACE_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { tags, subject, style } = req.body;

    // ✅ Construction du prompt pour Mistral
    const systemPrompt = `You are an expert at creating Stable Diffusion prompts. 
Generate a detailed, high-quality prompt based on:
- Tags: ${tags.join(', ')}
- Subject: ${JSON.stringify(subject)}
- Style: ${JSON.stringify(style)}

Return ONLY the prompt text, no explanations.`;

    console.log('📤 Sending to Hugging Face:', systemPrompt.substring(0, 100) + '...');

    // ✅ Appel à Hugging Face
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Hugging Face error:', response.status, errorText);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Hugging Face response:', result);

    // ✅ Extraction du texte généré
    let generatedPrompt = '';
    if (Array.isArray(result) && result[0]?.generated_text) {
      generatedPrompt = result[0].generated_text.trim();
    } else if (result.generated_text) {
      generatedPrompt = result.generated_text.trim();
    } else {
      throw new Error('Unexpected response format from Hugging Face');
    }

    // ✅ Retourne le prompt généré
    return res.status(200).json({
      success: true,
      prompt: generatedPrompt,
      metadata: {
        model: MODEL_ID,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in generate-prompt:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
