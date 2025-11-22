const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const API_KEY = process.env.API_KEY;
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vérification API Key
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== API_KEY) {
    return res.status(401).json({ error: 'API key invalide' });
  }

  try {
    const { selectedTags, subjectData } = req.body;

    if (!selectedTags || !subjectData) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const systemPrompt = `Generate a professional Stable Diffusion prompt.
Tags: ${selectedTags.join(', ')}
Subject: ${subjectData.subject || 'character'}
Style: ${subjectData.style || 'default'}

Create a clear, optimized prompt without explanations.`;

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
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text || '';

    res.status(200).json({
      prompt: generatedText.trim(),
      fallback: false,
      model: MODEL_ID
    });

  } catch (error) {
    console.error('Erreur:', error);
    
    const fallbackPrompt = `${subjectData.subject || 'character'}, ${selectedTags.join(', ')}, professional photography, high quality`;
    
    res.status(200).json({
      prompt: fallbackPrompt,
      fallback: true,
      error: error.message
    });
  }
}