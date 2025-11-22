// backend/api/generate-prompt.js
import fetch from 'node-fetch';
import { getModernSystemPrompt } from '../utils/systemPrompts.js'; // <--- 1. L'import est bien là

export default async function handler(req, res) {

  // --- GESTION CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // --- SÉCURITÉ ---
  const clientApiKey = req.headers['x-api-key'];
  if (!clientApiKey || clientApiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Accès non autorisé (Clé API invalide)' });
  }

  try {
    const { selectedTags, subjectData, systemPrompt } = req.body;

    // --- 2. MODIFICATION ICI --- 
    // Au lieu du texte "Tu es un expert...", on appelle ta fonction du fichier utils
    const finalSystemPrompt = systemPrompt || getModernSystemPrompt(); 

    // --- APPEL HUGGING FACE (MISTRAL) ---
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          // On injecte le "finalSystemPrompt" (ton texte Modern) au début
          inputs: `<s>[INST] ${finalSystemPrompt} \n\nUser Data:\nTags: ${selectedTags?.join(', ') || ''}\nSubject: ${JSON.stringify(subjectData || {})} [/INST]`,
          parameters: {
            max_new_tokens: 400, // J'ai augmenté un peu car ton prompt système est long
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    );

    if (!hfResponse.ok) {
      const errorDetails = await hfResponse.text();
      throw new Error(`Erreur Hugging Face: ${hfResponse.status} - ${errorDetails}`);
    }

    const data = await hfResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Erreur Serveur:', error);
    res.status(500).json({ error: error.message });
  }
}
