// frontend/src/Changelog.jsx
import { Link } from 'react-router-dom';

function Changelog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      
      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4">
          📋 Changelog
        </h1>
        <Link 
          to="/" 
          className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
        >
          ← Retour au générateur
        </Link>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* VERSION 1.1 */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border-2 border-purple-500">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              v1.1
            </span>
            <span className="text-gray-400">
              {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">🎯 Nouvelles fonctionnalités</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">📌 Système d'épinglage</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Épinglez vos tags préférés pour qu'ils restent actifs lors du "Surprise Me"</li>
                <li>Icône 📌 au survol de chaque tag</li>
                <li>Ring jaune autour des tags épinglés pour une meilleure visibilité</li>
                <li>Compatible avec tous les types de tags (single-select et multi-select)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">🎲 Amélioration "Surprise Me"</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Le bouton respecte maintenant les tags épinglés</li>
                <li>Génération aléatoire plus intelligente et cohérente</li>
                <li>Meilleur équilibre entre variété et qualité des résultats</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">🔴 Gestion du prompt négatif</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Section masquée par défaut pour alléger l'interface</li>
                <li>Bouton rouge explicite : "Si Stable Diffusion uniquement, cliquez ici"</li>
                <li>Explication détaillée dépliable sur quand utiliser le prompt négatif</li>
                <li>Clarification : non nécessaire pour Gemini (Nano Banana) et DALL-E (ChatGPT)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">🎨 Améliorations UI/UX</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Interface plus épurée et moins chargée</li>
                <li>Animations fluides pour l'apparition des sections</li>
                <li>Meilleure hiérarchie visuelle des informations</li>
                <li>Feedback visuel amélioré sur les interactions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* VERSION 1.0 */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              v1.0
            </span>
            <span className="text-gray-400">Janvier 2025</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">🚀 Lancement initial</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-300 mb-3">🎯 Objectif du projet</h3>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">AI Art Prompt Generator</strong> a été créé pour résoudre un problème courant 
                rencontré par les créateurs d'art IA : la difficulté de générer des prompts détaillés et cohérents.
              </p>
              <p className="text-gray-300 leading-relaxed mt-3">
                Au lieu d'écrire manuellement des descriptions longues et complexes, cette application permet de 
                <strong className="text-purple-300"> construire visuellement</strong> son prompt en sélectionnant 
                des tags organisés par catégories logiques.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-300 mb-3">💡 Pourquoi cette application ?</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>
                  <strong className="text-white">Gain de temps</strong> : Plus besoin de mémoriser ou chercher 
                  la syntaxe exacte des prompts
                </li>
                <li>
                  <strong className="text-white">Cohérence</strong> : Le système détecte automatiquement les 
                  conflits entre tags (ex: "adolescent" + "barbe")
                </li>
                <li>
                  <strong className="text-white">Apprentissage</strong> : Idéal pour découvrir quels tags 
                  fonctionnent ensemble
                </li>
                <li>
                  <strong className="text-white">Créativité</strong> : Le bouton "Surprise Me" génère des 
                  combinaisons aléatoires pour l'inspiration
                </li>
                <li>
                  <strong className="text-white">Qualité professionnelle</strong> : Tags optimisés pour 
                  Stable Diffusion, Midjourney, DALL-E, etc.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-300 mb-3">✨ Fonctionnalités principales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">👤 Sujet Principal</h4>
                  <p className="text-sm text-gray-300">
                    Âge, genre, espèce avec détection automatique des conflits
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">💇 Apparence</h4>
                  <p className="text-sm text-gray-300">
                    Morphologie, cheveux, yeux, expression faciale
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">👗 Vêtements</h4>
                  <p className="text-sm text-gray-300">
                    Haut, bas, chaussures et accessoires
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">🧍 Pose & Vue</h4>
                  <p className="text-sm text-gray-300">
                    Position du corps et angle de caméra
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">🌍 Environnement</h4>
                  <p className="text-sm text-gray-300">
                    Lieu, moment, éclairage, météo
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">🎨 Style</h4>
                  <p className="text-sm text-gray-300">
                    Medium artistique et qualité technique
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-blue-300 mb-3">🛠️ Fonctionnalités techniques</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                <li>Détection intelligente des conflits de tags</li>
                <li>Génération automatique de prompts négatifs</li>
                <li>Copie en un clic dans le presse-papiers</li>
                <li>Bouton "Clear All" pour tout réinitialiser</li>
                <li>Interface responsive (mobile et desktop)</li>
                <li>Sauvegarde locale des préférences (à venir)</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/50">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">👨‍💻 À propos du créateur</h3>
              <p className="text-gray-300 leading-relaxed">
                Développé par <strong className="text-white">François Menguy</strong>, passionné d'IA et de création digitale.
                Cette application fait partie d'un écosystème d'outils créatifs incluant 
                <strong className="text-purple-300"> OAI</strong> (optimisation de prompts),
                <strong className="text-green-300"> ODIA</strong> (dialogue IA), et
                <strong className="text-yellow-300"> OCM</strong> (content management).
              </p>
            </div>
          </div>
        </div>

        {/* ROADMAP */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border-2 border-blue-500/50">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-bold text-xl">
              🚧 À venir
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">🔮 Roadmap</h2>
          
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <div>
                <strong className="text-white">Sauvegarde de presets</strong>
                <p className="text-sm text-gray-400">Enregistrez vos combinaisons favorites pour les réutiliser</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <strong className="text-white">Bibliothèque de styles</strong>
                <p className="text-sm text-gray-400">Presets prédéfinis (Anime, Réaliste, Fantaisie, etc.)</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <strong className="text-white">Historique des prompts</strong>
                <p className="text-sm text-gray-400">Retrouvez vos créations précédentes</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🌐</span>
              <div>
                <strong className="text-white">Support multilingue</strong>
                <p className="text-sm text-gray-400">Interface en anglais, français, espagnol</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <strong className="text-white">Galerie communautaire</strong>
                <p className="text-sm text-gray-400">Partagez vos créations et prompts avec la communauté</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-16 pt-8 border-t border-gray-700 text-center">
        <Link 
          to="/" 
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          ← Retour au générateur
        </Link>
      </footer>

    </div>
  );
}

export default Changelog;
