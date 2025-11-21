// Détection automatique de l'environnement
const API_URL = import.meta.env.PROD 
  ? 'https://prompt-generator-4gj85y1h9-francois-menguys-projects.vercel.app'
  : 'http://localhost:3001';          // Développement local

const API_KEY = 'sk_prod_d844037cde814fecb36a0813208819a0';

export async function generateEnhancedPrompt(selectedTags, subjectData) {
  try {
    console.log('🔄 Appel API:', API_URL);

    const response = await fetch(`${API_URL}/api/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY, // ✅ Ajout de la clé API
      },
      body: JSON.stringify({ selectedTags, subjectData }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.fallback) {
      console.warn('⚠️ Mode fallback activé:', data.error);
    } else {
      console.log('✅ Prompt généré avec succès');
    }

    return data.prompt;

  } catch (error) {
    console.error('❌ Erreur réseau:', error);

    // Fallback total en cas d'échec
    let fallback = 'masterpiece, best quality, ';
    if (subjectData.species) fallback += `${subjectData.species} `;
    if (subjectData.gender) fallback += `${subjectData.gender} `;
    if (subjectData.age) fallback += `${subjectData.age}, `;
    fallback += selectedTags.join(', ');

    return fallback;
  }
}