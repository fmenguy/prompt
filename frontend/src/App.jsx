import { useState } from "react";
import { promptData } from "./data/prompts";
import { generateEnhancedPrompt } from "./services/promptGenerator";

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
  const [subjectData, setSubjectData] = useState({
    type: "",
    species: "",
    gender: "",
    age: "",
  });
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTag = (value) => {
    setSelectedTags((prev) =>
      prev.includes(value)
        ? prev.filter((tag) => tag !== value)
        : [...prev, value]
    );
  };

  const handleSubjectChange = (category, value) => {
    setSubjectData((prev) => ({ ...prev, [category]: value }));
  };

  const generatePrompt = async () => {
    if (selectedTags.length === 0) {
      alert("⚠️ Sélectionnez au moins un tag !");
      return;
    }

    setIsGenerating(true);
    try {
      const enhanced = await generateEnhancedPrompt(selectedTags, subjectData);
      setGeneratedPrompt(enhanced);
    } catch (error) {
      console.error("Erreur:", error);
      setGeneratedPrompt(selectedTags.join(", "));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* 🆕 NOUVEAU HEADER */}
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

        {/* SUJET PRINCIPAL */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">🎯 Sujet Principal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Type</label>
              <select
                value={subjectData.type}
                onChange={(e) => handleSubjectChange("type", e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700"
              >
                <option value="">-- Sélectionner --</option>
                {promptData.subject.type.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {subjectData.type === "person" && (
              <>
                <div>
                  <label className="block text-white font-semibold mb-2">Espèce</label>
                  <select
                    value={subjectData.species}
                    onChange={(e) => handleSubjectChange("species", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700"
                  >
                    <option value="">-- Sélectionner --</option>
                    {promptData.subject.species.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Genre</label>
                  <select
                    value={subjectData.gender}
                    onChange={(e) => handleSubjectChange("gender", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700"
                  >
                    <option value="">-- Sélectionner --</option>
                    {promptData.subject.gender.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Âge</label>
                  <select
                    value={subjectData.age}
                    onChange={(e) => handleSubjectChange("age", e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700"
                  >
                    <option value="">-- Sélectionner --</option>
                    {promptData.subject.age.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTIONS DE TAGS */}
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

        {/* BOUTON DE GÉNÉRATION */}
        <div className="text-center mb-8">
          <button
            onClick={generatePrompt}
            disabled={isGenerating}
            className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
              isGenerating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isGenerating ? "⏳ Génération en cours..." : "✨ Générer le Prompt Pro"}
          </button>
        </div>

        {/* AFFICHAGE DU PROMPT */}
        {generatedPrompt && (
          <div className="bg-gradient-to-r from-green-900 to-teal-900 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎯 Votre Prompt Professionnel :
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

        {/* TAGS SÉLECTIONNÉS */}
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

        {/* 🆕 NOUVEAU FOOTER */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Créé par <span className="text-white font-semibold">François Menguy</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <a
                href="https://fmenguy.fr"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                🏠 Accueil
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <div className="flex gap-4">
                <a
                  href="https://fmenguy.fr/oai/"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  OAI
                </a>
                <a
                  href="https://fmenguy.fr/odia/"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  ODIA
                </a>
                <a
                  href="https://fmenguy.fr/ocm/"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  OCM
                </a>
              </div>
            </div>

            <p className="text-gray-500 text-xs mt-4">
              © {new Date().getFullYear()} - Tous droits réservés
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
