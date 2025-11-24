// frontend/src/services/promptGenerator.js

const API_URL = import.meta.env.VITE_API_URL; 
const API_KEY = import.meta.env.VITE_API_KEY;

// ──────────────────────────────────────────────────
// UTILITAIRES SAFE (obligatoires avec le nouveau format)
// ──────────────────────────────────────────────────
const safeFirst = (value) => {
  if (Array.isArray(value)) return value[0] || '';
  if (typeof value === 'string') return value;
  return '';
};

const safeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return [value];
  return [];
};

// ──────────────────────────────────────────────────
// GÉNÉRATION DE LA DESCRIPTION D'ÂGE
// ──────────────────────────────────────────────────
function generateAgeDescription(ageRange, gender) {
  if (!ageRange || typeof ageRange !== 'object') return '';

  const { min = 18, max = 30 } = ageRange;
  const avg = Math.floor((min + max) / 2);
  const isYoung = avg <= 25;

  const genderTerm = gender === 'male' ? 'man' : gender === 'other' ? 'person' : 'woman';

  if (isYoung) {
    return `young ${genderTerm}, youthful appearance, smooth skin`;
  } else if (avg < 35) {
    return `${genderTerm} in her late twenties, mature beauty`;
  } else if (avg < 45) {
    return `mature ${genderTerm}, refined features`;
  } else if (avg < 60) {
    return `middle-aged ${genderTerm}, distinguished look`;
  } else {
    return `elderly ${genderTerm}, graceful aging`;
  }
}

// ──────────────────────────────────────────────────
// FONCTION PRINCIPALE
// ──────────────────────────────────────────────────
export async function generateEnhancedPrompt(selectedTags = {}) {


  console.log('Génération du prompt avec:', selectedTags);

  // Nettoyage & normalisation
  const tags = { ...selectedTags };
  Object.keys(tags).forEach(key => {
    if (tags[key] === null || tags[key] === undefined) delete tags[key];
  });

  const ageDescription = generateAgeDescription(tags.age, tags.gender);

  // Construction du subjectData (utilisé par le fallback)
  const subjectData = {
    type: safeFirst(tags.subject) || 'character',
    species: safeFirst(tags.species) || 'human',
    gender: tags.gender || 'female',
    age: tags.age,
    ageDescription,
  };

  // Payload pour l'API
const payload = {
  selectedTags: tags,
  subjectData: subjectData,  // ← Ajoute ça !
  context: null  // Optionnel
};

  // Appel API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
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

    if (!response.ok) {
      console.warn('API échouée → fallback', response.status);
      return generateSmartFallback(tags, subjectData);
    }

    const data = await response.json();
    if (data?.prompt) return data.prompt;

    console.warn('Réponse API vide → fallback');
    return generateSmartFallback(tags, subjectData);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Erreur réseau ou timeout → fallback', error.message);
    return generateSmartFallback(tags, subjectData);
  }
}

// ──────────────────────────────────────────────────
// FALLBACK INTELLIGENT (quand l'API est down)
// ──────────────────────────────────────────────────
function generateSmartFallback(tags, subject) {
  const parts = [];

  // 1. 1girl / 1woman / 1boy / 1man selon âge
  const isYoung = !subject.ageDescription || subject.ageDescription.includes('young');
  const gender = subject.gender || 'female';
  const countTag = gender === 'male'
    ? (isYoung ? '1boy' : '1man')
    : (isYoung ? '1girl' : '1woman');

  parts.push(countTag, 'solo');

  // 2. Âge descriptif (sans redondance)
  if (subject.ageDescription) {
    const desc = isYoung
      ? subject.ageDescription.replace(/young (wo)?man,?/, '').trim()
      : subject.ageDescription;
    if (desc) parts.push(desc);
  }

  // 3. Espèce (gestion spécifique)
  const species = (safeFirst(tags.species) || subject.species || 'human').toLowerCase();

  if (species.includes('elf')) {
    parts.push('beautiful elf', 'delicate pointed elf ears', 'ethereal glow');
  } else if (species.includes('dwarf')) {
    parts.push('sturdy dwarf', 'thick beard', 'muscular build');
  } else if (species.includes('orc')) {
    parts.push('powerful orc', 'green skin', 'prominent tusks', 'muscular physique');
  } else if (species.includes('vampire')) {
    parts.push('elegant vampire', 'pale skin', 'sharp fangs', 'crimson eyes', 'supernatural beauty');
  } else if (species.includes('fairy')) {
    parts.push('delicate fairy', 'translucent wings', 'petite frame', 'magical sparkles');
  } else if (species.includes('cyborg')) {
    parts.push('cybernetic enhancements', 'mechanical parts', 'glowing circuits', 'futuristic design');
  } else if (species !== 'human') {
    parts.push(species);
  }


  // 4. Apparence physique - Yeux
  const eyeColor = safeFirst(tags.eyes);
  if (eyeColor) parts.push(eyeColor);

  // 5. Apparence physique - Cheveux
  const hairLength = safeFirst(tags.hairLength);
  if (hairLength) parts.push(hairLength);

  const hairStyles = safeArray(tags.hairStyle);
  if (hairStyles.length) parts.push(...hairStyles);

  const hairColor = safeFirst(tags.hairColor);
  if (hairColor) parts.push(hairColor);

  // 6. Apparence physique - Corps
  ['bodyType', 'breastSize', 'buttSize', 'facialExpression'].forEach(cat => {
    const value = safeFirst(tags[cat]);
    if (value) parts.push(value);
  });

  // 7. Vêtements
  const clothing = [];
  ['topwear', 'bottomwear', 'footwear'].forEach(cat => {
    const val = safeFirst(tags[cat]);
    if (val) clothing.push(val);
  });
  if (clothing.length) {
    parts.push('wearing ' + clothing.join(', '));
  }

  // 8. Accessoires (multiselect)
  const accessories = safeArray(tags.accessories);
  if (accessories.length) {
    parts.push(...accessories);
  }

  // 7. Pose & Composition
  if (tags.pose) parts.push(tags.pose);
  if (tags.viewpoint) parts.push(tags.viewpoint);

  // 8. Environnement
  if (tags.location) parts.push(`in ${tags.location}`);
  if (tags.timeOfDay) parts.push(tags.timeOfDay);
  if (tags.lighting) parts.push(tags.lighting);
  if (tags.weather) parts.push(tags.weather);

  // 9. Style
  if (tags.artist?.length) {
    parts.push(`in the style of ${tags.artist.join(', ')}`);
  }
  if (tags.artMedium) parts.push(tags.artMedium);

  // 10. Qualité (multiselect)
  const quality = tags.quality || [];
  if (quality.length === 0) {
    parts.push('masterpiece', 'best quality', 'ultra detailed', '8k');
  } else {
    parts.push(...quality);
  }

  // Finalisation
  const finalPrompt = [...new Set(parts)].join(', ');
  console.log('Fallback généré →', finalPrompt);
  return finalPrompt;
}

export default generateEnhancedPrompt;