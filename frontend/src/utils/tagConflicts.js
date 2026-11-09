// frontend/src/utils/tagConflicts.js

/**
 * ✅ Définition des conflits entre tags
 * Structure: { catégorie: { tag: [tags_conflictuels] } }
 */
export const tagConflicts = {
  // Chaque clé et chaque cible doit être une valeur existante de la même
  // catégorie dans src/data/prompts.js. Les conflits ne sont comparés qu'à
  // l'intérieur d'une catégorie (voir getConflictingTags).

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
    'young_adult': ['mature', 'elder'],
    'mature': ['young_adult'],
    'elder': ['young_adult']
  },

  gender: {
    'male': ['female'],
    'female': ['male']
  },

  bodyType: {
    'petite': ['muscular', 'curvy', 'athletic', 'voluptuous'],
    'slender': ['muscular', 'curvy', 'voluptuous'],
    'athletic': ['petite', 'voluptuous'],
    'curvy': ['petite', 'slender', 'muscular'],
    'muscular': ['petite', 'slender', 'curvy', 'voluptuous'],
    'voluptuous': ['petite', 'slender', 'athletic', 'muscular']
  },

  breastSize: {
    'small': ['huge'],
    'medium': ['huge'],
    'large': ['small'],
    'huge': ['small', 'medium']
  },

  buttSize: {
    'small': ['huge'],
    'medium': ['huge'],
    'large': ['small'],
    'huge': ['small', 'medium']
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
    'blonde': ['brown', 'black', 'red', 'white', 'silver'],
    'brown': ['blonde', 'black', 'red', 'white'],
    'black': ['blonde', 'brown', 'white', 'silver'],
    'red': ['blonde', 'brown', 'black'],
    'white': ['blonde', 'brown', 'black'],
    'silver': ['blonde', 'black'],
    // Couleurs fantaisie compatibles entre elles
    'blue': [],
    'pink': [],
    'green': [],
    'purple': []
  },

  // ══════════════════════════════════════════
  // VISAGE
  // ══════════════════════════════════════════
  eyes: {
    'blue_eyes': ['brown_eyes', 'green_eyes', 'red_eyes', 'purple_eyes', 'golden_eyes'],
    'brown_eyes': ['blue_eyes', 'green_eyes', 'red_eyes', 'purple_eyes'],
    'green_eyes': ['blue_eyes', 'brown_eyes', 'red_eyes'],
    'red_eyes': ['blue_eyes', 'brown_eyes', 'green_eyes'],
    'purple_eyes': ['blue_eyes', 'brown_eyes'],
    'golden_eyes': ['blue_eyes'],
    'heterochromia': [] // Compatible avec tout
  },

  facialExpression: {
    'smiling': ['angry', 'sad'],
    'angry': ['smiling'],
    'sad': ['smiling'],
    'surprised': [],
    'seductive': ['angry'],
    'neutral': []
  },

  // ══════════════════════════════════════════
  // VÊTEMENTS
  // ══════════════════════════════════════════
  topwear: {
    'leather_armor': ['dress', 't-shirt'],
    'chainmail': ['dress', 't-shirt'],
    'plate_armor': ['dress', 't-shirt'],
    'body_armor': ['dress', 't-shirt'],
    'dress': ['leather_armor', 'chainmail', 'plate_armor', 'body_armor', 't-shirt', 'hoodie']
  },

  bottomwear: {
    'pants': ['skirt'],
    'skirt': ['pants', 'shorts'],
    'shorts': ['skirt', 'pants']
  },

  // ══════════════════════════════════════════
  // POSES
  // ══════════════════════════════════════════
  pose: {
    'standing': ['sitting', 'lying_down', 'kneeling'],
    'sitting': ['standing', 'lying_down', 'running', 'jumping'],
    'lying_down': ['standing', 'sitting', 'running', 'jumping'],
    'kneeling': ['standing', 'lying_down'],
    'running': ['sitting', 'lying_down'],
    'jumping': ['sitting', 'lying_down']
  },

  // ══════════════════════════════════════════
  // ENVIRONNEMENT
  // ══════════════════════════════════════════
  timeOfDay: {
    'noon': ['night', 'sunset'],
    'night': ['noon', 'sunset'],
    'sunset': ['noon', 'night'],
    'dawn': ['night']
  },

  weather: {
    'clear_sky': ['rain', 'snow', 'cloudy'],
    'rain': ['clear_sky', 'snow'],
    'snow': ['clear_sky', 'rain'],
    'cloudy': ['clear_sky']
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