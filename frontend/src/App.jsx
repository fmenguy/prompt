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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================
            📱 HEADER
            ======================================== */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎨 AI Art Prompt Generator
          </h1>
          <p className="text-lg md:text-xl text-blue-200">
            Create detailed prompts for Stable Diffusion
          </p>
        </header>

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
          
          {/* ========================================
              👤 SUBJECT
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'subject' ? null : 'subject')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>👤 Subject</span>
              <span className="text-2xl">{activeCategory === 'subject' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'subject' && (
              <div className="p-4 md:p-6 space-y-6">
                
                {/* Character Type */}
                <div>
                  <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Character Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompts.subject.character.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => handleTagSelect('subject', tag.value)}
                        className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                          selectedTags.subject.includes(tag.value)
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-white/20 text-blue-100 hover:bg-white/30'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Slider */}
                <div>
                  <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Age Range</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white text-center mb-4 font-bold text-base md:text-lg">
                      {selectedTags.age 
                        ? `${selectedTags.age.min} - ${selectedTags.age.max} years` 
                        : 'Not specified'}
                    </div>
                    <div className="relative h-2 bg-white/20 rounded-full mb-2">
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={selectedTags.age?.min || 18}
                        onChange={(e) => handleAgeChange(
                          parseInt(e.target.value),
                          Math.max(parseInt(e.target.value), selectedTags.age?.max || 40)
                        )}
                        className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer slider-thumb"
                      />
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={selectedTags.age?.max || 40}
                        onChange={(e) => handleAgeChange(
                          Math.min(selectedTags.age?.min || 18, parseInt(e.target.value)),
                          parseInt(e.target.value)
                        )}
                        className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer slider-thumb"
                      />
                    </div>
                    <div className="flex justify-between text-blue-200 text-xs md:text-sm">
                      <span>18</span>
                      <span>80</span>
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Gender</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompts.subject.gender.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => handleGenderSelect(tag.value)}
                        className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                          selectedTags.gender === tag.value
                            ? 'bg-purple-500 text-white shadow-lg scale-105'
                            : 'bg-white/20 text-blue-100 hover:bg-white/30'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Species */}
                <div>
                  <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Species</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompts.subject.species.map((tag) => (
                      <button
                        key={tag.value}
                        onClick={() => handleTagSelect('species', tag.value)}
                        className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                          selectedTags.species.includes(tag.value)
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-white/20 text-blue-100 hover:bg-white/30'
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================
              💇 APPEARANCE
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'appearance' ? null : 'appearance')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>💇 Appearance</span>
              <span className="text-2xl">{activeCategory === 'appearance' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'appearance' && (
              <div className="p-4 md:p-6 space-y-6">
                {['bodyType', 'breastSize', 'buttSize', 'hair', 'eyes', 'facialExpression', 'headwear', 'ears'].map(
                  (subcategory) => (
                    <div key={subcategory}>
                      <h3 className="text-white font-semibold mb-3 text-sm md:text-base capitalize">
                        {subcategory.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {prompts.appearance[subcategory]?.map((tag) => (
                          <button
                            key={tag.value}
                            onClick={() => handleTagSelect(subcategory, tag.value)}
                            className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                              selectedTags[subcategory]?.includes(tag.value)
                                ? 'bg-pink-500 text-white shadow-lg scale-105'
                                : 'bg-white/20 text-blue-100 hover:bg-white/30'
                            }`}
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* ========================================
              👗 CLOTHING
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'clothing' ? null : 'clothing')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>👗 Clothing</span>
              <span className="text-2xl">{activeCategory === 'clothing' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'clothing' && (
              <div className="p-4 md:p-6 space-y-6">
                {['topwear', 'bottomwear', 'legwear', 'footwear', 'accessories'].map((subcategory) => (
                  <div key={subcategory}>
                    <h3 className="text-white font-semibold mb-3 text-sm md:text-base capitalize">
                      {subcategory.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {prompts.clothing[subcategory]?.map((tag) => (
                        <button
                          key={tag.value}
                          onClick={() => handleTagSelect(subcategory, tag.value)}
                          className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                            selectedTags[subcategory]?.includes(tag.value)
                              ? 'bg-indigo-500 text-white shadow-lg scale-105'
                              : 'bg-white/20 text-blue-100 hover:bg-white/30'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================
              📐 COMPOSITION
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'composition' ? null : 'composition')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>📐 Composition</span>
              <span className="text-2xl">{activeCategory === 'composition' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'composition' && (
              <div className="p-4 md:p-6 space-y-6">
                {['pose', 'action', 'viewpoint'].map((subcategory) => (
                  <div key={subcategory}>
                    <h3 className="text-white font-semibold mb-3 text-sm md:text-base capitalize">
                      {subcategory}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {prompts.composition[subcategory]?.map((tag) => (
                        <button
                          key={tag.value}
                          onClick={() => handleTagSelect(subcategory, tag.value)}
                          className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                            selectedTags[subcategory]?.includes(tag.value)
                              ? 'bg-cyan-500 text-white shadow-lg scale-105'
                              : 'bg-white/20 text-blue-100 hover:bg-white/30'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================
              🌍 ENVIRONMENT
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'environment' ? null : 'environment')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>🌍 Environment</span>
              <span className="text-2xl">{activeCategory === 'environment' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'environment' && (
              <div className="p-4 md:p-6 space-y-6">
                {['location', 'timeOfDay', 'lighting', 'weather'].map((subcategory) => (
                  <div key={subcategory}>
                    <h3 className="text-white font-semibold mb-3 text-sm md:text-base capitalize">
                      {subcategory.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {prompts.environment[subcategory]?.map((tag) => (
                        <button
                          key={tag.value}
                          onClick={() => handleTagSelect(subcategory, tag.value)}
                          className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                            selectedTags[subcategory]?.includes(tag.value)
                              ? 'bg-teal-500 text-white shadow-lg scale-105'
                              : 'bg-white/20 text-blue-100 hover:bg-white/30'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================
              🎨 STYLE
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'style' ? null : 'style')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>🎨 Style</span>
              <span className="text-2xl">{activeCategory === 'style' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'style' && (
              <div className="p-4 md:p-6 space-y-6">
                {['artist', 'artMedium'].map((subcategory) => (
                  <div key={subcategory}>
                    <h3 className="text-white font-semibold mb-3 text-sm md:text-base capitalize">
                      {subcategory.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {prompts.style[subcategory]?.map((tag) => (
                        <button
                          key={tag.value}
                          onClick={() => handleTagSelect(subcategory, tag.value)}
                          className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                            selectedTags[subcategory]?.includes(tag.value)
                              ? 'bg-orange-500 text-white shadow-lg scale-105'
                              : 'bg-white/20 text-blue-100 hover:bg-white/30'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================
              ⚙️ TECHNICAL
              ======================================== */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === 'technical' ? null : 'technical')}
              className="w-full px-4 md:px-6 py-4 text-left text-white font-bold text-lg md:text-xl flex justify-between items-center hover:bg-white/20 transition-colors"
            >
              <span>⚙️ Technical</span>
              <span className="text-2xl">{activeCategory === 'technical' ? '▼' : '▶'}</span>
            </button>
            
            {activeCategory === 'technical' && (
              <div className="p-4 md:p-6">
                <h3 className="text-white font-semibold mb-3 text-sm md:text-base">Quality Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {prompts.technical.quality.map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => handleTagSelect('quality', tag.value)}
                      className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                        selectedTags.quality.includes(tag.value)
                          ? 'bg-yellow-500 text-white shadow-lg scale-105'
                          : 'bg-white/20 text-blue-100 hover:bg-white/30'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================
            🎯 PROMPT OUTPUT
            ======================================== */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              onClick={() => generatePrompt(false)}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 md:py-4 px-6 rounded-xl shadow-lg transition-all"
            >
              {isGenerating ? '⏳ Generating...' : '✨ Generate Prompt'}
            </button>
            <button
              onClick={() => generatePrompt(true)}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 md:py-4 px-6 rounded-xl shadow-lg transition-all"
            >
              {isGenerating ? '⏳ Processing...' : '🚀 Generate Prompt Pro'}
            </button>
          </div>

          {enhancedPrompt && (
            <>
              {/* Positive Prompt */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-bold text-lg md:text-xl">Positive Prompt</h3>
                  <button
                    onClick={() => copyToClipboard(enhancedPrompt, 'Positive prompt')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  value={enhancedPrompt}
                  onChange={(e) => setEnhancedPrompt(e.target.value)}
                  rows={6}
                  className="w-full bg-white/5 text-white border-2 border-white/20 rounded-xl p-4 focus:border-blue-400 focus:outline-none font-mono text-sm"
                />
              </div>

              {/* Negative Prompt */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-bold text-lg md:text-xl">Negative Prompt</h3>
                  <button
                    onClick={() => copyToClipboard(negativePrompt, 'Negative prompt')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 text-white border-2 border-red-400/40 rounded-xl p-4 focus:border-red-400 focus:outline-none font-mono text-sm"
                />
              </div>

              {/* Copy Success Message */}
              {copySuccess && (
                <div className="mt-4 bg-green-500/20 border-2 border-green-500 rounded-lg p-3 text-green-100 text-center animate-pulse">
                  {copySuccess}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========================================
          📄 FOOTER
          ======================================== */}
      <footer className="text-center mt-12 text-blue-200 pb-8">
        <p className="text-sm md:text-base">Made with ❤️ for AI Artists | v2.0</p>
      </footer>
    </div>
  );
}

export default App;