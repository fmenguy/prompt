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
      context: subjectData.context || 'Génération d image', // Ajoute un contexte par défaut
      style: subjectData.style || '',
      tone: subjectData.tone || '',
      selectedTags: selectedTags || [],
      customInstructions: subjectData.customInstructions || '',
      systemPrompt: getModernSystemPrompt() // ✅ Nouveau prompt système
    };

    console.log('📤 Données envoyées:', payload);

    const response = await fetch(`${API_URL}/api/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(payload),
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
    return generateSmartFallback(selectedTags, subjectData);
  }
}

// ═══════════════════════════════════════════════════════
// NOUVEAU PROMPT SYSTÈME (2025)
// ═══════════════════════════════════════════════════════
function getModernSystemPrompt() {
  return `You are an expert AI prompt engineer for Stable Diffusion/NovelAI (2025 generation).

MODERN CONTEXT:
- Users select specialized models (AnythingV5 for anime, RealisticVision for photos)
- Models already define base style → don't over-specify unless user explicitly requests
- "realistic skin/lighting" can coexist with "anime style" (hybrid rendering)
- Focus on: composition, character details, lighting, camera work

STRUCTURE (strict order):
1. [count] (1girl, 1boy, 2girls, etc.)
2. [species/type] (elf, human, fox girl, etc.) - NEVER mix conflicting types
3. [physical details] (face, eyes, hair, skin texture, body type)
4. [clothing/accessories] (detailed fabric, colors, ornaments)
5. [pose/expression] (action, emotion, gesture)
6. [environment] (background, setting, atmosphere)
7. [camera/composition] (angle, framing, depth of field)
8. [lighting] (natural, cinematic, rim light, etc.)
9. [technical quality] (8k, ultra-detailed, masterpiece)
10. [artistic style] (ONLY if specific: "by artist_name", "oil painting", etc.)

CRITICAL RULES:
1. **Remove ALL duplicate tags**
2. **Resolve species conflicts:**
   - "elf" → long pointed ears (exclude animal ears)
   - "fox girl" → fox ears + tail (exclude elf ears)
   - "human" → normal ears (exclude elf/animal ears)
3. **Don't negate style keywords in negative prompt** (model handles it)
4. **Be ultra-specific on facial features** (eyes, skin, expression)
5. **Use natural flowing sentences**, not just comma lists
6. **Add artistic references ONLY for unique styles** (not for standard anime/realistic)

EXAMPLES:

Input: {species: "elf", gender: "female", tags: ["green eyes", "blonde hair", "hood", "close-up", "8k"]}
Output: "1girl, solo, beautiful female elf, delicate sharp elven features, long pointed elf ears, piercing emerald green eyes with intricate iris patterns, long flowing golden blonde hair with natural highlights, fair porcelain skin with subtle texture, wearing dark green hooded cloak with intricate embroidery, hood pulled slightly forward, close-up portrait, soft directional lighting highlighting cheekbones, shallow depth of field, cinematic composition, ultra-detailed, 8k resolution, masterpiece quality"

Input: {species: "fox girl", gender: "female", tags: ["red hair", "smile", "forest", "anime"]}
Output: "1girl, solo, adorable fox girl, fluffy red fox ears perked attentively, soft bushy fox tail, bright amber eyes with anime-style shine, vibrant crimson red hair in twin tails, warm peachy skin, gentle cheerful smile, wearing traditional red and white shrine maiden outfit, standing in mystical forest clearing, dappled sunlight filtering through ancient trees, dynamic three-quarter view, magical atmosphere with floating particles, vibrant colors, anime art style, highly detailed, best quality"

Input: {species: "human", gender: "male", tags: ["realistic", "warrior", "scar", "dramatic"]}
Output: "1man, solo, rugged human warrior, battle-hardened face with prominent scar across left cheek, intense steel-gray eyes, short dark hair with realistic strand detail, weathered skin with visible pores and texture, strong jawline with stubble, wearing medieval plate armor with realistic metal reflections and wear marks, holding greatsword, dramatic low-angle shot, stormy sky background, cinematic rim lighting from setting sun, photorealistic style, ultra-detailed, 8k, sharp focus"

Return ONLY the final prompt. No explanations, no markdown, no prefix/suffix.`;
}

// ═══════════════════════════════════════════════════════
// FALLBACK INTELLIGENT
// ═══════════════════════════════════════════════════════
function generateSmartFallback(tags, subject) {
  const parts = [];

  // 1. Count
  parts.push('1girl');

  // 2. Species (avec résolution de conflits)
  if (subject.species) {
    if (subject.species.toLowerCase().includes('elf')) {
      parts.push('solo, beautiful female elf, delicate pointed elf ears');
    } else if (subject.species.toLowerCase().includes('fox')) {
      parts.push('solo, fox girl, fluffy fox ears and tail');
    } else {
      parts.push(`solo, ${subject.species}`);
    }
  }

  // 3. Physical features
  const hairColor = tags.find(t => t.includes('hair'));
  const eyeColor = tags.find(t => t.includes('eyes'));

  if (eyeColor) parts.push(`${eyeColor} with detailed iris`);
  if (hairColor) parts.push(`${hairColor}`);

  // 4. Clothing
  const clothing = tags.filter(t =>
    t.includes('hood') ||
    t.includes('armor') ||
    t.includes('dress') ||
    t.includes('shirt')
  );
  if (clothing.length) parts.push(...clothing);

  // 5. Expression/Pose
  const expressions = tags.filter(t =>
    t.includes('smile') ||
    t.includes('angry') ||
    t.includes('sad')
  );
  if (expressions.length) parts.push(...expressions);

  // 6. Camera
  const camera = tags.filter(t =>
    t.includes('close-up') ||
    t.includes('wide-angle') ||
    t.includes('portrait')
  );
  if (camera.length) parts.push(...camera);

  // 7. Technical
  const technical = tags.filter(t =>
    t.includes('8k') ||
    t.includes('UHD') ||
    t.includes('detailed')
  );
  if (technical.length) {
    parts.push('ultra-detailed');
    parts.push(...technical);
  }

  // 8. Quality tags (pas de duplicates)
  const qualityTags = ['masterpiece', 'best quality'];
  const hasQuality = tags.some(t =>
    qualityTags.includes(t.toLowerCase())
  );
  if (!hasQuality) {
    parts.push('masterpiece', 'best quality');
  }

  // Dédupliquer et joindre
  const uniqueParts = [...new Set(parts)];
  return uniqueParts.join(', ');
}