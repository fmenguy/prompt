// api/generate-prompt.js

export default async function handler(req, res) {
  // ========================================
  // 🔒 CORS
  // ========================================
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
    // ========================================
    // 📥 RÉCUPÉRATION DES DONNÉES
    // ========================================
    const { basePrompt, selectedTags } = req.body;

    if (!selectedTags || Object.keys(selectedTags).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No tags selected'
      });
    }

    console.log('📨 Request received');
    console.log('📝 Base prompt:', basePrompt);
    console.log('🏷️ Tags count:', Object.keys(selectedTags).length);

    // ========================================
    // 🏗️ CONSTRUCTION DU CONTEXTE
    // ========================================
    const buildContext = () => {
      const parts = [];

      // 👤 SUJET
      if (selectedTags.subject?.length > 0) {
        parts.push(`Subject: ${selectedTags.subject.join(', ')}`);
      }

      // 🧬 PHYSIQUE
      const physical = [];
      if (selectedTags.age) physical.push(selectedTags.age);
      if (selectedTags.gender) physical.push(selectedTags.gender);
      if (selectedTags.species) physical.push(selectedTags.species);
      if (selectedTags.bodyType) physical.push(`${selectedTags.bodyType} build`);
      if (selectedTags.breastSize) physical.push(`${selectedTags.breastSize} chest`);
      if (selectedTags.buttSize) physical.push(`${selectedTags.buttSize} figure`);
      if (physical.length > 0) {
        parts.push(`Physical: ${physical.join(', ')}`);
      }

      // 💇 APPARENCE
      const appearance = [];
      if (selectedTags.hairLength) appearance.push(selectedTags.hairLength.replace(/_/g, ' '));
      if (selectedTags.hairColor) appearance.push(`${selectedTags.hairColor} hair`);
      if (selectedTags.hairStyle?.length > 0) {
        appearance.push(selectedTags.hairStyle.map(s => s.replace(/_/g, ' ')).join(', '));
      }
      if (selectedTags.eyes) appearance.push(`${selectedTags.eyes.replace(/_/g, ' ')} eyes`);
      if (selectedTags.facialExpression) appearance.push(selectedTags.facialExpression);
      if (appearance.length > 0) {
        parts.push(`Appearance: ${appearance.join(', ')}`);
      }

      // 👗 VÊTEMENTS
      const clothing = [];
      if (selectedTags.topwear) clothing.push(selectedTags.topwear.replace(/_/g, ' '));
      if (selectedTags.bottomwear) clothing.push(selectedTags.bottomwear.replace(/_/g, ' '));
      if (selectedTags.footwear) clothing.push(selectedTags.footwear);
      if (selectedTags.accessories?.length > 0) {
        clothing.push(selectedTags.accessories.map(a => a.replace(/_/g, ' ')).join(', '));
      }
      if (clothing.length > 0) {
        parts.push(`Clothing: ${clothing.join(', ')}`);
      }

      // 📸 COMPOSITION
      const composition = [];
      if (selectedTags.pose) composition.push(selectedTags.pose.replace(/_/g, ' '));
      if (selectedTags.viewpoint) composition.push(selectedTags.viewpoint.replace(/_/g, ' '));
      if (composition.length > 0) {
        parts.push(`Composition: ${composition.join(', ')}`);
      }

      // 🌍 ENVIRONNEMENT
      const environment = [];
      if (selectedTags.location) environment.push(selectedTags.location.replace(/_/g, ' '));
      if (selectedTags.timeOfDay) environment.push(selectedTags.timeOfDay.replace(/_/g, ' '));
      if (selectedTags.lighting) environment.push(selectedTags.lighting.replace(/_/g, ' '));
      if (selectedTags.weather) environment.push(selectedTags.weather);
      if (environment.length > 0) {
        parts.push(`Environment: ${environment.join(', ')}`);
      }

      // 🎨 STYLE
      const style = [];
      if (selectedTags.artMedium) style.push(selectedTags.artMedium.replace(/_/g, ' '));
      if (selectedTags.quality?.length > 0) {
        style.push(selectedTags.quality.join(', '));
      }
      if (style.length > 0) {
        parts.push(`Style: ${style.join(', ')}`);
      }

      return parts.join('\n');
    };

    const context = buildContext();

    // ========================================
// 🎯 DÉTECTION DU PRÉFIXE (1girl/1woman/1boy/1man)
// ========================================
let subjectPrefix = '';

if (selectedTags.gender === 'female') {
  if (['child', 'teen', 'young_adult'].includes(selectedTags.age)) {
    subjectPrefix = '1girl';
  } else if (['adult', 'middle_aged', 'mature', 'elder'].includes(selectedTags.age)) {
    subjectPrefix = '1woman';
  }
} else if (selectedTags.gender === 'male') {
  if (['child', 'teen', 'young_adult'].includes(selectedTags.age)) {
    subjectPrefix = '1boy';
  } else if (['adult', 'middle_aged', 'mature', 'elder'].includes(selectedTags.age)) {
    subjectPrefix = '1man';
  }
}

console.log('🎯 Subject prefix detected:', subjectPrefix || 'none');

// ========================================
// 💬 PROMPT SYSTÈME
// ========================================
const systemPrompt = `You are an expert at creating Stable Diffusion prompts.

**STRICT RULES:**
${subjectPrefix ? `1. ALWAYS START with "${subjectPrefix}"` : '1. Start with the main subject'}
2. Generate ONLY the optimized prompt, no introduction
3. Use precise, descriptive English terms
4. Separate concepts with commas
5. Structure: ${subjectPrefix || 'subject'} → traits → appearance → clothing → pose → environment → style
6. Maximum 200 words
7. NO quotes, NO explanations, JUST the prompt

**EXAMPLE OUTPUT:**
${subjectPrefix || '1woman'}, adult female vampire, petite build, medium chest, medium-length spiky curly blue hair...`;

const userMessage = `Create a professional Stable Diffusion prompt from:

${subjectPrefix ? `⚠️ MANDATORY: Start with "${subjectPrefix}"\n` : ''}
BASE TAGS: ${basePrompt}

ATTRIBUTES:
${context}

Combine naturally into one cohesive, flowing prompt.`;

    console.log('🎯 Calling Mistral API...');

    // ========================================
    // 🚀 APPEL MISTRAL
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
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          max_tokens: 400,
          temperature: 0.7,
          top_p: 0.9
        })
      }
    );

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();
      console.error('❌ Mistral error:', mistralResponse.status, errorText);
      throw new Error(`Mistral API error: ${mistralResponse.status}`);
    }

    const data = await mistralResponse.json();
    console.log('✅ Mistral response received');

    // ========================================
    // 🧹 NETTOYAGE
    // ========================================
    let generatedPrompt = data.choices[0].message.content.trim();

    // Suppression guillemets
    generatedPrompt = generatedPrompt.replace(/^["']|["']$/g, '');

    // Suppression introductions courantes
    const cleanPatterns = [
      /^(here is|here's|voici|the prompt is|prompt:|enhanced prompt:)\s*/i,
      /^.*?:\s*/
    ];

    cleanPatterns.forEach(pattern => {
      generatedPrompt = generatedPrompt.replace(pattern, '');
    });

    // Nettoyage final
    generatedPrompt = generatedPrompt
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .trim();

    console.log('✨ Final prompt length:', generatedPrompt.length);

    // ========================================
    // 📤 RÉPONSE
    // ========================================
    return res.status(200).json({
      success: true,
      generatedPrompt: generatedPrompt,
      model: 'mistral-small-latest',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Generation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
