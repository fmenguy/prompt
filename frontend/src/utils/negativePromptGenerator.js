// frontend/src/utils/negativePromptGenerator.js

/**
 * ✅ Génère le negative prompt basé sur les tags sélectionnés
 * @param {Array<string>|Object} tagsOrObject - Array de tags OU objet selectedTags complet
 * @returns {string} Le negative prompt
 */
export function generateNegativePrompt(tagsOrObject = {}) {
  // ═══════════════════════════════════════════════
  // ✅ GESTION DES 2 FORMATS D'ENTRÉE
  // ═══════════════════════════════════════════════
  let tags = [];
  let structuredTags = {}; // ✅ NOUVEAU : Pour accès direct aux catégories

  if (Array.isArray(tagsOrObject)) {
    // Format 1: Array de tags ["elf", "smile", ...]
    tags = tagsOrObject;
  } else if (typeof tagsOrObject === 'object' && tagsOrObject !== null) {
    // Format 2: Objet selectedTags {gender: 'female', hairLength: 'long_hair', ...}
    structuredTags = tagsOrObject; // ✅ Garde l'objet structuré
    
    // Flatten tous les tags dans un array
    // eslint-disable-next-line no-unused-vars
    Object.entries(tagsOrObject).forEach(([key, value]) => { // ✅ CORRECTION : [key, value]
      if (Array.isArray(value)) {
        // Multi-select: ['ponytail', 'bangs']
        tags.push(...value);
      } else if (typeof value === 'string' && value) {
        // Single-select: 'female', 'long_hair'
        tags.push(value);
      } else if (typeof value === 'object' && value?.value) {
        // Objet {value: 'female', label: 'Female'}
        tags.push(value.value);
      }
    });
  }

  console.log('🚫 Negative prompt - Tags reçus:', tags);
  console.log('🚫 Tags structurés:', structuredTags);

  const negatives = new Set([
    // Qualité générale
    "lowres", "bad anatomy", "bad hands", "text", "error",
    "missing fingers", "extra digit", "fewer digits", "cropped",
    "worst quality", "low quality", "normal quality", "jpeg artifacts",
    "signature", "watermark", "username", "blurry",

    // Anatomie
    "deformed", "ugly", "mutation", "mutilated", "extra limbs",
    "poorly drawn hands", "poorly drawn face", "malformed limbs",
    "out of frame", "extra fingers", "fused fingers", "too many fingers",
    "long neck", "gross proportions", "bad proportions"
  ]);

  // ═══════════════════════════════════════════════
  // CONFLITS PHYSIQUES UNIQUEMENT
  // ═══════════════════════════════════════════════

  // 1. Espèces mutuellement exclusives
  const hasElf = tags.some(t => 
    t?.toLowerCase().includes("elf") || 
    t?.toLowerCase().includes("elven")
  );

  const hasAnimalEars = tags.some(t => 
    t?.toLowerCase().includes("fox ears") || 
    t?.toLowerCase().includes("cat ears") ||
    t?.toLowerCase().includes("wolf ears") ||
    t?.toLowerCase().includes("bunny ears")
  );

  if (hasElf && !hasAnimalEars) {
    negatives.add("fox ears");
    negatives.add("cat ears");
    negatives.add("animal ears");
    negatives.add("wolf ears");
    negatives.add("bunny ears");
    negatives.add("furry");
    negatives.add("tail");
  }

  if (hasAnimalEars && !hasElf) {
    negatives.add("elf ears");
    negatives.add("pointed ears");
  }

  // 2. Nombre de personnages
  const hasSolo = tags.some(t => 
    t?.toLowerCase() === "solo" || 
    t?.toLowerCase() === "1girl" ||
    t?.toLowerCase() === "1boy"
  );

  if (hasSolo) {
    negatives.add("multiple girls");
    negatives.add("multiple boys");
    negatives.add("2girls");
    negatives.add("3girls");
    negatives.add("crowd");
    negatives.add("group");
  }

  // ═══════════════════════════════════════════════
  // ✅ 3. EXPRESSIONS - VERSION CORRIGÉE
  // ═══════════════════════════════════════════════
  const facialExpression = structuredTags.facialExpression || '';
  const hasSmile = 
    facialExpression.toLowerCase().includes("smile") ||
    tags.some(t => t?.toLowerCase().includes("smile"));
  
  const hasAngry = 
    facialExpression.toLowerCase().includes("angry") ||
    tags.some(t => t?.toLowerCase().includes("angry"));

  if (hasSmile && !hasAngry) {
    negatives.add("sad");
    negatives.add("crying");
    negatives.add("frown");
    negatives.add("angry");
  } else if (hasAngry && !hasSmile) {
    negatives.add("smiling");
    negatives.add("laughing");
    negatives.add("happy");
    negatives.add("grinning");
  }

  // ═══════════════════════════════════════════════
  // ✅ 4. CHEVEUX - GESTION DES 3 CATÉGORIES
  // ═══════════════════════════════════════════════
  const hairLength = structuredTags.hairLength || '';
  const hairColor = structuredTags.hairColor || '';

  // Si cheveux courts → exclure cheveux longs
  if (hairLength.includes('short')) {
    negatives.add("long hair");
    negatives.add("very long hair");
  }

  // Si cheveux longs → exclure cheveux courts
  if (hairLength.includes('long') || hairLength.includes('very_long')) {
    negatives.add("short hair");
    negatives.add("bald");
  }

  // Si une couleur de cheveux est définie → exclure les autres couleurs principales
  const hairColors = ['blonde', 'brown', 'black', 'red', 'white', 'blue', 'pink', 'green'];
  if (hairColor) {
    hairColors.forEach(color => {
      if (!hairColor.toLowerCase().includes(color)) {
        negatives.add(`${color} hair`);
      }
    });
  }

  // ═══════════════════════════════════════════════
  // 5. VÊTEMENTS
  // ═══════════════════════════════════════════════
  const hasArmor = tags.some(t => t?.toLowerCase().includes("armor"));
  const hasNaked = tags.some(t => 
    t?.toLowerCase().includes("naked") || 
    t?.toLowerCase().includes("nude")
  );

  if (hasArmor) {
    negatives.add("naked");
    negatives.add("nude");
    negatives.add("topless");
  }

  if (hasNaked) {
    negatives.add("armor");
    negatives.add("fully clothed");
    negatives.add("dress");
    negatives.add("shirt");
  }

  const result = Array.from(negatives).join(", ");
  console.log('✅ Negative prompt généré:', result);

  return result;
}
