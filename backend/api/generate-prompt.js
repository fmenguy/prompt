export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

   // ✅ Vérification de la clé API
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!validApiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Clé API invalide' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { selectedTags = [], subjectData = {} } = req.body;

    // Validation
    if (!subjectData.subject) {
      return res.status(400).json({ error: 'Sujet manquant' });
    }

    // Construction du contexte
    const tagsText = selectedTags.length > 0 
      ? `Style: ${selectedTags.join(', ')}`
      : '';

    const detailsText = subjectData.details 
      ? `Détails: ${subjectData.details}`
      : '';

    const userPrompt = `Génère un prompt Midjourney professionnel pour :
Sujet: ${subjectData.subject}
${tagsText}
${detailsText}

Le prompt doit être en anglais, descriptif et optimisé pour Midjourney v6.`;

    // Appel Hugging Face
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      throw new Error('HF_TOKEN manquant');
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
      throw new Error(`HF API error: ${response.status}`);
    }

    const result = await response.json();
    let generatedText = result[0]?.generated_text || '';

    // Nettoyage
    generatedText = generatedText
      .replace(/^.*?\[\/INST\]\s*/s, '')
      .replace(/\n+/g, ' ')
      .trim();

    res.status(200).json({
      prompt: generatedText,
      fallback: false
    });

  } catch (error) {
    console.error('Erreur:', error.message);

    // Fallback
    const { selectedTags = [], subjectData = {} } = req.body;
    const fallbackPrompt = `${subjectData.subject}, ${selectedTags.join(', ')}, professional photography, high quality, detailed`;

    res.status(200).json({
      prompt: fallbackPrompt,
      fallback: true,
      error: error.message
    });
  }
}
