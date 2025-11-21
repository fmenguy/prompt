// frontend/src/utils/negativePromptGenerator.js

export function generateNegativePrompt(tags, subject) {
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
    t.toLowerCase().includes("elf") || 
    t.toLowerCase().includes("elven")
  );
  
  const hasAnimalEars = tags.some(t => 
    t.toLowerCase().includes("fox ears") || 
    t.toLowerCase().includes("cat ears") ||
    t.toLowerCase().includes("wolf ears") ||
    t.toLowerCase().includes("bunny ears")
  );

  if (hasElf && !hasAnimalEars) {
    // Si elf mais pas d'oreilles animales → exclure les oreilles animales
    negatives.add("fox ears");
    negatives.add("cat ears");
    negatives.add("animal ears");
    negatives.add("wolf ears");
    negatives.add("bunny ears");
    negatives.add("furry");
    negatives.add("tail");
  }

  if (hasAnimalEars && !hasElf) {
    // Si oreilles animales mais pas elf → exclure oreilles d'elfe
    negatives.add("elf ears");
    negatives.add("pointed ears");
  }

  // 2. Nombre de personnages
  const hasSolo = tags.some(t => 
    t.toLowerCase() === "solo" || 
    t.toLowerCase() === "1girl" ||
    t.toLowerCase() === "1boy"
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
  const hasSmile = tags.some(t => t.toLowerCase().includes("smile"));
  const hasAngry = tags.some(t => t.toLowerCase().includes("angry"));

  if (hasSmile && hasAngry) {
    // Garder les deux → pas de négation (expression complexe)
  } else if (hasSmile) {
    negatives.add("sad");
    negatives.add("crying");
    negatives.add("frown");
  } else if (hasAngry) {
    negatives.add("laughing");
    negatives.add("happy");
  }

  // 4. Vêtements incompatibles
  const hasArmor = tags.some(t => t.toLowerCase().includes("armor"));
  const hasNaked = tags.some(t => 
    t.toLowerCase().includes("naked") || 
    t.toLowerCase().includes("nude")
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

  // ═══════════════════════════════════════════════
  // PAS DE NÉGATION DE STYLE
  // ═══════════════════════════════════════════════
  // Le modèle choisi par l'utilisateur définit déjà le style
  // "realistic skin" peut coexister avec "anime style"
  // Pas besoin d'exclure "anime" si "Realism" est présent

  return Array.from(negatives).join(", ");
}