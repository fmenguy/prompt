import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Prompt Generator API'
  });
});

// Endpoint principal
app.post('/api/generate-prompt', async (req, res) => {
  const { selectedTags, subjectData } = req.body;

  // Validation
  if (!selectedTags || selectedTags.length === 0) {
    return res.status(400).json({ 
      error: 'Aucun tag sélectionné',
      fallback: true 
    });
  }

  try {
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
    
    if (subjectData.species) userPrompt += `Subject: ${subjectData.species}`;
    if (subjectData.gender) userPrompt += `, ${subjectData.gender}`;
    if (subjectData.age) userPrompt += `, ${subjectData.age}`;
    
    userPrompt += `\n\nGenerate a natural, flowing prompt.`;

    // Appel à Hugging Face
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
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
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    let generatedText = result[0]?.generated_text || '';

    // Nettoyage
    generatedText = generatedText
      .replace(/^.*?\[\/INST\]\s*/s, '')
      .replace(/\n+/g, ' ')
      .trim();

    res.json({ 
      prompt: generatedText,
      fallback: false,
      tokens_used: result[0]?.details?.tokens?.length || 0
    });

  } catch (error) {
    console.error('❌ Erreur génération:', error.message);
    
    // Fallback manuel
    let fallbackPrompt = 'masterpiece, best quality, highly detailed, ';
    if (subjectData.species) fallbackPrompt += `${subjectData.species} `;
    if (subjectData.gender) fallbackPrompt += `${subjectData.gender} `;
    if (subjectData.age) fallbackPrompt += `${subjectData.age}, `;
    fallbackPrompt += selectedTags.join(', ');

    res.json({ 
      prompt: fallbackPrompt,
      fallback: true,
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 Frontend autorisé: ${process.env.FRONTEND_URL || 'Tous'}`);
  console.log(`🔑 Token HF: ${process.env.HF_TOKEN ? '✅ Configuré' : '❌ Manquant'}\n`);
});
