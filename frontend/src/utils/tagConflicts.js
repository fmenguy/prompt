// frontend/src/utils/tagConflicts.js

/**
 * Définit les règles de conflits entre tags
 */
export const TAG_CONFLICTS = {
  // Conflits de bodyType
  'slender': ['muscular', 'chubby', 'curvy', 'overweight'],
  'muscular': ['slender', 'chubby', 'overweight'],
  'chubby': ['slender', 'muscular'],
  'curvy': ['slender', 'athletic'],
  'overweight': ['slender', 'muscular', 'athletic'],
  'athletic': ['overweight', 'curvy'],

  // Conflits de breastSize
  'flat_chest': ['large_breasts', 'huge_breasts', 'gigantic_breasts'],
  'small_breasts': ['huge_breasts', 'gigantic_breasts'],
  'large_breasts': ['flat_chest', 'small_breasts'],
  'huge_breasts': ['flat_chest', 'small_breasts'],
  'gigantic_breasts': ['flat_chest', 'small_breasts'],

  // Conflits de hair (longueur)
  'bald': ['long_hair', 'short_hair', 'ponytail', 'braided_hair', 'bun'],
  'long_hair': ['bald', 'short_hair'],
  'short_hair': ['bald', 'long_hair', 'ponytail'],

  // Conflits de pose
  'standing': ['sitting', 'lying_down', 'kneeling', 'crouching'],
  'sitting': ['standing', 'lying_down', 'running'],
  'lying_down': ['standing', 'sitting', 'running', 'walking'],
  'kneeling': ['standing', 'sitting', 'lying_down'],

  // Conflits de viewpoint
  'full_body': ['close_up', 'face_focus'],
  'close_up': ['full_body', 'cowboy_shot'],
  'face_focus': ['full_body', 'from_behind'],

  // Conflits de location
  'indoors': ['outdoors', 'beach', 'forest', 'city_street'],
  'outdoors': ['indoors', 'bedroom', 'living_room'],

  // Conflits de timeOfDay
  'day': ['night', 'sunset', 'sunrise'],
  'night': ['day', 'midday'],
  'sunset': ['sunrise', 'midday'],
};

/**
 * ✅ Trouve les tags en conflit avec un nouveau tag
 */
export function getConflictingTags(category, newTag, currentTags = {}) {
  const conflicts = TAG_CONFLICTS[newTag] || [];
  
  // ✅ Utilise .map() et accède à l'index [1] pour récupérer les values
  const allCurrentTags = Object.entries(currentTags)
    .filter(entry => Array.isArray(entry[1])) // entry[1] = values
    .flatMap(entry => entry[1]) // entry[1] = values
    .filter(Boolean);

  return allCurrentTags.filter(tag => conflicts.includes(tag));
}

/**
 * ✅ Supprime automatiquement les tags en conflit
 */
export function removeConflictingTags(category, newTag, currentTags = {}) {
  const conflicts = TAG_CONFLICTS[newTag] || [];
  const cleanedTags = { ...currentTags };

  Object.keys(cleanedTags).forEach(cat => {
    if (Array.isArray(cleanedTags[cat])) {
      cleanedTags[cat] = cleanedTags[cat].filter(tag => !conflicts.includes(tag));
    }
  });

  return cleanedTags;
}