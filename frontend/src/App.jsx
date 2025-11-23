import { useState } from 'react';
import { promptData as prompts } from './data/prompts';
import { generateEnhancedPrompt } from './services/promptGenerator';
import { generateNegativePrompt } from './utils/negativePromptGenerator';
import { getConflictingTags, removeConflictingTags } from './utils/tagConflicts';
import './App.css';

function App() {
  // ========================================
  // 📊 STATE MANAGEMENT
  // ========================================
  
  const [selectedTags, setSelectedTags] = useState({
    subject: [],
    age: null, // Changed: Now stores { min, max } from slider
    gender: null, // New: Separated from age
    species: [],
    bodyType: [],
    breastSize: [],
    buttSize: [],
    hair: [],
    eyes: [],
    facialExpression: [],
    headwear: [],
    ears: [],
    topwear: [],
    bottomwear: [],
    legwear: [],
    footwear: [],
    accessories: [],
    pose: [],
    action: [],
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
  const [activeCategory, setActiveCategory] = useState(null);
  const [characterCount, setCharacterCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conflictWarning, setConflictWarning] = useState(null); // New: Conflict warnings

  // ========================================
  // 🎲 SURPRISE ME FEATURE
  // ========================================

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
      age: { min: Math.floor(Math.random() * 50) + 18, max: Math.floor(Math.random() * 20) + 40 }, // Random age range
      gender: getRandomItem(prompts.subject.gender),
      species: [getRandomItem(prompts.subject.species)],
      bodyType: [getRandomItem(prompts.appearance.bodyType)],
      breastSize: Math.random() > 0.5 ? [getRandomItem(prompts.appearance.breastSize)] : [],
      buttSize: Math.random() > 0.5 ? [getRandomItem(prompts.appearance.buttSize)] : [],
      hair: getRandomItems(prompts.appearance.hair, 2),
      eyes: [getRandomItem(prompts.appearance.eyes)],
      facialExpression: [getRandomItem(prompts.appearance.facialExpression)],
      headwear: Math.random() > 0.7 ? [getRandomItem(prompts.appearance.headwear)] : [],
      ears: Math.random() > 0.8 ? [getRandomItem(prompts.appearance.ears)] : [],
      topwear: [getRandomItem(prompts.clothing.topwear)],
      bottomwear: [getRandomItem(prompts.clothing.bottomwear)],
      legwear: Math.random() > 0.5 ? [getRandomItem(prompts.clothing.legwear)] : [],
      footwear: [getRandomItem(prompts.clothing.footwear)],
      accessories: getRandomItems(prompts.clothing.accessories, Math.floor(Math.random() * 2)),
      pose: [getRandomItem(prompts.composition.pose)],
      action: Math.random() > 0.5 ? [getRandomItem(prompts.composition.action)] : [],
      viewpoint: [getRandomItem(prompts.composition.viewpoint)],
      location: [getRandomItem(prompts.environment.location)],
      timeOfDay: [getRandomItem(prompts.environment.timeOfDay)],
      lighting: [getRandomItem(prompts.environment.lighting)],
      weather: Math.random() > 0.7 ? [getRandomItem(prompts.environment.weather)] : [],
      artist: getRandomItems(prompts.style.artist, Math.floor(Math.random() * 2) + 1),
      artMedium: [getRandomItem(prompts.style.artMedium)],
      quality: getRandomItems(prompts.technical.quality, 3),
    };

    setSelectedTags(newTags);
    setConflictWarning(null);
  };

  // ========================================
  // 🏷️ TAG SELECTION WITH CONFLICT DETECTION
  // ========================================

  const handleTagSelect = (category, value) => {
    setSelectedTags((prev) => {
      const currentTags = prev[category] || [];
      let newTags;

      if (currentTags.includes(value)) {
        // Remove tag
        newTags = {
          ...prev,
          [category]: currentTags.filter((tag) => tag !== value),
        };
      } else {
        // Add tag and check for conflicts
        const updatedTags = [...currentTags, value];
        const conflicts = getConflictingTags(category, value, prev);

        if (conflicts.length > 0) {
          setConflictWarning({
            newTag: value,
            conflicts: conflicts,
          });
        }

        newTags = removeConflictingTags(category, value, {
          ...prev,
          [category]: updatedTags,
        });
      }

      return newTags;
    });
  };

  // ========================================
  // 👤 AGE SLIDER (NEW)
  // ========================================

  const handleAgeChange = (min, max) => {
    setSelectedTags((prev) => ({
      ...prev,
      age: { min, max },
    }));
  };

  // ========================================
  // 🚹 GENDER SELECTION (NEW - Separated from age)
  // ========================================

  const handleGenderSelect = (value) => {
    setSelectedTags((prev) => ({
      ...prev,
      gender: prev.gender === value ? null : value,
    }));
  };

  // ========================================
  // 🎨 PROMPT GENERATION
  // ========================================

  const generatePrompt = async (usePro = false) => {
    setIsGenerating(true);

    try {
      // Build base prompt with deduplication
      const allKeywords = [];
      
      // Add character count prefix
      if (characterCount > 1) {
        allKeywords.push(`${characterCount} characters`);
      }

      // Process subject tags
      if (selectedTags.subject.length > 0) {
        allKeywords.push(...selectedTags.subject);
      }

      // Process age as descriptive text (NEW)
      if (selectedTags.age) {
        const { min, max } = selectedTags.age;
        if (min === max) {
          allKeywords.push(`${min} years old`);
        } else {
          allKeywords.push(`${min}-${max} years old`);
        }
      }

      // Process gender (NEW)
      if (selectedTags.gender) {
        allKeywords.push(selectedTags.gender);
      }

      // Process all other categories
      Object.entries(selectedTags).forEach(([category, tags]) => {
        if (category !== 'subject' && category !== 'age' && category !== 'gender' && Array.isArray(tags)) {
          allKeywords.push(...tags);
        }
      });

      // Deduplicate keywords (case-insensitive)
      const uniqueKeywords = [...new Set(allKeywords.map(k => k.toLowerCase()))];
      
      let finalPrompt;

      if (usePro) {
        // Use AI enhancement (local fallback)
        finalPrompt = await generateEnhancedPrompt(uniqueKeywords, {
          characterCount,
          age: selectedTags.age,
          gender: selectedTags.gender,
        });
      } else {
        // Simple concatenation
        finalPrompt = uniqueKeywords.join(', ');
      }

      setEnhancedPrompt(finalPrompt);

      // Generate negative prompt
      const negative = generateNegativePrompt(selectedTags);
      setNegativePrompt(negative);

    } catch (error) {
      console.error('Error generating prompt:', error);
      setEnhancedPrompt('Error generating prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ========================================
  // 📋 COPY TO CLIPBOARD
  // ========================================

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(`${type} copied!`);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ========================================
            📱 HEADER
            ======================================== */}
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

        {/* ========================================
            ⚠️ MULTI-CHARACTER WARNING
            ======================================== */}
        {characterCount > 1 && (
          <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <p className="text-yellow-100 text-sm md:text-base">
              ⚠️ <strong>Multi-character mode:</strong> Stable Diffusion often struggles with multiple characters.
              For best results, consider generating one character at a time.
            </p>
          </div>
        )}

        {/* ========================================
            ⚠️ CONFLICT WARNING
            ======================================== */}
        {conflictWarning && (
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-6 backdrop-blur-sm flex justify-between items-start gap-4">
            <p className="text-red-100 text-sm md:text-base flex-1">
              <strong>⚠️ Conflict detected:</strong> "{conflictWarning.newTag}" conflicts with{' '}
              {conflictWarning.conflicts.map((c, i) => (
                <span key={i}>
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

        {/* ========================================
            🎮 MAIN CONTROLS
            ======================================== */}
        <div className="space-y-6 mb-8">
          
          {/* 🎲 Surprise Me Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <button
              onClick={surpriseMe}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg transition-all text-lg md:text-xl w-full md:w-auto"
            >
              🎲 Surprise Me!
            </button>
            <p className="text-blue-200 mt-2 text-sm md:text-base">Generate a random character</p>
          </div>

          {/* 👥 Character Count */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <label className="block text-white font-semibold mb-4 text-center md:text-left">
              Number of Characters:
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCharacterCount(Math.max(1, characterCount - 1))}
                className="bg-red-500 hover:bg-red-600 text-white font-bold w-12 h-12 rounded-lg text-2xl transition-colors"
              >
                -
              </button>
              <span className="text-white font-bold text-2xl md:text-3xl w-12 text-center">
                {characterCount}
              </span>
              <button
                onClick={() => setCharacterCount(Math.min(5, characterCount + 1))}
                className="bg-green-500 hover:bg-green-600 text-white font-bold w-12 h-12 rounded-lg text-2xl transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ========================================
            🏷️ TAG CATEGORIES
            ======================================== */}
        <div className="space-y-4 mb-8">
          
         <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 shadow-2xl mb-8">
  <h2 className="text-3xl font-bold text-white mb-6">Sujet Principal</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Character Type */}
    <div>
      <label className="block text-white font-semibold mb-2">Type</label>
      <div className="flex flex-wrap gap-2">
        {prompts.subject.character.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagSelect('subject', tag.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTags.subject.includes(tag.value)
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>

    {/* Age Slider - GARDÉ de la version main mais stylisé comme l’ancien */}
    <div>
      <label className="block text-white font-semibold mb-2">Âge</label>
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-white text-center mb-3 font-bold">
          {selectedTags.age ? `${selectedTags.age.min}-${selectedTags.age.max} ans` : 'Non défini'}
        </div>
        <input
          type="range"
          min="18"
          max="80"
          value={selectedTags.age?.min || 18}
          onChange={(e) => handleAgeChange(parseInt(e.target.value), selectedTags.age?.max || 40)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <input
          type="range"
          min="18"
          max="80"
          value={selectedTags.age?.max || 40}
          onChange={(e) => handleAgeChange(selectedTags.age?.min || 18, parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider mt-2"
        />
        <div className="flex justify-between text-gray-400 text-xs mt-2">
          <span>18</span>
          <span>80</span>
        </div>
      </div>
    </div>

    {/* Gender */}
    <div>
      <label className="block text-white font-semibold mb-2">Genre</label>
      <div className="flex flex-wrap gap-2">
        {prompts.subject.gender.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleGenderSelect(tag.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTags.gender === tag.value
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>

    {/* Species */}
    <div>
      <label className="block text-white font-semibold mb-2">Espèce</label>
      <div className="flex flex-wrap gap-2">
        {prompts.subject.species.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagSelect('species', tag.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTags.species.includes(tag.value)
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

          {/* ========================================
              💇 APPEARANCE
              ======================================== */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
  <h2 className="text-2xl font-bold text-white mb-8">Apparence</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {['bodyType', 'breastSize', 'buttSize', 'hair', 'eyes', 'facialExpression', 'headwear', 'ears'].map((cat) => (
      <div key={cat}>
        <h3 className="text-xl font-bold text-white mb-4 capitalize">
          {cat.replace(/([A-Z])/g, ' $1').trim()}
        </h3>
        <div className="flex flex-wrap gap-3">
          {prompts.appearance[cat]?.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagSelect(cat, tag.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTags[cat]?.includes(tag.value)
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

          {/* ========================================
              👗 CLOTHING
              ======================================== */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
  <h2 className="text-2xl font-bold text-white mb-8">Vêtements</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {['topwear', 'bottomwear', 'legwear', 'footwear', 'accessories'].map((cat) => (
      <div key={cat}>
        <h3 className="text-xl font-bold text-white mb-4 capitalize">
          {cat === 'topwear' ? 'Haut' :
           cat === 'bottomwear' ? 'Bas' :
           cat === 'legwear' ? 'Jambes' :
           cat === 'footwear' ? 'Chaussures' :
           cat === 'accessories' ? 'Accessoires' : cat}
        </h3>
        <div className="flex flex-wrap gap-3">
          {prompts.clothing[cat]?.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagSelect(cat, tag.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTags[cat]?.includes(tag.value)
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

          {/* ========================================
              📐 COMPOSITION
              ======================================== */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
  <h2 className="text-2xl font-bold text-white mb-8">Composition</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {['pose', 'action', 'viewpoint'].map((cat) => (
      <div key={cat}>
        <h3 className="text-xl font-bold text-white mb-4 capitalize">
          {cat === 'pose' ? 'Pose' :
           cat === 'action' ? 'Action' :
           cat === 'viewpoint' ? 'Point de vue' : cat}
        </h3>
        <div className="flex flex-wrap gap-3">
          {prompts.composition[cat]?.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagSelect(cat, tag.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTags[cat]?.includes(tag.value)
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

          {/* ========================================
              🌍 ENVIRONMENT
              ======================================== */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
  <h2 className="text-2xl font-bold text-white mb-8">Environnement</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {['location', 'timeOfDay', 'lighting', 'weather'].map((cat) => (
      <div key={cat}>
        <h3 className="text-xl font-bold text-white mb-4 capitalize">
          {cat === 'location' ? 'Lieu' :
           cat === 'timeOfDay' ? 'Moment de la journée' :
           cat === 'lighting' ? 'Éclairage' :
           cat === 'weather' ? 'Météo' : cat}
        </h3>
        <div className="flex flex-wrap gap-3">
          {prompts.environment[cat]?.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagSelect(cat, tag.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedTags[cat]?.includes(tag.value)
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

          {/* ========================================
              🎨 STYLE
              ======================================== */}
         <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
  <h2 className="text-2xl font-bold text-white mb-8">Style artistique</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Artiste</h3>
      <div className="flex flex-wrap gap-3">
        {prompts.style.artist?.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagSelect('artist', tag.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedTags.artist?.includes(tag.value)
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
      <h3 className="text-xl font-bold text-white mb-4">Médium artistique</h3>
      <div className="flex flex-wrap gap-3">
        {prompts.style.artMedium?.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagSelect('artMedium', tag.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedTags.artMedium?.includes(tag.value)
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

          {/* ========================================
              ⚙️ TECHNICAL
              ======================================== */}
         <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-12">
  <h2 className="text-2xl font-bold text-white mb-8">Qualité & Technique</h2>
  <div className="flex flex-wrap gap-3">
    {prompts.technical.quality.map((tag) => (
      <button
        key={tag.value}
        onClick={() => handleTagSelect('quality', tag.value)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          selectedTags.quality.includes(tag.value)
            ? 'bg-yellow-500 text-black shadow-lg scale-105'
            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
        }`}
      >
        {tag.label}
      </button>
    ))}
  </div>
</div>
       {/* ======================================== */}
{/*          PROMPT POSITIF & NÉGATIF        */}
{/* ======================================== */}
{enhancedPrompt && (
  <div className="space-y-8">

    {/* Prompt Positif */}
    <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white">Prompt Positif</h3>
        <button
          onClick={() => copyToClipboard(enhancedPrompt, 'Prompt positif')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Copier
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
          <h3 className="text-2xl font-bold text-white">Prompt Négatif</h3>
          <button
            onClick={() => copyToClipboard(negativePrompt, 'Prompt négatif')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Copier
          </button>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          {negativePrompt}
        </div>
      </div>
    )}

    {/* Message de confirmation copie */}
    {copySuccess && (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-green-400 px-8 py-4 rounded-xl text-xl font-bold animate-pulse z-50">
        {copySuccess}
      </div>
    )}
  </div>
)}

      {/* ========================================
    FOOTER – version du commit 39808021b1480240f8638d7318cd417265861067
    ======================================== */}
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
        Accueil
      </a>
      
      <span className="hidden sm:inline text-gray-600">|</span>
      
      <div className="flex gap-6">
        <a
          href="https://fmenguy.fr/oai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
        >
          OAI
        </a>
        <a
          href="https://fmenguy.fr/odia/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 transition-colors font-medium"
        >
          ODIA
        </a>
        <a
          href="https://fmenguy.fr/ocm/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
        >
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
  );
}

export default App;
