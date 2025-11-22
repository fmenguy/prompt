// backend/api/generate-prompt.js
export default async function handler(req, res) {
  // --- GESTION CORS MANUELLE (Sécurité doublée) ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Pour la prod, mets 'https://aiprompt.fmenguy.fr' plus tard
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key');

  // Réponse immédiate pour la pré-vérification du navigateur
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- VÉRIFICATION CLÉ API INTERNE (Si tu utilises VITE_API_KEY) ---
  // (Décommente si tu veux protéger ton API des autres)
  /*
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
     return res.status(401).json({ error: 'Unauthorized' });
  }
  */

  try {
    const { context, style, tone, selectedTags, customInstructions } = req.body;

    // Vérification basique
    if (!context) {
      return res.status(400).json({ error: 'Le contexte est requis' });
    }

    // --- PRÉPARATION DU PROMPT POUR L'IA ---
    const systemPrompt = `Tu es un expert en génération de prompts pour Midjourney.
    Ta tâche est de créer un prompt détaillé en ANGLAIS basé sur les informations fournies.
    Renvoie UNIQUEMENT le prompt, sans texte avant ni après.`;

    const userMessage = `
    Context: ${context}
    Style: ${style || 'Realistic'}
    Tone: ${tone || 'Neutral'}
    Keywords: ${selectedTags ? selectedTags.join(', ') : ''}
    Instructions: ${customInstructions || ''}
    `;

    // --- APPEL HUGGING FACE ---
    // Utilisation du modèle Mistral-7B-Instruct
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`, // Utilise la bonne variable !
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `<s>[INST] ${systemPrompt} \n\n ${userMessage} [/INST]`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            return_full_text: false, 
          },
        }),
      }
    );

    // Gestion d'erreur de l'API Hugging Face
    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("Erreur HF:", errorDetail);
      throw new Error(`Erreur Hugging Face: ${response.status} - ${errorDetail}`);
    }

    const result = await response.json();
    
    // L'API renvoie souvent un tableau [{ generated_text: "..." }]
    let generatedText = result[0]?.generated_text || "";

    // --- RÉPONSE AU FRONTEND ---
    // Le frontend attend probablement un tableau pour faire .join(), 
    // ou alors ton code front doit être adapté.
    // Ici je renvoie un objet standard.
    res.status(200).json({ result: generatedText.trim() });

  } catch (error) {
    console.error('❌ Erreur backend:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération', 
      details: error.message 
    });
  }
}
