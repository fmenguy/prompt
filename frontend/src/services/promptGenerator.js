// frontend/src/services/promptGenerator.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * 🎨 Génère un prompt amélioré via l'API Mistral
 */
export async function generateEnhancedPrompt(basePrompt, selectedTags) {
  
  if (!basePrompt?.trim()) {
    throw new Error('Le prompt de base ne peut pas être vide');
  }

  console.log('🚀 Appel API génération prompt...');
  console.log('📝 Base:', basePrompt);
  console.log('🏷️ Tags:', selectedTags);

  try {
    const response = await fetch(`${API_URL}/api/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basePrompt: basePrompt.trim(),
        selectedTags
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.generatedPrompt) {
      throw new Error('Réponse API invalide');
    }

    console.log('✅ Prompt généré avec succès');
    return data.generatedPrompt;

  } catch (error) {
    console.error('❌ Erreur génération:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    }
    
    throw error;
  }
}
