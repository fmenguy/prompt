// frontend/src/data/tagConflicts.js

export const tagConflicts = {
  // ═══════════════════════════════════════════════
  // 🧬 GENRE (strictement exclusif)
  // ═══════════════════════════════════════════════
  gender: {
    male: ['female', 'girl', 'woman', 'feminine'],
    female: ['male', 'boy', 'man', 'masculine'],
    androgynous: [],
  },

  // ═══════════════════════════════════════════════
  // 👥 ESPÈCES (certaines incompatibles avec genre)
  // ═══════════════════════════════════════════════
  species: {
    human: [],
    elf: [],
    dark_elf: [],
    dwarf: [],
    orc: [],
    tiefling: [],
    dragonborn: [],
    vampire: [],
    werewolf: [],
    fairy: [],
    demon: [],
    angel: [],
    cyborg: [],
    android: [],
    alien: [],
  },

  // ═══════════════════════════════════════════════
  // 💪 MORPHOLOGIE (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  bodyType: {
    slender: ['muscular', 'voluptuous', 'curvy'],
    athletic: ['voluptuous'],
    muscular: ['slender', 'petite', 'voluptuous'],
    curvy: ['slender', 'petite'],
    petite: ['tall', 'muscular', 'curvy'],
    tall: ['petite'],
    average: [],
    voluptuous: ['slender', 'petite', 'athletic', 'muscular'],
  },

  // ═══════════════════════════════════════════════
  // 💇 LONGUEUR CHEVEUX (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  hairLength: {
    bald: ['long_hair', 'short_hair', 'medium_hair', 'very_long_hair'],
    long_hair: ['bald', 'short_hair', 'very_long_hair'],
    short_hair: ['bald', 'long_hair', 'very_long_hair'],
    medium_hair: ['bald', 'very_long_hair'],
    very_long_hair: ['bald', 'short_hair', 'medium_hair'],
  },

  // ═══════════════════════════════════════════════
  // 💇 STYLE CHEVEUX (peut coexister)
  // ═══════════════════════════════════════════════
  hairStyle: {
    straight_hair: ['curly_hair', 'wavy_hair'],
    wavy_hair: ['straight_hair', 'curly_hair'],
    curly_hair: ['straight_hair', 'wavy_hair'],
    braided_hair: [],
    ponytail: ['bun'],
    bun: ['ponytail'],
    messy_hair: [],
    spiky_hair: [],
  },

  // ═══════════════════════════════════════════════
  // 🎨 COULEUR CHEVEUX (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  hairColor: {
    blonde: ['brown', 'black', 'red', 'white', 'silver', 'blue', 'pink', 'purple', 'green'],
    brown: ['blonde', 'black', 'red', 'white', 'silver', 'blue', 'pink', 'purple', 'green'],
    black: ['blonde', 'brown', 'red', 'white', 'silver', 'blue', 'pink', 'purple', 'green'],
    red: ['blonde', 'brown', 'black', 'white', 'silver', 'blue', 'pink', 'purple', 'green'],
    white: ['blonde', 'brown', 'black', 'red', 'silver', 'blue', 'pink', 'purple', 'green'],
    silver: ['blonde', 'brown', 'black', 'red', 'white', 'blue', 'pink', 'purple', 'green'],
    blue: ['blonde', 'brown', 'black', 'red', 'white', 'silver', 'pink', 'purple', 'green'],
    pink: ['blonde', 'brown', 'black', 'red', 'white', 'silver', 'blue', 'purple', 'green'],
    purple: ['blonde', 'brown', 'black', 'red', 'white', 'silver', 'blue', 'pink', 'green'],
    green: ['blonde', 'brown', 'black', 'red', 'white', 'silver', 'blue', 'pink', 'purple'],
  },

  // ═══════════════════════════════════════════════
  // 👁️ YEUX (mutuellement exclusif sauf heterochromia)
  // ═══════════════════════════════════════════════
  eyes: {
    blue_eyes: ['green_eyes', 'brown_eyes', 'hazel_eyes', 'gray_eyes', 'amber_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    green_eyes: ['blue_eyes', 'brown_eyes', 'hazel_eyes', 'gray_eyes', 'amber_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    brown_eyes: ['blue_eyes', 'green_eyes', 'hazel_eyes', 'gray_eyes', 'amber_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    hazel_eyes: ['blue_eyes', 'green_eyes', 'brown_eyes', 'gray_eyes', 'amber_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    gray_eyes: ['blue_eyes', 'green_eyes', 'brown_eyes', 'hazel_eyes', 'amber_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    amber_eyes: ['blue_eyes', 'green_eyes', 'brown_eyes', 'hazel_eyes', 'gray_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    red_eyes: ['blue_eyes', 'green_eyes', 'brown_eyes', 'hazel_eyes', 'gray_eyes', 'amber_eyes', 'purple_eyes', 'golden_eyes'],
    purple_eyes: ['blue_eyes', 'green_eyes', 'brown_eyes', 'hazel_eyes', 'gray_eyes', 'amber_eyes', 'red_eyes', 'golden_eyes'],
    golden_eyes: ['blue_eyes', 'green_eyes', 'brown_eyes', 'hazel_eyes', 'gray_eyes', 'amber_eyes', 'red_eyes', 'purple_eyes'],
    glowing_eyes: [],
    heterochromia: [], // ✅ Pas de conflits
  },

  // ═══════════════════════════════════════════════
  // 🎭 EXPRESSIONS (peuvent coexister modérément)
  // ═══════════════════════════════════════════════
  facialExpression: {
    smiling: ['angry', 'sad'],
    serious: [],
    angry: ['smiling', 'playful', 'seductive'],
    sad: ['smiling', 'playful'],
    playful: ['serious', 'angry', 'sad'],
    mysterious: [],
    seductive: ['angry'],
    determined: [],
    surprised: [],
    neutral: [],
  },

  // ═══════════════════════════════════════════════
  // 🌦️ MÉTÉO (certains incompatibles)
  // ═══════════════════════════════════════════════
  weather: {
    clear_sky: ['rain', 'storm', 'snow', 'fog', 'mist'],
    cloudy: ['clear_sky'],
    rain: ['clear_sky', 'snow'],
    storm: ['clear_sky', 'snow'],
    snow: ['rain', 'storm', 'clear_sky'],
    fog: ['clear_sky'],
    mist: ['clear_sky'],
    windy: [],
  },

  // ═══════════════════════════════════════════════
  // 👕 VÊTEMENTS (certains incompatibles)
  // ═══════════════════════════════════════════════
  topwear: {
    dress: ['suit_jacket', 'blazer'],
    ball_gown: ['suit_jacket', 'blazer', 'hoodie'],
    suit_jacket: ['dress', 'ball_gown', 'hoodie'],
    blazer: ['dress', 'ball_gown', 'hoodie'],
  },
};

/**
 * ✅ Détecte les conflits pour un nouveau tag (VERSION SÉCURISÉE)
 */
export function getConflictingTags(category, newTag, selectedTags) {
  const conflicts = [];

  // ✅ Vérifier que la catégorie existe
  if (!tagConflicts[category]) {
    console.warn(`⚠️ Catégorie "${category}" non définie dans tagConflicts`);
    return conflicts;
  }

  const categoryConflicts = tagConflicts[category];
  
  // ✅ Vérifier que le tag a des conflits définis
  if (!categoryConflicts[newTag]) {
    return conflicts; // Pas de conflits = OK
  }

  const conflictList = categoryConflicts[newTag];
  
  // ✅ Récupérer les tags actuels (gère single-select et multi-select)
  let currentTags = selectedTags[category];
  if (!Array.isArray(currentTags)) {
    currentTags = currentTags ? [currentTags] : [];
  }

  // ✅ Vérifier les conflits
  currentTags.forEach(tag => {
    if (conflictList.includes(tag)) {
      conflicts.push({ category, tag });
    }
  });

  return conflicts;
}

/**
 * ✅ Supprime les tags en conflit
 */
export function removeConflictingTags(selectedTags, conflicts) {
  const updated = { ...selectedTags };

  conflicts.forEach(({ category, tag }) => {
    const current = updated[category];
    
    if (Array.isArray(current)) {
      updated[category] = current.filter(t => t !== tag);
    } else if (current === tag) {
      updated[category] = null;
    }
  });

  return updated;
}

export default tagConflicts;