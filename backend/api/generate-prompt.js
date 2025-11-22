// ═══════════════════════════════════════════════════════════════
// 📁 backend/api/generate-prompt.js
// Version robuste avec gestion d'erreurs renforcée
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // ═══ CORS ═══
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ═══ EXTRACTION SÉCURISÉE DES DONNÉES ═══
    const { 
      context = '', 
      style = '', 
      tone = '', 
      selectedTags = [],  // Tableau par défaut
      customInstructions = '' 
    } = req.body || {};

    console.log('📥 Données reçues:', {
      context,
      style,
      tone,
      selectedTags,
      customInstructions
    });

    // ═══ VALIDATION ═══
    if (!context || typeof context !== 'string' || context.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Le contexte est requis',
        received: { context, type: typeof context }
      });
    }

    // ═══ GESTION ULTRA-ROBUSTE DES TAGS ═══
    let tagList = 'Aucun';
    
    if (selectedTags) {
      if (Array.isArray(selectedTags)) {
        const validTags = selectedTags.filter(tag => 
          tag && typeof tag === 'string' && tag.trim().length > 0
        );
        if (validTags.length > 0) {
          tagList = validTags.join(', ');
        }
      } else if (typeof selectedTags === 'string') {
        tagList = selectedTags;
      }
    }

    console.log('🏷️ Tags traités:', tagList);

    // ═══ CONSTRUCTION DU PROMPT ═══
    const generatedPrompt = `# Prompt Optimisé IA

**Contexte** : ${context.trim()}

**Style** : ${style || 'Standard'}

**Ton** : ${tone || 'Neutre'}

**Tags** : ${tagList}

${customInstructions ? `**Instructions complémentaires** : ${customInstructions}\n` : ''}

---

## Structure recommandée

1. **Objectif principal** : [À définir selon le contexte]

2. **Contraintes** :
   - Respecter le style : ${style || 'Standard'}
   - Adopter un ton : ${tone || 'Neutre'}

3. **Livrables attendus** : [À préciser]

---

*Généré le ${new Date().toLocaleString('fr-FR')}*`;

    console.log('✅ Prompt généré avec succès');

    return res.status(200).json({
      success: true,
      prompt: generatedPrompt,
      model: 'template-based',
      metadata: {
        context: context.substring(0, 50) + '...',
        style,
        tone,
        tagsCount: Array.isArray(selectedTags) ? selectedTags.length : 0
      }
    });

  } catch (error) {
    console.error('❌ Erreur backend:', error);
    
    return res.status(500).json({
      error: 'Erreur serveur',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
