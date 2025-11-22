// frontend/src/utils/tagConflicts.js

/**
 * Définit les règles de conflits entre tags
 */
export const TAG_CONFLICTS = {
  // Conflits de bodyType
  'slim': ['muscular', 'chubby', 'curvy', 'overweight'],
  'muscular': ['slim', 'chubby', 'overweight'],
  'chubby': ['slim', 'muscular'],
  'curvy': ['slim', 'athletic'],
  'overweight': ['slim', 'muscular', 'athletic'],
  
  // Conflits de breastSize
  'flat chest': ['large breasts', 'huge breasts', 'gigantic breasts'],
  'small breasts': ['huge breasts', 'gigantic breasts'],
  'large breasts': ['flat chest', 'small breasts'],
  'huge breasts': ['flat chest', 'small breasts'],
  'gigantic breasts': ['flat chest', 'small breasts'],
  
  // Conflits de hair (longueur)
  'bald': ['long hair', 'short hair', 'ponytail', 'braided hair', 'bun'],
  'long hair': ['bald', 'short hair'],
  'short hair': ['bald', 'long hair', 'ponytail'],
  
  // Conflits de pose
  'standing': ['sitting', 'lying down', 'kneeling', 'crouching'],
  'sitting': ['standing', 'lying down', 'running'],
  'lying down': ['standing', 'sitting', 'running', 'walking'],
  'kneeling': ['standing', 'sitting', 'lying down'],
  
  // Conflits de viewpoint
  'full body': ['close-up', 'face focus'],
  'close-up': ['full body', 'cowboy shot'],
  'face focus': ['full body', 'from behind'],
  
  // Conflits de location
  'indoors': ['outdoors', 'beach', 'forest', 'city street'],
  'outdoors': ['indoors', 'bedroom', 'living room'],
  
  // Conflits de timeOfDay
  'day': ['night', 'sunset', 'sunrise'],
  'night': ['day', 'midday'],
  'sunset': ['sunrise', 'midday'],
};

/**
 * Trouve les tags en conflit avec un nouveau tag
 */
export function getConflictingTags(category, newTag, currentTags) {
  const conflicts = TAG_CONFLICTS[newTag] || [];
  const allCurrentTags = Object.values(currentTags).flat();
  
  return allCurrentTags.filter(tag => conflicts.includes(tag));
}

/**
 * Supprime automatiquement les tags en conflit
 */
export function removeConflictingTags(category, newTag, currentTags) {
  const conflicts = TAG_CONFLICTS[newTag] || [];
  
  const cleanedTags = { ...currentTags };
  
  // Parcourir toutes les catégories
  Object.keys(cleanedTags).forEach(cat => {
    if (Array.isArray(cleanedTags[cat])) {
      cleanedTags[cat] = cleanedTags[cat].filter(tag => !conflicts.includes(tag));
    }
  });
  
  return cleanedTags;
}
