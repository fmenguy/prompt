// api/generate-prompt.js

export default async function handler(req, res) {
  // --- 1. GESTION CORS (Indispensable car on n'utilise plus le middleware 'cors') ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplace '*' par ton URL frontend en prod pour plus de sécurité
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Répondre tout de suite aux requêtes de pré-vérification (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- 2. VÉRIFICATION DE LA MÉTHODE ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- 3. LOGIQUE PRINCIPALE ---
  try {
    const { selectedTags, subjectData } = req.body;

    // Validation
    if (!selectedTags || selectedTags.length === 0) {
      return res.status(400).json({ 
        error: 'Aucun tag sélectionné',
        fallback: true 
      });
    }

    // Construction du prompt système
    const systemPrompt = `You are an expert AI prompt engineer for image generation (Stable Diffusion, Midjourney, DALL-E).
Transform user inputs into professional, detailed prompts in English.

Rules:
- Use descriptive, specific terminology
- Include technical details (lighting, composition, camera angle)
- Optimize for visual quality
- Keep it concise but impactful (max 150 words)`;

    // Construction du prompt utilisateur
    let userPrompt = `Create a professional image generation prompt with:\n\n`;
    userPrompt += `Tags: ${selectedTags.join(", ")}\n`;

    if (subjectData?.species) userPrompt += `Subject: ${subjectData.species}`;
    if (subjectData?.gender) userPrompt += `, ${subjectData.gender}`;
    if (subjectData?.age) userPrompt += `, ${subjectData.age}`;

    userPrompt += `\n\nGenerate a natural, flowing prompt.`;

    // Appel à Hugging Face
    // Note : On utilise ta variable HF_TOKEN ici
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`, // Utilise bien HF_TOKEN comme dans ton screenshot
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();
    let generatedText = result[0]?.generated_text || '';

    // Nettoyage
    generatedText = generatedText
      .replace(/^.*?\[\/INST\]\s*/s, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Réponse succès
    return res.status(200).json({ 
      prompt: generatedText,
      fallback: false,
      tokens_used: result[0]?.details?.tokens?.length || 0
    });

  } catch (error) {
    console.error('❌ Erreur backend:', error);

    // Fallback manuel en cas d'erreur HF (pour que l'utilisateur ait quand même quelque chose)
    let fallbackPrompt = 'masterpiece, best quality, highly detailed, ';
    if (req.body.subjectData?.species) fallbackPrompt += `${req.body.subjectData.species} `;
    if (req.body.subjectData?.gender) fallbackPrompt += `${req.body.subjectData.gender} `;
    fallbackPrompt += (req.body.selectedTags || []).join(', ');

    return res.status(500).json({ 
      prompt: fallbackPrompt, // On renvoie le fallback même en erreur 500 pour le front
      fallback: true,
      error: error.message 
    });
  }
}
