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
    <div className="app">
      <header className="app-header">
        <h1>🎨 AI Art Prompt Generator</h1>
        <p className="subtitle">Create detailed prompts for Stable Diffusion</p>
      </header>

      {/* ========================================
          🔔 MONO-CHARACTER WARNING
          ======================================== */}
      {characterCount > 1 && (
        <div className="info-banner warning">
          ⚠️ <strong>Multi-character mode:</strong> Stable Diffusion often struggles with multiple characters. 
          For best results, consider generating one character at a time and compositing in post-production.
        </div>
      )}

      {/* ========================================
          ⚠️ CONFLICT WARNING
          ======================================== */}
      {conflictWarning && (
        <div className="conflict-warning">
          <strong>⚠️ Conflict detected:</strong> "{conflictWarning.newTag}" conflicts with{' '}
          {conflictWarning.conflicts.map((c, i) => (
            <span key={i}>
              "{c}"{i < conflictWarning.conflicts.length - 1 ? ', ' : ''}
            </span>
          ))}
          . Conflicting tags have been removed.
          <button onClick={() => setConflictWarning(null)}>✕</button>
        </div>
      )}

      <div className="main-content">
        {/* ========================================
            🎲 SURPRISE ME BUTTON
            ======================================== */}
        <div className="surprise-section">
          <button className="surprise-button" onClick={surpriseMe}>
            🎲 Surprise Me!
          </button>
          <span className="surprise-hint">Generate a random character</span>
        </div>

        {/* ========================================
            👥 CHARACTER COUNT
            ======================================== */}
        <div className="character-count-section">
          <label>Number of Characters:</label>
          <div className="counter-controls">
            <button onClick={() => setCharacterCount(Math.max(1, characterCount - 1))}>-</button>
            <span className="count-display">{characterCount}</span>
            <button onClick={() => setCharacterCount(Math.min(5, characterCount + 1))}>+</button>
          </div>
        </div>

        {/* ========================================
            🏷️ TAG CATEGORIES
            ======================================== */}
        <div className="categories-container">
          {/* SUBJECT */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'subject' ? null : 'subject')}>
              👤 Subject {activeCategory === 'subject' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'subject' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Character Type</h3>
                  {prompts.subject.character.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.subject.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('subject', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                {/* ========================================
                    👤 AGE SLIDER (NEW)
                    ======================================== */}
                <div className="subcategory age-slider-section">
                  <h3>Age Range</h3>
                  <div className="age-slider-container">
                    <div className="age-display">
                      {selectedTags.age ? `${selectedTags.age.min} - ${selectedTags.age.max} years` : 'Not specified'}
                    </div>
                    <div className="dual-slider">
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={selectedTags.age?.min || 18}
                        onChange={(e) => handleAgeChange(
                          parseInt(e.target.value),
                          Math.max(parseInt(e.target.value), selectedTags.age?.max || 40)
                        )}
                        className="slider slider-min"
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
                        className="slider slider-max"
                      />
                    </div>
                    <div className="age-labels">
                      <span>18</span>
                      <span>80</span>
                    </div>
                  </div>
                </div>

                {/* ========================================
                    🚹 GENDER (NEW - Separated)
                    ======================================== */}
                <div className="subcategory">
                  <h3>Gender</h3>
                  {prompts.subject.gender.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.gender === tag.value ? 'selected' : ''}`}
                      onClick={() => handleGenderSelect(tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Species</h3>
                  {prompts.subject.species.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.species.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('species', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* APPEARANCE */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'appearance' ? null : 'appearance')}>
              💇 Appearance {activeCategory === 'appearance' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'appearance' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Body Type</h3>
                  {prompts.appearance.bodyType.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.bodyType.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('bodyType', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Breast Size</h3>
                  {prompts.appearance.breastSize.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.breastSize.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('breastSize', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Butt Size</h3>
                  {prompts.appearance.buttSize.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.buttSize.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('buttSize', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Hair</h3>
                  {prompts.appearance.hair.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.hair.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('hair', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Eyes</h3>
                  {prompts.appearance.eyes.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.eyes.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('eyes', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Facial Expression</h3>
                  {prompts.appearance.facialExpression.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.facialExpression.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('facialExpression', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Headwear</h3>
                  {prompts.appearance.headwear.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.headwear.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('headwear', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Ears</h3>
                  {prompts.appearance.ears.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.ears.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('ears', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CLOTHING */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'clothing' ? null : 'clothing')}>
              👗 Clothing {activeCategory === 'clothing' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'clothing' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Topwear</h3>
                  {prompts.clothing.topwear.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.topwear.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('topwear', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Bottomwear</h3>
                  {prompts.clothing.bottomwear.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.bottomwear.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('bottomwear', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Legwear</h3>
                  {prompts.clothing.legwear.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.legwear.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('legwear', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Footwear</h3>
                  {prompts.clothing.footwear.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.footwear.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('footwear', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Accessories</h3>
                  {prompts.clothing.accessories.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.accessories.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('accessories', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COMPOSITION */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'composition' ? null : 'composition')}>
              🎭 Composition {activeCategory === 'composition' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'composition' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Pose</h3>
                  {prompts.composition.pose.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.pose.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('pose', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Action</h3>
                  {prompts.composition.action.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.action.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('action', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Viewpoint</h3>
                  {prompts.composition.viewpoint.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.viewpoint.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('viewpoint', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ENVIRONMENT */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'environment' ? null : 'environment')}>
              🌍 Environment {activeCategory === 'environment' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'environment' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Location</h3>
                  {prompts.environment.location.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.location.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('location', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Time of Day</h3>
                  {prompts.environment.timeOfDay.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.timeOfDay.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('timeOfDay', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Lighting</h3>
                  {prompts.environment.lighting.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.lighting.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('lighting', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Weather</h3>
                  {prompts.environment.weather.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.weather.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('weather', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STYLE */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'style' ? null : 'style')}>
              🎨 Style {activeCategory === 'style' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'style' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Artist Style</h3>
                  {prompts.style.artist.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.artist.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('artist', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div className="subcategory">
                  <h3>Art Medium</h3>
                  {prompts.style.artMedium.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.artMedium.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('artMedium', tag.value)}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TECHNICAL */}
          <div className="category-section">
            <h2 onClick={() => setActiveCategory(activeCategory === 'technical' ? null : 'technical')}>
              ⚙️ Technical {activeCategory === 'technical' ? '▼' : '▶'}
            </h2>
            {activeCategory === 'technical' && (
              <div className="tags-grid">
                <div className="subcategory">
                  <h3>Quality Tags</h3>
                  {prompts.technical.quality.map((tag) => (
                    <button
                      key={tag.value}
                      className={`tag-button ${selectedTags.quality.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => handleTagSelect('quality', tag.value)}
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
        <div className="prompt-output">
          <div className="generate-buttons">
            <button
              className="generate-btn"
              onClick={() => generatePrompt(false)}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generating...' : '✨ Generate Prompt'}
            </button>
            <button
              className="generate-btn pro"
              onClick={() => generatePrompt(true)}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Processing...' : '🚀 Generate Prompt Pro'}
            </button>
          </div>

          {enhancedPrompt && (
            <>
              <div className="prompt-box">
                <div className="prompt-header">
                  <h3>Positive Prompt</h3>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(enhancedPrompt, 'Positive prompt')}
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  className="prompt-textarea"
                  value={enhancedPrompt}
                  onChange={(e) => setEnhancedPrompt(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="prompt-box">
                <div className="prompt-header">
                  <h3>Negative Prompt</h3>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(negativePrompt, 'Negative prompt')}
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  className="prompt-textarea negative"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={4}
                />
              </div>

              {copySuccess && <div className="copy-success">{copySuccess}</div>}
            </>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>Made with ❤️ for AI Artists | v2.0</p>
      </footer>
    </div>
  );
}

export default App;