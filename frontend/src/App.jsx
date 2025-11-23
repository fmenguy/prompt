// frontend/src/App.jsx
import { useState } from 'react';
import { promptData as prompts } from './data/prompts';
import { generateEnhancedPrompt } from './services/promptGenerator';
import { generateNegativePrompt } from './utils/negativePromptGenerator';
import { getConflictingTags, removeConflictingTags } from './utils/tagConflicts';
import './App.css';


const SINGLE_SELECT_CATEGORIES = [
  'gender', 'age', 'species', 'bodyType', 'breastSize', 'buttSize',
  'facialExpression', 'topwear', 'bottomwear', 'footwear',
  'pose', 'viewpoint', 'location', 'timeOfDay', 'lighting',
  'weather', 'artMedium'
];

function App() {
  const [selectedTags, setSelectedTags] = useState({
    subject: [],
    age: null,
    gender: null,
    species: [],
    bodyType: [],
    breastSize: [],
    buttSize: [],
    hair: [],
    eyes: [],
    facialExpression: [],
    topwear: [],
    bottomwear: [],
    footwear: [],
    accessories: [],
    pose: [],
    viewpoint: [],
    location: [],
    timeOfDay: [],
    lighting: [],
    weather: [],
    artist: [],
    artMedium: [],
    quality: [],
  });

  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [conflictWarning, setConflictWarning] = useState(null);

  const isTagSelected = (category, value) => {
    const selected = selectedTags[category];
    if (Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const surpriseMe = () => {
    const getRandomItem = (array) => {
      if (!array || array.length === 0) return null;
      return array[Math.floor(Math.random() * array.length)].value;
    };

    const getRandomItems = (array, count = 1) => {
      if (!array || array.length === 0) return [];
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(item => item.value);
    };

    const newTags = {
      subject: [getRandomItem(prompts.subject.character)],
      age: getRandomItem(prompts.subject.age),
      gender: getRandomItem(prompts.subject.gender),
      species: [getRandomItem(prompts.subject.species)],
      bodyType: [getRandomItem(prompts.appearance.bodyType)],
      breastSize: Math.random() > 0.5 ? [getRandomItem(prompts.appearance.breastSize)] : [],
      buttSize: Math.random() > 0.5 ? [getRandomItem(prompts.appearance.buttSize)] : [],
      hair: getRandomItems(prompts.appearance.hair, 2),
      eyes: [getRandomItem(prompts.appearance.eyes)],
      facialExpression: [getRandomItem(prompts.appearance.facialExpression)],
      topwear: [getRandomItem(prompts.clothing.topwear)],
      bottomwear: [getRandomItem(prompts.clothing.bottomwear)],
      footwear: [getRandomItem(prompts.clothing.footwear)],
      accessories: getRandomItems(prompts.clothing.accessories, Math.floor(Math.random() * 2)),
      pose: [getRandomItem(prompts.composition.pose)],
      viewpoint: [getRandomItem(prompts.composition.viewpoint)],
      location: [getRandomItem(prompts.environment.location)],
      timeOfDay: [getRandomItem(prompts.environment.timeOfDay)],
      lighting: [getRandomItem(prompts.environment.lighting)],
      weather: Math.random() > 0.7 ? [getRandomItem(prompts.environment.weather)] : [],
      artist: getRandomItems(prompts.style?.artist, Math.floor(Math.random() * 2) + 1),
      artMedium: [getRandomItem(prompts.style?.artMedium)],
      quality: getRandomItems(prompts.technical?.quality, 3),
    };

    setSelectedTags(newTags);
    setConflictWarning(null);
  };

  const handleTagSelect = (category, value) => {
    setSelectedTags(prev => {
      const isSingleSelect = SINGLE_SELECT_CATEGORIES.includes(category);

      if (isSingleSelect) {
        // Sélection unique : on toggle (clic = désélection si déjà sélectionné)
        const currentValue = prev[category];
        const newValue = (Array.isArray(currentValue) ? currentValue[0] : currentValue) === value ? null : value;

        // Vérification conflit uniquement si on ajoute
        if (newValue) {
          const conflicts = getConflictingTags(category, value, prev);
          if (conflicts.length > 0) {
            setConflictWarning({
              newTag: value,
              conflicts: conflicts.map(c => c.tag),
            });
          }
          const cleaned = removeConflictingTags(category, value, prev);
          return { ...cleaned, [category]: newValue };
        }

        return { ...prev, [category]: null };
      } else {
        // Multiselect (artist, quality, accessories)
        const current = prev[category] || [];
        if (current.includes(value)) {
          return { ...prev, [category]: current.filter(v => v !== value) };
        } else {
          const conflicts = getConflictingTags(category, value, prev);
          if (conflicts.length > 0) {
            setConflictWarning({
              newTag: value,
              conflicts: conflicts.map(c => c.tag),
            });
          }
          const cleaned = removeConflictingTags(category, value, prev);
          return { ...cleaned, [category]: [...(cleaned[category] || []), value] };
        }
      }
    });
  };


  const generatePrompt = async () => {
    try {
      const enhanced = await generateEnhancedPrompt(selectedTags, {
        age: selectedTags.age,
        gender: selectedTags.gender,
      });

      setEnhancedPrompt(enhanced);
      setNegativePrompt(generateNegativePrompt(selectedTags));
    } catch (error) {
      console.error('Erreur génération prompt:', error);
    }
  };

  const clearAllSelections = () => {
    setSelectedTags({
      subject: [],
      age: null,
      gender: null,
      species: [],
      bodyType: [],
      breastSize: [],
      buttSize: [],
      hair: [],
      eyes: [],
      facialExpression: [],
      topwear: [],
      bottomwear: [],
      footwear: [],
      accessories: [],
      pose: [],
      viewpoint: [],
      location: [],
      timeOfDay: [],
      lighting: [],
      weather: [],
      artist: [],
      artMedium: [],
      quality: [],
    });
    setEnhancedPrompt('');
    setNegativePrompt('');
    setConflictWarning(null);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(`${type} copié!`);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎨 Générateur de Prompt
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Créez des prompts professionnels pour vos générations d'images IA
          </p>
          <p className="text-yellow-400 text-sm bg-gray-800 inline-block px-4 py-2 rounded-lg">
            💡 Astuce : La génération en anglais fonctionne mieux !
          </p>
        </div>

        {/* CONFLICT WARNING */}
        {conflictWarning && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-6 backdrop-blur-sm flex justify-between items-start gap-4">
            <p className="text-red-100 text-sm md:text-base flex-1">
              <strong>⚠️ Conflit détecté :</strong> "{conflictWarning.newTag}" entre en conflit avec{' '}
              {conflictWarning.conflicts.map((c, i) => (
                <span key={c}>
                  "{c}"{i < conflictWarning.conflicts.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
            <button
              onClick={() => setConflictWarning(null)}
              className="text-red-100 hover:text-white font-bold text-xl shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* ⭐ MAIN CONTROLS - SECTION UNIFIÉE */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Surprise Me */}
            <button
              onClick={surpriseMe}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              🎲 42 !
            </button>

            {/* Generate Prompt */}
            <button
              onClick={generatePrompt}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              ✨ Générer le Prompt
            </button>

            {/* Clear All */}
            <button
              onClick={clearAllSelections}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              🗑️ Tout Effacer
            </button>

          </div>
        </div>

        {/* PROMPTS GÉNÉRÉS */}
        {enhancedPrompt && (
          <div className="space-y-8">

            {/* Prompt Positif */}
            <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">✅ Prompt Positif</h3>
                <button
                  onClick={() => copyToClipboard(enhancedPrompt, 'Prompt positif')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  📋 Copier
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                {enhancedPrompt}
              </div>
            </div>

            {/* Prompt Négatif */}
            {negativePrompt && (
              <div className="bg-gradient-to-r from-red-900 to-rose-900 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">❌ Prompt Négatif</h3>
                  <button
                    onClick={() => copyToClipboard(negativePrompt, 'Prompt négatif')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    📋 Copier
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {negativePrompt}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 👤 SUJET PRINCIPAL */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8 mt-8">
          <h2 className="text-3xl font-bold text-white mb-6">Sujet Principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Âge */}
            <div>
              <label className="block text-white font-semibold mb-3">Âge</label>
              <div className="flex flex-wrap gap-2">
                {prompts.subject.age.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => handleTagSelect('age', tag.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selectedTags.age === tag.value
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-white font-semibold mb-3">Genre</label>
              <div className="flex flex-wrap gap-2">
                {prompts.subject.gender.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => handleTagSelect('gender', tag.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selectedTags.gender === tag.value
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Espèce */}
            <div>
              <label className="block text-white font-semibold mb-3">Espèce</label>
              <div className="flex flex-wrap gap-2">
                {prompts.subject.species.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => handleTagSelect('species', tag.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected('species', tag.value)
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 💇 APPARENCE */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Apparence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['bodyType', 'breastSize', 'buttSize', 'hair', 'eyes', 'facialExpression'].map((cat) => (
              <div key={cat}>
                <h3 className="text-xl font-bold text-white mb-4 capitalize">
                  {cat === 'bodyType' ? 'Morphologie' :
                    cat === 'breastSize' ? 'Poitrine' :
                      cat === 'buttSize' ? 'Fessiers' :
                        cat === 'hair' ? 'Cheveux' :
                          cat === 'eyes' ? 'Yeux' :
                            cat === 'facialExpression' ? 'Expression' : cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(prompts.appearance[cat] || []).map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => handleTagSelect(cat, tag.value)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected(cat, tag.value)
                        ? 'bg-pink-600 text-white shadow-lg scale-105'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 👗 VÊTEMENTS */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Vêtements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['topwear', 'bottomwear', 'footwear', 'accessories'].map((cat) => (
              <div key={cat}>
                <h3 className="text-xl font-bold text-white mb-4 capitalize">
                  {cat === 'topwear' ? 'Haut' :
                    cat === 'bottomwear' ? 'Bas' :
                      cat === 'footwear' ? 'Chaussures' :
                        cat === 'accessories' ? 'Accessoires' : cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(prompts.clothing[cat] || []).map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => handleTagSelect(cat, tag.value)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected(cat, tag.value)
                        ? 'bg-indigo-600 text-white shadow-lg scale-105'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📐 COMPOSITION */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Composition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['pose', 'viewpoint'].map((cat) => (
              <div key={cat}>
                <h3 className="text-xl font-bold text-white mb-4">
                  {cat === 'pose' ? 'Pose' : 'Point de vue'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(prompts.composition[cat] || []).map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => handleTagSelect(cat, tag.value)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected(cat, tag.value)
                        ? 'bg-cyan-600 text-white shadow-lg scale-105'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🌍 ENVIRONNEMENT */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Environnement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['location', 'timeOfDay', 'lighting', 'weather'].map((cat) => (
              <div key={cat}>
                <h3 className="text-xl font-bold text-white mb-4">
                  {cat === 'location' ? 'Lieu' :
                    cat === 'timeOfDay' ? 'Moment' :
                      cat === 'lighting' ? 'Éclairage' :
                        'Météo'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(prompts.environment[cat] || []).map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => handleTagSelect(cat, tag.value)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected(cat, tag.value)
                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎨 STYLE */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Style artistique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Artiste</h3>
              <div className="flex flex-wrap gap-2">
                {(prompts.style?.artist || []).map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => handleTagSelect('artist', tag.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected('artist', tag.value)
                      ? 'bg-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Médium</h3>
              <div className="flex flex-wrap gap-2">
                {(prompts.style?.artMedium || []).map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => handleTagSelect('artMedium', tag.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected('artMedium', tag.value)
                      ? 'bg-amber-600 text-white shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ⚙️ QUALITÉ */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Qualité & Technique</h2>
          <div className="flex flex-wrap gap-2">
            {(prompts.technical?.quality || []).map((tag) => (
              <button
                key={tag.value}
                onClick={() => handleTagSelect('quality', tag.value)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${isTagSelected('quality', tag.value)
                  ? 'bg-yellow-500 text-black shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message de confirmation */}
        {copySuccess && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-green-400 px-8 py-4 rounded-xl text-xl font-bold animate-pulse z-50 shadow-2xl border-2 border-green-500">
            ✅ {copySuccess}
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Créé par <span className="text-white font-semibold">François Menguy</span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <a
                href="https://fmenguy.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                🏠 Accueil
              </a>

              <span className="hidden sm:inline text-gray-600">|</span>

              <div className="flex gap-6">
                <a href="https://fmenguy.fr/oai/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  OAI
                </a>
                <a href="https://fmenguy.fr/odia/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors font-medium">
                  ODIA
                </a>
                <a href="https://fmenguy.fr/ocm/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                  OCM
                </a>
              </div>
            </div>

            <p className="text-gray-500 text-xs mt-6">
              © {new Date().getFullYear()} - Tous droits réservés
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
