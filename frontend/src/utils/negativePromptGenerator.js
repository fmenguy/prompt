// frontend/src/utils/negativePromptGenerator.js

/**
 * ✅ Génère le negative prompt basé sur les tags sélectionnés
 * @param {Array<string>|Object} tagsOrObject - Array de tags OU objet selectedTags complet
 * @returns {string} Le negative prompt
 */
export function generateNegativePrompt(tagsOrObject = {}) {
  // ✅ GESTION DES 2 FORMATS D'ENTRÉE
  let tags = [];

  if (Array.isArray(tagsOrObject)) {
    // Format 1: Array de tags ["elf", "smile", ...]
    tags = tagsOrObject;
  } else if (typeof tagsOrObject === 'object' && tagsOrObject !== null) {
    // Format 2: Objet selectedTags {bodyType: [...], hair: [...], ...}
    tags = Object.values(tagsOrObject)
      .filter(value => Array.isArray(value))
      .flat();
    
    // Récupérer aussi les tags simples (age, gender, species...)
    Object.entries(tagsOrObject).forEach(([value]) => {
      if (typeof value === 'string' && value) {
        tags.push(value);
      } else if (typeof value === 'object' && value?.value) {
        tags.push(value.value); // Pour les objets {value: 'female', label: 'Female'}
      }
    });
  }

  console.log('🚫 Negative prompt - Tags reçus:', tags);

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

  // 3. Expressions contradictoires
  const hasSmile = tags.some(t => t?.toLowerCase().includes("smile"));
  const hasAngry = tags.some(t => t?.toLowerCase().includes("angry"));

  if (hasSmile && !hasAngry) {
    negatives.add("sad");
    negatives.add("crying");
    negatives.add("frown");
  } else if (hasAngry && !hasSmile) {
    negatives.add("laughing");
    negatives.add("happy");
  }

  // 4. Vêtements incompatibles
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
  }

  const result = Array.from(negatives).join(", ");
  console.log('✅ Negative prompt généré:', result);
  
  return result;
}
