// ✅ VERSION SÉCURISÉE avec variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_API_KEY;

export async function generateEnhancedPrompt(selectedTags, subjectData) {
  if (!API_KEY) {
    throw new Error('API_KEY non configurée');
  }

  try {
    console.log('🔄 Appel API:', API_URL);

    // Adapter les données pour correspondre au format attendu par le backend
    const payload = {
      context: subjectData.context || '',
      style: subjectData.style || '',
      tone: subjectData.tone || '',
      selectedTags: selectedTags || [],
      customInstructions: subjectData.customInstructions || ''
    };

    console.log('📤 Données envoyées:', payload);

    const response = await fetch(`${API_URL}/api/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate prompt');
    }

    const data = await response.json();
    return data.enhancedPrompt;

  } catch (error) {
    console.error('❌ Erreur génération prompt:', error);
    throw error;
  }
}
