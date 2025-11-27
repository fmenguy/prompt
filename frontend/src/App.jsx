// frontend/src/App.jsx

//import

import { useState } from 'react';
import { promptData as prompts } from './data/prompts';
import { generateEnhancedPrompt } from './services/promptGenerator';
import { generateNegativePrompt } from './utils/negativePromptGenerator';
import { getConflictingTags, removeConflictingTags } from './utils/tagConflicts';
//pour les changelogs
import { Link } from 'react-router-dom';
import './App.css';


function App() {

  // ************** TOUS LES useState **********************************************

  const [selectedTags, setSelectedTags] = useState({
    subject: [],
    age: null,
    gender: null,
    species: null,
    bodyType: null,
    breastSize: null,
    buttSize: null,
    hairLength: null,
    hairStyle: [],
    hairColor: null,
    eyes: null,
    facialExpression: null,
    topwear: null,
    bottomwear: null,
    footwear: null,
    accessories: [],
    pose: null,
    viewpoint: null,
    location: null,
    timeOfDay: null,
    lighting: null,
    weather: null,
    artMedium: null,
    quality: [],
  });
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [conflictWarning, setConflictWarning] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //Etat pour bandeau négatif - 27/11/2025
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  const [showNegativeExplanation, setShowNegativeExplanation] = useState(false);
  // Fonction pour épingler/désépingler
  const [pinnedTags, setPinnedTags] = useState({
    subject: [],
    age: null,
    gender: null,
    species: null,
    bodyType: null,
    breastSize: null,
    buttSize: null,
    hairLength: null,
    hairStyle: [],
    hairColor: null,
    eyes: null,
    facialExpression: null,
    topwear: null,
    bottomwear: null,
    footwear: null,
    accessories: [],
    pose: null,
    viewpoint: null,
    location: null,
    timeOfDay: null,
    lighting: null,
    weather: null,
    artMedium: null,
    quality: [],
  });

  // ************** LES CONSTANTES **********************************************

  const SINGLE_SELECT_CATEGORIES = [
    'gender', 'age', 'species', 'bodyType', 'breastSize', 'buttSize',
    'hairLength', 'hairColor', 'eyes',
    'facialExpression', 'topwear', 'bottomwear', 'footwear',
    'pose', 'viewpoint', 'location', 'timeOfDay', 'lighting',
    'weather', 'artMedium'
  ];

  // ************** LES FONCTIONS  **********************************************

  const togglePinTag = (category, value) => {
    setPinnedTags(prev => {
      const current = prev[category];

      if (Array.isArray(current)) {
        const isPinned = current.includes(value);
        return {
          ...prev,
          [category]: isPinned
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      } else {
        return {
          ...prev,
          [category]: current === value ? null : value
        };
      }
    });
  };

  // Vérifier si un tag est épinglé
  const isTagPinned = (category, value) => {
    const pinned = pinnedTags[category];
    if (Array.isArray(pinned)) {
      return pinned.includes(value);
    }
    return pinned === value;
  };

  const isTagSelected = (category, value) => {
    const selected = selectedTags[category];
    if (Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const handleTagSelect = (category, value) => {
    setSelectedTags(prev => {
      const isSingleSelect = SINGLE_SELECT_CATEGORIES.includes(category);

      if (isSingleSelect) {
        // ✅ Single-select : remplace SANS toggle (sauf si même valeur)
        const currentValue = Array.isArray(prev[category]) ? prev[category][0] : prev[category];

        // ✅ Si on clique sur le même bouton, on désélectionne
        if (currentValue === value) {
          return { ...prev, [category]: null };
        }

        // ✅ Vérification des conflits
        const conflicts = getConflictingTags(category, value, prev);
        if (conflicts.length > 0) {
          setConflictWarning({
            newTag: value,
            conflicts: conflicts.map(c => c.tag),
          });
        }

        // ✅ Supprime les conflits et applique la nouvelle valeur
        const cleaned = removeConflictingTags(prev, conflicts);
        return { ...cleaned, [category]: value };
      } else {
        // ✅ Multi-select : toggle (ajoute/retire)
        const current = prev[category] || [];
        const isSelected = current.includes(value);

        if (isSelected) {
          // Retire le tag
          return { ...prev, [category]: current.filter(t => t !== value) };
        } else {
          // Ajoute le tag
          const conflicts = getConflictingTags(category, value, prev);
          if (conflicts.length > 0) {
            setConflictWarning({
              newTag: value,
              conflicts: conflicts.map(c => c.tag),
            });
            const cleaned = removeConflictingTags(prev, conflicts);
            return { ...cleaned, [category]: [...(cleaned[category] || []), value] };
          }
          return { ...prev, [category]: [...current, value] };
        }
      }
    });
  };

  const surpriseMe = () => {
    const getRandomItem = (arr) => {
      if (!arr || arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)].value;
    };

    const getRandomItems = (arr, count = 2) => {
      if (!arr || arr.length === 0) return [];
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count).map(item => item.value);
    };

    // ✅ Génération aléatoire EN RESPECTANT LES PINS
    const randomTags = {
      // SUJET PRINCIPAL
      age: pinnedTags.age || getRandomItem(prompts.subject.age),
      gender: pinnedTags.gender || getRandomItem(prompts.subject.gender),
      species: pinnedTags.species || getRandomItem(prompts.subject.species),

      // APPARENCE
      bodyType: pinnedTags.bodyType || getRandomItem(prompts.appearance.bodyType),
      breastSize: pinnedTags.breastSize || (Math.random() > 0.5 ? getRandomItem(prompts.appearance.breastSize) : null),
      buttSize: pinnedTags.buttSize || (Math.random() > 0.5 ? getRandomItem(prompts.appearance.buttSize) : null),
      hairLength: pinnedTags.hairLength || getRandomItem(prompts.appearance.hairLength),
      hairStyle: pinnedTags.hairStyle.length > 0
        ? pinnedTags.hairStyle
        : getRandomItems(prompts.appearance.hairStyle, Math.floor(Math.random() * 2) + 1),
      hairColor: pinnedTags.hairColor || getRandomItem(prompts.appearance.hairColor),
      eyes: pinnedTags.eyes || getRandomItem(prompts.appearance.eyes),
      facialExpression: pinnedTags.facialExpression || getRandomItem(prompts.appearance.facialExpression),

      // VÊTEMENTS
      topwear: pinnedTags.topwear || getRandomItem(prompts.clothing.topwear),
      bottomwear: pinnedTags.bottomwear || getRandomItem(prompts.clothing.bottomwear),
      footwear: pinnedTags.footwear || (Math.random() > 0.3 ? getRandomItem(prompts.clothing.footwear) : null),
      accessories: pinnedTags.accessories.length > 0
        ? pinnedTags.accessories
        : getRandomItems(prompts.clothing.accessories, Math.floor(Math.random() * 3)),

      // POSE & VIEWPOINT
      pose: pinnedTags.pose || getRandomItem(prompts.composition.pose),
      viewpoint: pinnedTags.viewpoint || getRandomItem(prompts.composition.viewpoint),

      // ENVIRONNEMENT
      location: pinnedTags.location || getRandomItem(prompts.environment.location),
      timeOfDay: pinnedTags.timeOfDay || getRandomItem(prompts.environment.timeOfDay),
      lighting: pinnedTags.lighting || getRandomItem(prompts.environment.lighting),
      weather: pinnedTags.weather || (Math.random() > 0.5 ? getRandomItem(prompts.environment.weather) : null),

      // STYLE
      artMedium: pinnedTags.artMedium || getRandomItem(prompts.style.artMedium),
      quality: pinnedTags.quality.length > 0
        ? pinnedTags.quality
        : getRandomItems(prompts.technical.quality, 3),

      // Ancien système (si tu l'utilises encore)
      subject: pinnedTags.subject.length > 0
        ? pinnedTags.subject
        : []
    };

    setSelectedTags(randomTags);
    setConflictWarning(null);
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

  const generatePrompt = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const basePromptFromTags = Object.entries(selectedTags)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
        // eslint-disable-next-line no-unused-vars
        .map(([category, value]) => {
          if (Array.isArray(value)) {
            return value.join(', ');
          }
          return value;
        })
        .join(', ');

      console.log('📦 Tags sélectionnés:', selectedTags);
      console.log('📝 Base prompt généré:', basePromptFromTags);

      const enhanced = await generateEnhancedPrompt(basePromptFromTags, selectedTags);

      // ✅ AJOUTE CE LOG ICI
      console.log('🎨 PROMPT RETOURNÉ PAR MISTRAL:', enhanced);
      console.log('🔍 Longueur du prompt:', enhanced.length, 'caractères');

      setEnhancedPrompt(enhanced);
      setNegativePrompt(generateNegativePrompt(selectedTags));

    } catch (error) {
      console.error('❌ Erreur génération prompt:', error);
      setError(error.message || 'Erreur lors de la génération du prompt');
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-center text-gray-400 text-sm mt-4">
            💡 Astuce : Cliquez sur 📌 pour épingler un tag. Le bouton "42" conservera les tags épinglés !
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              42 🎲
              {Object.values(pinnedTags).some(v =>
                (Array.isArray(v) && v.length > 0) || (!Array.isArray(v) && v !== null)
              ) && (
                  <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                    📌 {Object.values(pinnedTags).flat().filter(Boolean).length} épinglés
                  </span>
                )}
            </button>

            {/* Generate Prompt */}
            <button
              onClick={generatePrompt}
              disabled={isLoading}
              className={`bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
            >
              {isLoading ? '⏳ Génération...' : '✨ Générer le Prompt'}
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

            {/* Bouton Prompt Négatif (compact) */}
            {negativePrompt && (
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">

                {/* Bouton titre cliquable */}
                <button
                  onClick={() => setShowNegativeExplanation(!showNegativeExplanation)}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  ⚠️ Si Stable Diffusion uniquement, cliquez ici
                  <span className="text-2xl">{showNegativeExplanation ? '▲' : '▼'}</span>
                </button>

                {/* Explication dépliable */}
                {showNegativeExplanation && (
                  <div className="mt-6 bg-gray-900 rounded-lg p-6 text-gray-300 leading-relaxed space-y-4 animate-fadeIn">
                    <p className="text-white font-semibold">
                      🎯 Le prompt négatif est nécessaire uniquement pour Stable Diffusion.
                    </p>

                    <div>
                      <p className="text-green-400 font-semibold mb-2">✅ Pas besoin si vous utilisez :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                        <li>Gemini (Google AI / Nano Banana)</li>
                        <li>DALL-E (ChatGPT / OpenAI)</li>
                        <li>Midjourney</li>
                        <li>Ideogram</li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-orange-400 font-semibold mb-2">⚠️ Nécessaire si vous utilisez :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                        <li>Stable Diffusion (Automatic1111, ComfyUI, etc.)</li>
                        <li>Civitai</li>
                        <li>RunDiffusion</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setShowNegativePrompt(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors mt-4"
                    >
                      🔓 Afficher le Prompt Négatif
                    </button>
                  </div>
                )}

                {/* Prompt Négatif (affiché après clic sur "Afficher") */}
                {showNegativePrompt && (
                  <div className="mt-6 bg-gray-900 rounded-lg p-6 animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white">❌ Prompt Négatif</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => copyToClipboard(negativePrompt, 'Prompt négatif')}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm"
                        >
                          📋 Copier
                        </button>
                        <button
                          onClick={() => setShowNegativePrompt(false)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-bold transition-colors text-sm"
                        >
                          ✖️
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-950 rounded-lg p-4 text-gray-200 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                      {negativePrompt}
                    </div>
                  </div>
                )}
              </div>
            )}


          </div>
        )}

        {/* 👤 SUJET PRINCIPAL */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8 mt-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Sujet Principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Âge */}
            <div>
              <label className="block text-white font-semibold mb-3">Âge</label>
              <div className="flex flex-wrap gap-2">
                {prompts.subject.age.map((tag) => {
                  const selected = selectedTags.age === tag.value;
                  const pinned = isTagPinned('age', tag.value);
                  return (
                    <div key={tag.value} className="relative group">
                      <button
                        onClick={() => handleTagSelect('age', tag.value)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        {tag.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinTag('age', tag.value);
                        }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                          ? 'bg-yellow-500 text-white opacity-100'
                          : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                        title={pinned ? "Désépingler" : "Épingler"}
                      >
                        📌
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-white font-semibold mb-3">Genre</label>
              <div className="flex flex-wrap gap-2">
                {prompts.subject.gender.map((tag) => {
                  const selected = selectedTags.gender === tag.value;
                  const pinned = isTagPinned('gender', tag.value);
                  return (
                    <div key={tag.value} className="relative group">
                      <button
                        onClick={() => handleTagSelect('gender', tag.value)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        {tag.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinTag('gender', tag.value);
                        }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                          ? 'bg-yellow-500 text-white opacity-100'
                          : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                        title={pinned ? "Désépingler" : "Épingler"}
                      >
                        📌
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESPÈCE */}
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-3">Espèce</h3>
              <div className="flex flex-wrap gap-3">
                {prompts.subject.species.map((spec) => {
                  const selected = selectedTags.species === spec.value;
                  const pinned = isTagPinned('species', spec.value);
                  return (
                    <div key={spec.value} className="relative group">
                      <button
                        onClick={() => handleTagSelect('species', spec.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        {spec.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinTag('species', spec.value);
                        }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                          ? 'bg-yellow-500 text-white opacity-100'
                          : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                        title={pinned ? "Désépingler" : "Épingler"}
                      >
                        📌
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* 💇 APPARENCE */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Apparence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['bodyType', 'breastSize', 'buttSize', 'hairLength', 'hairStyle', 'hairColor', 'eyes', 'facialExpression'].map((cat) => (
              <div key={cat}>
                <h3 className="text-xl font-bold text-white mb-4 capitalize">
                  {cat === 'bodyType' ? '💪 Morphologie' :
                    cat === 'breastSize' ? '🍒 Poitrine' :
                      cat === 'buttSize' ? '🍑 Fessiers' :
                        cat === 'hairLength' ? '💇 Longueur Cheveux' :
                          cat === 'hairStyle' ? '✨ Style Cheveux' :
                            cat === 'hairColor' ? '🎨 Couleur Cheveux' :
                              cat === 'eyes' ? '👁️ Yeux' :
                                cat === 'facialExpression' ? '😊 Expression' : cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(prompts.appearance[cat] || []).map((tag) => {
                    const selected = isTagSelected(cat, tag.value);
                    const pinned = isTagPinned(cat, tag.value);
                    return (
                      <div key={tag.value} className="relative group">
                        <button
                          onClick={() => handleTagSelect(cat, tag.value)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                            ? 'bg-pink-600 text-white shadow-lg scale-105'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                        >
                          {tag.label}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinTag(cat, tag.value);
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                            ? 'bg-yellow-500 text-white opacity-100'
                            : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                            }`}
                          title={pinned ? "Désépingler" : "Épingler"}
                        >
                          📌
                        </button>
                      </div>
                    );
                  })}
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
                  {(prompts.clothing[cat] || []).map((tag) => {
                    const selected = isTagSelected(cat, tag.value);
                    const pinned = isTagPinned(cat, tag.value);
                    return (
                      <div key={tag.value} className="relative group">
                        <button
                          onClick={() => handleTagSelect(cat, tag.value)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                        >
                          {tag.label}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinTag(cat, tag.value);
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                            ? 'bg-yellow-500 text-white opacity-100'
                            : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                            }`}
                          title={pinned ? "Désépingler" : "Épingler"}
                        >
                          📌
                        </button>
                      </div>
                    );
                  })}
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
                  {(prompts.composition[cat] || []).map((tag) => {
                    const selected = isTagSelected(cat, tag.value);
                    const pinned = isTagPinned(cat, tag.value);
                    return (
                      <div key={tag.value} className="relative group">
                        <button
                          onClick={() => handleTagSelect(cat, tag.value)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                            ? 'bg-cyan-600 text-white shadow-lg scale-105'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                        >
                          {tag.label}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinTag(cat, tag.value);
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                            ? 'bg-yellow-500 text-white opacity-100'
                            : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                            }`}
                          title={pinned ? "Désépingler" : "Épingler"}
                        >
                          📌
                        </button>
                      </div>
                    );
                  })}
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
                  {(prompts.environment[cat] || []).map((tag) => {
                    const selected = isTagSelected(cat, tag.value);
                    const pinned = isTagPinned(cat, tag.value);
                    return (
                      <div key={tag.value} className="relative group">
                        <button
                          onClick={() => handleTagSelect(cat, tag.value)}
                          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                            ? 'bg-teal-600 text-white shadow-lg scale-105'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                        >
                          {tag.label}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinTag(cat, tag.value);
                          }}
                          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                            ? 'bg-yellow-500 text-white opacity-100'
                            : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                            }`}
                          title={pinned ? "Désépingler" : "Épingler"}
                        >
                          📌
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎨 STYLE */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Style artistique</h2>
          <div className="flex flex-wrap gap-3">
            <div>
              <div className="flex flex-wrap gap-2">
                {(prompts.style?.artist || []).map((tag) => {
                  const selected = isTagSelected('artist', tag.value);
                  const pinned = isTagPinned('artist', tag.value);
                  return (
                    <div key={tag.value} className="relative group">
                      <button
                        onClick={() => handleTagSelect('artist', tag.value)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                          ? 'bg-orange-600 text-white shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        {tag.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinTag('artist', tag.value);
                        }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                          ? 'bg-yellow-500 text-white opacity-100'
                          : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                        title={pinned ? "Désépingler" : "Épingler"}
                      >
                        📌
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {(prompts.style?.artMedium || []).map((tag) => {
                  const selected = isTagSelected('artMedium', tag.value);
                  const pinned = isTagPinned('artMedium', tag.value);
                  return (
                    <div key={tag.value} className="relative group">
                      <button
                        onClick={() => handleTagSelect('artMedium', tag.value)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                          ? 'bg-amber-600 text-white shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        {tag.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinTag('artMedium', tag.value);
                        }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                          ? 'bg-yellow-500 text-white opacity-100'
                          : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                          }`}
                        title={pinned ? "Désépingler" : "Épingler"}
                      >
                        📌
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ⚙️ QUALITÉ */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Qualité & Technique</h2>
          <div className="flex flex-wrap gap-2">
            {(prompts.technical?.quality || []).map((tag) => {
              const selected = isTagSelected('quality', tag.value);
              const pinned = isTagPinned('quality', tag.value);
              return (
                <div key={tag.value} className="relative group">
                  <button
                    onClick={() => handleTagSelect('quality', tag.value)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${selected
                      ? 'bg-yellow-500 text-black shadow-lg scale-105'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      } ${pinned ? 'ring-2 ring-yellow-500' : ''}`}
                  >
                    {tag.label}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinTag('quality', tag.value);
                    }}
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all transform hover:scale-110 shadow-lg ${pinned
                      ? 'bg-yellow-500 text-white opacity-100'
                      : 'bg-gray-700 text-gray-400 opacity-0 group-hover:opacity-100'
                      }`}
                    title={pinned ? "Désépingler" : "Épingler"}
                  >
                    📌
                  </button>
                </div>
              );
            })}
          </div>
        </div>


        {/* Message de confirmation */}
        {copySuccess && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-green-400 px-8 py-4 rounded-xl text-xl font-bold animate-pulse z-50 shadow-2xl border-2 border-green-500">
            ✅ {copySuccess}
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-8 py-4 rounded-xl text-lg font-bold z-50 shadow-2xl border-2 border-red-500 max-w-md">
            ❌ {error}
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

              <Link
                to="/changelog"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                📋 Changelog
              </Link>

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
              © {new Date().getFullYear()} François Menguy - Tous droits réservés
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
