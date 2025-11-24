// frontend/src/utils/tagConflicts.js

/**
 * ✅ Définition des conflits entre tags
 * Structure: { catégorie: { tag: [tags_conflictuels] } }
 */
export const tagConflicts = {
  // ══════════════════════════════════════════
  // APPARENCE PHYSIQUE
  // ══════════════════════════════════════════
  species: {
    'human': ['elf', 'dwarf', 'orc', 'vampire', 'fairy', 'cyborg'],
    'elf': ['human', 'dwarf', 'orc', 'cyborg'],
    'dwarf': ['human', 'elf', 'orc', 'vampire', 'fairy', 'cyborg'],
    'orc': ['human', 'elf', 'dwarf', 'vampire', 'fairy', 'cyborg'],
    'vampire': ['human', 'dwarf', 'orc', 'fairy', 'cyborg'],
    'fairy': ['human', 'dwarf', 'orc', 'vampire', 'cyborg'],
    'cyborg': ['human', 'elf', 'dwarf', 'orc', 'vampire', 'fairy'],
  },

  //ou en tout compatible : 
  /*
  species: {
    'human': [],
    'elf': [],
    'dwarf': [],
    'orc': [],
    'vampire': [],
    'fairy': [],
    'cyborg': [],
  },
  */

  age: {
    'child': ['adult', 'middle_aged', 'mature', 'elder'],
    'teen': ['adult', 'middle_aged', 'mature', 'elder'],
    'young_adult': ['child', 'mature', 'elder'],
    'adult': ['child', 'teen'],
    'middle_aged': ['child', 'teen'],
    'mature': ['child', 'teen', 'young_adult'],
    'elder': ['child', 'teen', 'young_adult']
  },

  gender: {
    'male': ['female'],
    'female': ['male']
  },

  bodyType: {
    'petite': ['muscular', 'curvy', 'athletic', 'voluptuous'],
    'slim': ['muscular', 'curvy', 'voluptuous'],
    'athletic': ['petite', 'voluptuous'],
    'curvy': ['petite', 'slim', 'muscular'],
    'muscular': ['petite', 'slim', 'curvy', 'voluptuous'],
    'voluptuous': ['petite', 'slim', 'athletic', 'muscular'],
    'chubby': ['slim', 'muscular', 'athletic']
  },

  breastSize: {
    'flat_chest': ['large_breasts', 'huge_breasts'],
    'small_breasts': ['huge_breasts'],
    'medium_breasts': ['flat_chest', 'huge_breasts'],
    'large_breasts': ['flat_chest', 'small_breasts'],
    'huge_breasts': ['flat_chest', 'small_breasts', 'medium_breasts']
  },

  buttSize: {
    'small_butt': ['huge_ass'],
    'medium_butt': ['huge_ass'],
    'large_butt': ['small_butt'],
    'huge_ass': ['small_butt', 'medium_butt']
  },

  // ══════════════════════════════════════════
  // CHEVEUX
  // ══════════════════════════════════════════
  hairLength: {
    'bald': ['short_hair', 'medium_hair', 'long_hair', 'very_long_hair'],
    'short_hair': ['bald', 'long_hair', 'very_long_hair'],
    'medium_hair': ['bald', 'very_long_hair'],
    'long_hair': ['bald', 'short_hair'],
    'very_long_hair': ['bald', 'short_hair', 'medium_hair']
  },

  hairColor: {
    'blonde_hair': ['brown_hair', 'black_hair', 'red_hair', 'white_hair', 'gray_hair'],
    'brown_hair': ['blonde_hair', 'black_hair', 'red_hair', 'white_hair'],
    'black_hair': ['blonde_hair', 'brown_hair', 'white_hair', 'gray_hair'],
    'red_hair': ['blonde_hair', 'brown_hair', 'black_hair'],
    'white_hair': ['blonde_hair', 'brown_hair', 'black_hair'],
    'gray_hair': ['blonde_hair', 'black_hair'],
    // Couleurs fantaisie compatibles entre elles
    'blue_hair': [],
    'pink_hair': [],
    'green_hair': [],
    'purple_hair': []
  },

  // ══════════════════════════════════════════
  // VISAGE
  // ══════════════════════════════════════════
  eyes: {
    'blue_eyes': ['brown_eyes', 'green_eyes', 'red_eyes', 'purple_eyes', 'yellow_eyes'],
    'brown_eyes': ['blue_eyes', 'green_eyes', 'red_eyes', 'purple_eyes'],
    'green_eyes': ['blue_eyes', 'brown_eyes', 'red_eyes'],
    'red_eyes': ['blue_eyes', 'brown_eyes', 'green_eyes'],
    'purple_eyes': ['blue_eyes', 'brown_eyes'],
    'yellow_eyes': ['blue_eyes'],
    'heterochromia': [] // Compatible avec tout
  },

  facialExpression: {
    'smiling': ['crying', 'angry', 'sad', 'frowning'],
    'laughing': ['crying', 'angry', 'sad', 'frowning'],
    'crying': ['smiling', 'laughing', 'happy'],
    'angry': ['smiling', 'laughing', 'happy'],
    'sad': ['smiling', 'laughing', 'happy'],
    'surprised': [],
    'embarrassed': [],
    'seductive': ['angry', 'crying'],
    'happy': ['crying', 'angry', 'sad'],
    'neutral': [],
    'frowning': ['smiling', 'laughing']
  },

  // ══════════════════════════════════════════
  // VÊTEMENTS
  // ══════════════════════════════════════════
  topwear: {
    'naked_upper': ['t-shirt', 'dress', 'hoodie', 'armor', 'kimono', 'suit'],
    'armor': ['naked_upper', 'dress', 't-shirt'],
    'dress': ['armor', 't-shirt', 'hoodie', 'naked_upper']
  },

  bottomwear: {
    'naked_lower': ['pants', 'skirt', 'shorts', 'dress'],
    'pants': ['naked_lower', 'skirt', 'dress'],
    'skirt': ['naked_lower', 'pants', 'shorts'],
    'shorts': ['naked_lower', 'skirt', 'pants']
  },

  // ══════════════════════════════════════════
  // POSES
  // ══════════════════════════════════════════
  pose: {
    'standing': ['sitting', 'lying_down', 'kneeling', 'crouching'],
    'sitting': ['standing', 'lying_down', 'running', 'jumping'],
    'lying_down': ['standing', 'sitting', 'running', 'jumping'],
    'kneeling': ['standing', 'lying_down'],
    'crouching': ['standing', 'lying_down'],
    'running': ['sitting', 'lying_down'],
    'jumping': ['sitting', 'lying_down']
  },

  // ══════════════════════════════════════════
  // ENVIRONNEMENT
  // ══════════════════════════════════════════
  timeOfDay: {
    'day': ['night', 'sunset'],
    'night': ['day', 'sunset'],
    'sunset': ['day', 'night'],
    'sunrise': ['night']
  },

  weather: {
    'sunny': ['rainy', 'snowy', 'cloudy'],
    'rainy': ['sunny', 'snowy'],
    'snowy': ['sunny', 'rainy'],
    'cloudy': ['sunny']
  }
};

/**
 * ✅ Vérifie les conflits pour un nouveau tag
 * @param {string} category - Catégorie du tag
 * @param {string} newTag - Nouveau tag à ajouter
 * @param {Object} selectedTags - Tags actuellement sélectionnés
 * @returns {Array} Liste des conflits [{category, tag}, ...]
 */
export function getConflictingTags(category, newTag, selectedTags) {
  const conflicts = []; // ✅ TOUJOURS un array

  // ✅ Vérifier que la catégorie existe
  if (!tagConflicts[category]) {
    console.warn(`⚠️ Catégorie "${category}" non définie dans tagConflicts`);
    return conflicts; // ✅ Retourne array vide
  }

  const categoryConflicts = tagConflicts[category];

  // ✅ Vérifier que le tag a des conflits définis
  if (!categoryConflicts[newTag]) {
    return conflicts; // ✅ Pas de conflits = array vide
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

  return conflicts; // ✅ TOUJOURS retourne un array
}

/**
 * ✅ Supprime les tags en conflit
 * @param {Object} selectedTags - Tags sélectionnés
 * @param {Array} conflicts - Liste des conflits [{category, tag}, ...]
 * @returns {Object} selectedTags mis à jour
 */
export function removeConflictingTags(selectedTags, conflicts) {
  // ✅ VÉRIFICATION DE SÉCURITÉ
  if (!Array.isArray(conflicts)) {
    console.error('❌ removeConflictingTags: conflicts doit être un array, reçu:', typeof conflicts);
    return selectedTags; // ✅ Retourne l'original sans modification
  }

  const updated = { ...selectedTags };

  conflicts.forEach(({ category, tag }) => {
    const current = updated[category];

    if (Array.isArray(current)) {
      // Multi-select: retire le tag du tableau
      updated[category] = current.filter(t => t !== tag);
    } else if (current === tag) {
      // Single-select: met à null
      updated[category] = null;
    }
  });

  return updated;
}

export default tagConflicts;