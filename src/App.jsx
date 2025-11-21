import { useState } from "react";
import { promptData } from "./data/prompts";

// Composant pour un tag cliquable
function TagButton({ tag, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isSelected
          ? "bg-blue-600 text-white shadow-lg scale-105"
          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
      }`}
    >
      {tag.label}
    </button>
  );
}

// Composant pour une section de tags
function TagSection({ title, tags, selectedTags, onToggle }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {tags?.map((tag, index) => (
          <TagButton
            key={index}
            tag={tag}
            isSelected={selectedTags.includes(tag.value)}
            onClick={() => onToggle(tag.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Basculer la sélection d'un tag
  const toggleTag = (value) => {
    setSelectedTags((prev) =>
      prev.includes(value)
        ? prev.filter((tag) => tag !== value)
        : [...prev, value]
    );
  };

  // Générer le prompt final
  const generatePrompt = () => {
    setGeneratedPrompt(selectedTags.join(", "));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎨 AI Prompt Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Sélectionnez des tags pour créer votre prompt parfait
          </p>
        </div>

        {/* Sections de tags */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-8">
          <TagSection
            title="🌟 Qualité"
            tags={promptData.quality}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="🎨 Style de peinture"
            tags={promptData.painting?.style}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="✨ Effets"
            tags={promptData.effects}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">👤 Apparence</h2>
          
          <TagSection
            title="💇 Cheveux"
            tags={promptData.appearance?.hair}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="👁️ Yeux"
            tags={promptData.appearance?.eyes}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="😊 Expression faciale"
            tags={promptData.appearance?.facialExpression}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="👒 Couvre-chef"
            tags={promptData.appearance?.headwear}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="🐱 Oreilles"
            tags={promptData.appearance?.ears}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <h2 className="text-2xl font-bold text-white mb-6 mt-8">📸 Composition</h2>

          <TagSection
            title="📐 Angle"
            tags={promptData.composition?.angle}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="🖼️ Forme"
            tags={promptData.composition?.form}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />

          <TagSection
            title="📷 Caméra"
            tags={promptData.composition?.camera}
            selectedTags={selectedTags}
            onToggle={toggleTag}
          />
        </div>

        {/* Bouton de génération */}
        <div className="text-center mb-8">
          <button
            onClick={generatePrompt}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ✨ Générer le Prompt
          </button>
        </div>

        {/* Affichage du prompt généré */}
        {generatedPrompt && (
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎯 Votre Prompt :
            </h3>
            <div className="bg-gray-900 rounded-lg p-6 text-gray-200 font-mono text-sm leading-relaxed">
              {generatedPrompt}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generatedPrompt)}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📋 Copier
            </button>
          </div>
        )}

        {/* Tags sélectionnés */}
        {selectedTags.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-3">
              Tags sélectionnés ({selectedTags.length}) :
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
