// frontend/src/services/promptGenerator.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

// ═══════════════════════════════════════════════════════
// ADAPTATION DES TAGS POUR L'API
// ═══════════════════════════════════════════════════════
function adaptTagsFormat(selectedTags) {
  const adapted = { ...selectedTags };

  // ✅ Age : Déjà au bon format { min, max }
  if (adapted.age && typeof adapted.age === 'object') {
    // L'age est déjà au format attendu
  }

  // ✅ Gender : Déjà une string (pas besoin de conversion)
  // Supprimé le check inutile car handleGenderSelect stocke directement la valeur string

  // ✅ Convertir les arrays vides en null pour alléger le payload
  Object.keys(adapted).forEach(key => {
    if (Array.isArray(adapted[key]) && adapted[key].length === 0) {
      adapted[key] = null;
    }
  });

  return adapted;
}

// ═══════════════════════════════════════════════════════
// GÉNÉRATION DE LA DESCRIPTION D'ÂGE
// ═══════════════════════════════════════════════════════
function generateAgeDescription(ageRange, gender) {
  if (!ageRange || typeof ageRange !== 'object') return '';

  const { min, max } = ageRange;
  
  // Validation
  if (min < 18 || max < 18 || min > max) {
    console.warn('⚠️ Age range invalide:', ageRange);
    return '';
  }

  const avg = Math.floor((min + max) / 2);
  const genderTerm = gender === 'male' ? 'man' : 
                     gender === 'androgynous' ? 'person' : 'woman';

  // Descriptions par tranche d'âge
  if (avg >= 18 && avg < 25) {
    return `young ${genderTerm}, youthful appearance, smooth skin`;
  } else if (avg >= 25 && avg < 35) {
    return `${genderTerm} in their late twenties to early thirties, mature features`;
  } else if (avg >= 35 && avg < 45) {
    return `mature ${genderTerm}, refined features, slight signs of aging`;
  } else if (avg >= 45 && avg < 60) {
    return `middle-aged ${genderTerm}, distinguished appearance, visible maturity`;
  } else if (avg >= 60) {
    return `elderly ${genderTerm}, aged features, wisdom in expression`;
  }

  return `${genderTerm} around ${avg} years old`;
}

// ═══════════════════════════════════════════════════════
// FONCTION PRINCIPALE : GÉNÉRATION DE PROMPT AVEC IA
// ═══════════════════════════════════════════════════════
export async function generateEnhancedPrompt(selectedTags, options = {}) {
  const { characterCount = 1 } = options;

  console.log('🎨 Génération du prompt avec:', { selectedTags, characterCount });

  // ✅ Adaptation des tags
  const adaptedTags = adaptTagsFormat(selectedTags);

  // ✅ Génération de la description d'âge
  const ageDescription = generateAgeDescription(
    adaptedTags.age,
    adaptedTags.gender
  );

  // ✅ Construction du subject pour le fallback
  const subjectData = {
    type: adaptedTags.subject?.[0] || 'character',
    species: adaptedTags.species?.[0] || 'human',
    gender: adaptedTags.gender || 'female',
    age: adaptedTags.age,
    ageDescription,
  };

  // ✅ Payload pour l'API
  const payload = {
    characterCount,
    selectedTags: {
      ...adaptedTags,
      ageDescription, // Ajout de la description d'âge
    },
  };

  // ✅ Appel API avec timeout et gestion d'erreur robuste
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes

  try {
    console.log('📡 Envoi à l\'API:', payload);

    const response = await fetch(`${API_URL}/api/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'x-api-key': API_KEY }),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ✅ Gestion des erreurs HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur API (${response.status}):`, errorText);
      
      // Utiliser le fallback en cas d'erreur
      console.log('🔄 Utilisation du fallback intelligent');
      return generateSmartFallback(adaptedTags, subjectData);
    }

    const data = await response.json();
    console.log('✅ Réponse API:', data);

    // ✅ Validation de la réponse
    if (!data.prompt || typeof data.prompt !== 'string') {
      console.error('❌ Réponse API invalide:', data);
      return generateSmartFallback(adaptedTags, subjectData);
    }

    return data.prompt;

  } catch (error) {
    clearTimeout(timeoutId);

    // ✅ Gestion des différents types d'erreurs
    if (error.name === 'AbortError') {
      console.error('⏱️ Timeout API (30s dépassées)');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('🌐 Erreur réseau - API inaccessible');
    } else {
      console.error('❌ Erreur inattendue:', error);
    }

    // ✅ Fallback en cas d'erreur
    console.log('🔄 Utilisation du fallback intelligent');
    return generateSmartFallback(adaptedTags, subjectData);
  }
}

// ═══════════════════════════════════════════════════════
// PROMPT SYSTÈME POUR L'IA (DOCUMENTATION)
// ═══════════════════════════════════════════════════════
export function getSystemPrompt() {
  return `You are an expert AI image prompt engineer specializing in Stable Diffusion and similar text-to-image models.

TASK: Transform structured tag data into a cohesive, natural-language prompt that produces high-quality images.

RULES:
1. START with character count (1girl, 1boy, 2girls, etc.) and "solo" if count=1
2. ADD age description if provided (young woman, mature man, elderly person, etc.)
3. INTEGRATE species naturally (elf = "beautiful elf with delicate pointed ears", fox girl = "adorable fox girl with fluffy ears and tail")
4. RESOLVE conflicts:
   - Remove human ears if animal ears present
   - Adjust clothing for species (elves = elegant/fantasy, fox = traditional/playful)
5. BUILD coherent descriptions:
   - Physical features flow naturally (eyes → hair → body)
   - Clothing described as complete outfit
   - Environment integrated with character
6. USE quality boosters: ultra-detailed, masterpiece, best quality, 8k
7. ADD camera angles and lighting for composition
8. AVOID: Contradictions, repetition, unnatural phrasing

STYLE: Natural, descriptive, comma-separated tags that flow like a scene description.

EXAMPLES:

Input: {species: "elf", gender: "female", tags: ["green eyes", "long hair", "forest", "cloak"]}
Output: "1girl, solo, beautiful elf with delicate pointed elf ears, enchanting emerald green eyes with mystical glow, flowing silver-blonde hair cascading past shoulders, pale luminous skin, serene expression, wearing dark green hooded cloak with intricate embroidery, hood pulled slightly forward, close-up portrait, soft directional lighting highlighting cheekbones, shallow depth of field, cinematic composition, ultra-detailed, 8k resolution, masterpiece quality"

Input: {species: "fox girl", gender: "female", tags: ["red hair", "smile", "forest", "anime"]}
Output: "1girl, solo, adorable fox girl, fluffy red fox ears perked attentively, soft bushy fox tail, bright amber eyes with anime-style shine, vibrant crimson red hair in twin tails, warm peachy skin, gentle cheerful smile, wearing traditional red and white shrine maiden outfit, standing in mystical forest clearing, dappled sunlight filtering through ancient trees, dynamic three-quarter view, magical atmosphere with floating particles, vibrant colors, anime art style, highly detailed, best quality"

Input: {species: "human", gender: "male", tags: ["realistic", "warrior", "scar", "dramatic"]}
Output: "1man, solo, rugged human warrior, battle-hardened face with prominent scar across left cheek, intense steel-gray eyes, short dark hair with realistic strand detail, weathered skin with visible pores and texture, strong jawline with stubble, wearing medieval plate armor with realistic metal reflections and wear marks, holding greatsword, dramatic low-angle shot, stormy sky background, cinematic rim lighting from setting sun, photorealistic style, ultra-detailed, 8k, sharp focus"

Return ONLY the final prompt. No explanations, no markdown, no prefix/suffix.`;
}

// ═══════════════════════════════════════════════════════
// FALLBACK INTELLIGENT (SI L'API ÉCHOUE)
// ═══════════════════════════════════════════════════════
function generateSmartFallback(tags, subject) {
  console.log('🤖 Génération du fallback avec:', { tags, subject });

  const parts = [];

  // ✅ 1. Count tag basé sur le genre
  const genderValue = tags.gender || 'female';
  const countTag = genderValue === 'male' ? '1boy' : 
                   genderValue === 'androgynous' ? '1person' : '1girl';

  parts.push(countTag, 'solo');

  // ✅ 2. Description d'âge
  if (subject.ageDescription) {
    parts.push(subject.ageDescription);
  }

  // ✅ 3. Species (avec gestion intelligente)
  if (subject.species) {
    const speciesLower = subject.species.toLowerCase();
    
    if (speciesLower.includes('elf')) {
      parts.push('beautiful elf', 'delicate pointed elf ears', 'ethereal appearance');
    } else if (speciesLower.includes('fox')) {
      parts.push('fox person', 'fluffy fox ears', 'soft fox tail');
    } else if (speciesLower.includes('cat')) {
      parts.push('cat person', 'cute cat ears', 'feline tail');
    } else if (speciesLower.includes('wolf')) {
      parts.push('wolf person', 'alert wolf ears', 'fluffy wolf tail');
    } else if (speciesLower !== 'human') {
      parts.push(subject.species);
    }
  }

  // ✅ 4. Physical features
  const processArrayTags = (category) => {
    if (Array.isArray(tags[category]) && tags[category].length > 0) {
      return tags[category];
    }
    return [];
  };

  // Eyes
  const eyeTags = processArrayTags('eyes');
  if (eyeTags.length) {
    parts.push(`${eyeTags.join(', ')}`);
  }

  // Hair
  const hairTags = processArrayTags('hair');
  if (hairTags.length) {
    parts.push(`${hairTags.join(', ')}`);
  }

  // Body type
  const bodyTags = processArrayTags('bodyType');
  if (bodyTags.length) {
    parts.push(...bodyTags);
  }

  // Facial expression
  const expressionTags = processArrayTags('facialExpression');
  if (expressionTags.length) {
    parts.push(...expressionTags);
  }

  // ✅ 5. Clothing
  const clothingParts = [];
  
  const topwear = processArrayTags('topwear');
  const bottomwear = processArrayTags('bottomwear');
  const legwear = processArrayTags('legwear');
  const footwear = processArrayTags('footwear');

  if (topwear.length) clothingParts.push(...topwear);
  if (bottomwear.length) clothingParts.push(...bottomwear);
  if (legwear.length) clothingParts.push(...legwear);
  if (footwear.length) clothingParts.push(...footwear);

  if (clothingParts.length) {
    parts.push(`wearing ${clothingParts.join(', ')}`);
  }

  // ✅ 6. Accessories
  const accessories = processArrayTags('accessories');
  if (accessories.length) {
    parts.push(...accessories);
  }

  // Headwear
  const headwear = processArrayTags('headwear');
  if (headwear.length) {
    parts.push(...headwear);
  }

  // Ears (accessoires d'oreilles, pas les oreilles animales)
  const ears = processArrayTags('ears');
  if (ears.length) {
    parts.push(...ears);
  }

  // ✅ 7. Pose & Action
  const pose = processArrayTags('pose');
  if (pose.length) {
    parts.push(...pose);
  }

  const action = processArrayTags('action');
  if (action.length) {
    parts.push(...action);
  }

  // ✅ 8. Environment
  const location = processArrayTags('location');
  if (location.length) {
    parts.push(`in ${location.join(', ')}`);
  }

  const timeOfDay = processArrayTags('timeOfDay');
  if (timeOfDay.length) {
    parts.push(...timeOfDay);
  }

  const weather = processArrayTags('weather');
  if (weather.length) {
    parts.push(...weather);
  }

  // ✅ 9. Composition
  const viewpoint = processArrayTags('viewpoint');
  if (viewpoint.length) {
    parts.push(...viewpoint);
  }

  const lighting = processArrayTags('lighting');
  if (lighting.length) {
    parts.push(...lighting);
  }

  // ✅ 10. Style
  const artist = processArrayTags('artist');
  if (artist.length) {
    parts.push(`art style inspired by ${artist.join(', ')}`);
  }

  const artMedium = processArrayTags('artMedium');
  if (artMedium.length) {
    parts.push(...artMedium);
  }

  // ✅ 11. Quality tags
  const quality = processArrayTags('quality');
  if (quality.length) {
    parts.push(...quality);
  } else {
    // Tags de qualité par défaut
    parts.push('ultra-detailed', 'masterpiece', 'best quality', 'high resolution');
  }

  // ✅ 12. Déduplication et assemblage final
  const uniqueParts = [...new Set(parts)];
  const finalPrompt = uniqueParts.join(', ');

  console.log('✅ Fallback généré:', finalPrompt);
  
  return finalPrompt;
}