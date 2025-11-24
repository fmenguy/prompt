// backend/api/generate-prompt.js

export default async function handler(req, res) {
  // ========================================
  // 🔒 CORS & SÉCURITÉ
  // ========================================
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vérification de la clé API
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  // ========================================
  // 📥 RÉCUPÉRATION DES DONNÉES
  // ========================================
  const { basePrompt, selectedTags } = req.body;

  if (!basePrompt || !selectedTags) {
    return res.status(400).json({ 
      error: 'basePrompt et selectedTags requis' 
    });
  }

  console.log('📨 Requête reçue:', { basePrompt, tagsCount: Object.keys(selectedTags).length });

  // ========================================
  // 🏗️ CONSTRUCTION DU CONTEXTE
  // ========================================
  const buildContext = () => {
    const parts = [];
    
    // Sujet principal
    if (selectedTags.subject?.length > 0) {
      parts.push(`Subject: ${selectedTags.subject.join(', ')}`);
    }
    
    // Caractéristiques physiques
    const physical = [];
    if (selectedTags.gender) physical.push(selectedTags.gender);
    if (selectedTags.age) physical.push(`${selectedTags.age.min}-${selectedTags.age.max} years old`);
    if (selectedTags.species) physical.push(selectedTags.species);
    if (selectedTags.bodyType) physical.push(selectedTags.bodyType);
    if (physical.length > 0) {
      parts.push(`Physical: ${physical.join(', ')}`);
    }
    
    // Apparence
    const appearance = [];
    if (selectedTags.hairLength) appearance.push(`${selectedTags.hairLength} hair`);
    if (selectedTags.hairColor) appearance.push(`${selectedTags.hairColor} hair`);
    if (selectedTags.hairStyle?.length > 0) appearance.push(selectedTags.hairStyle.join(', '));
    if (selectedTags.eyes) appearance.push(`${selectedTags.eyes} eyes`);
    if (selectedTags.facialExpression) appearance.push(selectedTags.facialExpression);
    if (appearance.length > 0) {
      parts.push(`Appearance: ${appearance.join(', ')}`);
    }
    
    // Vêtements
    const clothing = [];
    if (selectedTags.topwear) clothing.push(selectedTags.topwear);
    if (selectedTags.bottomwear) clothing.push(selectedTags.bottomwear);
    if (selectedTags.footwear) clothing.push(selectedTags.footwear);
    if (selectedTags.accessories?.length > 0) clothing.push(selectedTags.accessories.join(', '));
    if (clothing.length > 0) {
      parts.push(`Clothing: ${clothing.join(', ')}`);
    }
    
    // Pose et cadrage
    const composition = [];
    if (selectedTags.pose) composition.push(selectedTags.pose);
    if (selectedTags.viewpoint) composition.push(selectedTags.viewpoint);
    if (composition.length > 0) {
      parts.push(`Composition: ${composition.join(', ')}`);
    }
    
    // Environnement
    const environment = [];
    if (selectedTags.location) environment.push(selectedTags.location);
    if (selectedTags.timeOfDay) environment.push(selectedTags.timeOfDay);
    if (selectedTags.lighting) environment.push(selectedTags.lighting);
    if (selectedTags.weather) environment.push(selectedTags.weather);
    if (environment.length > 0) {
      parts.push(`Environment: ${environment.join(', ')}`);
    }
    
    // Style artistique
    const style = [];
    if (selectedTags.artMedium) style.push(selectedTags.artMedium);
    if (selectedTags.quality?.length > 0) style.push(selectedTags.quality.join(', '));
    if (style.length > 0) {
      parts.push(`Style: ${style.join(', ')}`);
    }
    
    return parts.join('\n');
  };

  const context = buildContext();

  // ========================================
  // 💬 CONSTRUCTION DU PROMPT SYSTÈME
  // ========================================
  const systemPrompt = `Tu es un expert en création de prompts pour Stable Diffusion. 

**RÈGLES STRICTES :**
1. Génère UNIQUEMENT le prompt optimisé, sans introduction ni explication
2. Utilise des termes précis et descriptifs
3. Sépare les concepts par des virgules
4. Privilégie l'anglais technique
5. Maximum 200 mots
6. Structure : sujet → apparence → vêtements → pose → environnement → style artistique
7. N'ajoute JAMAIS de texte avant ou après le prompt
8. Ne mets AUCUN guillemet autour du prompt

**EXEMPLE DE SORTIE VALIDE :**
masterpiece, best quality, 1girl, young woman, 20 years old, athletic build, long flowing blonde hair, blue eyes, confident smile, wearing red leather jacket, black jeans, standing pose, three-quarter view, urban street at sunset, golden hour lighting, photorealistic, 8k, highly detailed`;

  // ========================================
  // 🎨 CONSTRUCTION DU MESSAGE UTILISATEUR
  // ========================================
  const userMessage = `Transforme cette demande en prompt professionnel pour Stable Diffusion :

DEMANDE DE BASE :
"${basePrompt}"

TAGS SÉLECTIONNÉS :
${context}

Génère maintenant un prompt optimisé qui combine harmonieusement la demande de base et tous les tags. Le prompt doit être fluide, cohérent et directement utilisable dans Stable Diffusion.`;

  console.log('🎯 Envoi vers Mistral AI...');

  try {
    // ========================================
    // 🚀 APPEL À L'API MISTRAL OFFICIELLE
    // ========================================
    const mistralResponse = await fetch(
      'https://api.mistral.ai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "open-mistral-7b", // fme :model gratuit normalement !
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.75,
          top_p: 0.9
        })
      }
    );

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();
      console.error('❌ Erreur Mistral:', errorText);
      throw new Error(`Mistral API: ${mistralResponse.status} - ${errorText}`);
    }

    const data = await mistralResponse.json();
    console.log('✅ Réponse Mistral reçue');

    // ========================================
    // 🧹 NETTOYAGE DE LA RÉPONSE
    // ========================================
    let generatedPrompt = data.choices[0].message.content.trim();
    
    // Suppression des guillemets éventuels
    generatedPrompt = generatedPrompt.replace(/^["']|["']$/g, '');
    
    // Suppression des phrases d'introduction
    const introPatterns = [
      /^(here is|here's|voici|voilà|the prompt is|prompt:|enhanced prompt:)\s*/i,
      /^.*?:\s*/  // Tout ce qui se termine par ":"
    ];
    
    introPatterns.forEach(pattern => {
      generatedPrompt = generatedPrompt.replace(pattern, '');
    });
    
    // Nettoyage final
    generatedPrompt = generatedPrompt
      .replace(/\s+/g, ' ')  // Espaces multiples
      .replace(/,\s*,/g, ',')  // Virgules doubles
      .trim();

    console.log('✨ Prompt nettoyé:', generatedPrompt.substring(0, 100) + '...');

    // ========================================
    // 📤 RÉPONSE
    // ========================================
    return res.status(200).json({
      success: true,
      generatedPrompt: generatedPrompt,
      model: 'open-mistral-7b',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Erreur:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération',
      details: error.message
    });
  }
}
