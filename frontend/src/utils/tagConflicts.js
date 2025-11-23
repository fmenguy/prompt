// frontend/src/data/tagConflicts.js

export const tagConflicts = {
  // ═══════════════════════════════════════════════
  // 🚻 GENRE (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  gender: {
    male: ['female', 'girl', 'woman', '1girl'],
    female: ['male', 'boy', 'man', '1boy'],
    boy: ['female', 'girl', 'woman', '1girl'],
    girl: ['male', 'boy', 'man', '1boy'],
    man: ['female', 'girl', 'woman', '1girl'],
    woman: ['male', 'boy', 'man', '1boy'],
    '1boy': ['female', 'girl', 'woman', '1girl'],
    '1girl': ['male', 'boy', 'man', '1boy'],
  },

  // ═══════════════════════════════════════════════
  // 👤 ESPÈCES (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  species: {
    human: ['elf', 'demon', 'angel', 'monster', 'robot', 'cyborg'],
    elf: ['human', 'demon', 'angel', 'monster', 'robot', 'cyborg'],
    demon: ['human', 'elf', 'angel'],
    angel: ['human', 'demon', 'monster'],
    monster: ['human', 'angel', 'robot', 'cyborg'],
    robot: ['human', 'elf', 'demon', 'angel', 'monster'],
    cyborg: ['human', 'elf', 'demon', 'angel', 'monster', 'robot'],
  },

  // ═══════════════════════════════════════════════
  // 💇 CHEVEUX (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  hair: {
    bald: ['long_hair', 'short_hair', 'ponytail', 'twintails', 'braided_hair', 'wavy_hair', 'curly_hair', 'straight_hair', 'spiky_hair'],
    long_hair: ['bald', 'short_hair'],
    short_hair: ['bald', 'long_hair'],
  },

  // ═══════════════════════════════════════════════
  // 🎭 EXPRESSIONS (peuvent coexister avec modération)
  // ═══════════════════════════════════════════════
  expression: {
    happy: ['sad', 'angry', 'crying'],
    sad: ['happy', 'laughing'],
    angry: ['happy', 'calm', 'sleeping'],
    crying: ['happy', 'laughing'],
    laughing: ['sad', 'angry', 'crying'],
    sleeping: ['angry', 'surprised', 'shocked'],
  },

  // ═══════════════════════════════════════════════
  // 👕 VÊTEMENTS (certains incompatibles)
  // ═══════════════════════════════════════════════
  clothing: {
    armor: ['naked', 'nude', 'bikini', 'swimsuit'],
    naked: ['armor', 'dress', 'suit', 'uniform', 'robe'],
    nude: ['armor', 'dress', 'suit', 'uniform', 'robe'],
    dress: ['naked', 'nude', 'suit', 'armor'],
    suit: ['naked', 'nude', 'dress', 'armor'],
  },

  // ═══════════════════════════════════════════════
  // 🌤️ MÉTÉO (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  weather: {
    sunny: ['rain', 'snow', 'storm'],
    rain: ['sunny', 'snow'],
    snow: ['sunny', 'rain'],
    storm: ['sunny', 'clear_sky'],
    clear_sky: ['storm', 'cloudy'],
  },

  // ═══════════════════════════════════════════════
  // 🕐 MOMENTS DE LA JOURNÉE (mutuellement exclusif)
  // ═══════════════════════════════════════════════
  lighting: {
    sunrise: ['sunset', 'noon', 'midnight', 'night'],
    sunset: ['sunrise', 'noon', 'midnight'],
    noon: ['sunrise', 'sunset', 'midnight', 'night'],
    midnight: ['sunrise', 'sunset', 'noon'],
    night: ['noon', 'sunrise'],
  },

  // ═══════════════════════════════════════════════
  // 🎨 STYLES (compatibles, pas de conflits stricts)
  // ═══════════════════════════════════════════════
  style: {
    // Pas de conflits stricts pour les styles
    // Un modèle peut mélanger "anime" et "realistic details"
  },

  // ═══════════════════════════════════════════════
  // 📐 MORPHOLOGIE (certains incompatibles)
  // ═══════════════════════════════════════════════
  bodyType: {
    tall: ['short', 'petite'],
    short: ['tall'],
    petite: ['tall', 'muscular', 'large'],
    muscular: ['petite', 'slim'],
    slim: ['muscular', 'chubby'],
    chubby: ['slim', 'muscular'],
  },
};

/**
 * ✅ Détecte les conflits pour un nouveau tag
 * @param {string} category - Catégorie du tag
 * @param {string} newTag - Nouveau tag à ajouter
 * @param {Object} selectedTags - Tags actuellement sélectionnés
 * @returns {Array<string>} Liste des tags en conflit
 */
export function getConflictingTags(category, newTag, selectedTags) {
  const conflicts = [];

  // ✅ Vérifier les conflits dans la même catégorie
  const categoryConflicts = tagConflicts[category];
  if (categoryConflicts && categoryConflicts[newTag]) {
    const conflictList = categoryConflicts[newTag];
    const currentTags = selectedTags[category] || [];
    
    currentTags.forEach(tag => {
      if (conflictList.includes(tag)) {
        conflicts.push({ category, tag });
      }
    });
  }

  // ✅ NOUVEAU: Vérifier les conflits inter-catégories (genre/species)
  if (category === 'gender') {
    const genderConflicts = tagConflicts.gender[newTag] || [];
    
    // Vérifier dans species aussi (ex: "girl" vs "boy" même si c'est species)
    ['species', 'gender'].forEach(cat => {
      const tags = selectedTags[cat] || [];
      tags.forEach(tag => {
        if (genderConflicts.includes(tag)) {
          conflicts.push({ category: cat, tag });
        }
      });
    });
  }

  return conflicts;
}

/**
 * ✅ Retire les tags en conflit
 * @param {Object} selectedTags - Tags actuellement sélectionnés
 * @param {Array<Object>} conflicts - Liste des conflits [{category, tag}]
 * @returns {Object} Nouveaux selectedTags sans conflits
 */
export function removeConflictingTags(selectedTags, conflicts) {
  const newTags = { ...selectedTags };

  conflicts.forEach(({ category, tag }) => {
    if (Array.isArray(newTags[category])) {
      newTags[category] = newTags[category].filter(t => t !== tag);
    } else if (newTags[category] === tag) {
      newTags[category] = null;
    }
  });

  return newTags;
}
