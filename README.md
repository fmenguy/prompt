# 🎨 Générateur de Prompt IA

Application web qui compose des prompts Stable Diffusion à partir de tags choisis à la souris, puis les réécrit en un prompt fluide et structuré grâce à Mistral.

En ligne : **[aiprompt.fmenguy.fr](https://aiprompt.fmenguy.fr)**

## ✨ Fonctionnalités

- **229 tags en 7 familles** : sujet (âge, genre, espèce), apparence, vêtements, composition (pose, angle), environnement (lieu, heure, lumière, météo), style et qualité.
- **Réécriture par IA** : les tags choisis sont transformés en un prompt ordonné (sujet, traits, apparence, vêtements, pose, environnement, style), qui commence par le bon préfixe (`1girl`, `1woman`, `1boy`, `1man`) selon l'âge et le genre.
- **Prompt négatif** généré automatiquement à partir des tags sélectionnés.
- **Conflits de tags** : choisir un tag incompatible avec un autre déjà choisi retire l'ancien, avec un avertissement qui le signale.
- **Épingles** : un tag épinglé est conservé quand on tire une combinaison au hasard.
- **« Surprise Me »** : une combinaison aléatoire en un clic.
- **Journal des versions** sur la page `/changelog`.

## 🏗️ Architecture

```
prompt/
├── frontend/              application React (Vite, Tailwind CSS)
│   └── src/
│       ├── data/prompts.js            catalogue des tags
│       ├── utils/tagConflicts.js      règles d'incompatibilité
│       ├── utils/negativePromptGenerator.js
│       └── services/promptGenerator.js   appel de l'API
├── api/                   fonctions serverless Vercel
│   ├── generate-prompt.js réécriture du prompt par Mistral
│   └── health.js          état du service
├── backend/               ancienne version Express, plus utilisée
└── vercel.json            build du frontend et routage de l'API
```

Le frontend et l'API sont déployés ensemble sur Vercel. La clé Mistral ne quitte jamais le serveur : le navigateur n'envoie que des identifiants de tags.

## 🔒 Sécurité de l'API

`/api/generate-prompt` est appelée sans authentification. Pour qu'elle ne puisse pas servir d'accès gratuit à Mistral :

- elle n'accepte que des catégories de tags connues, dont les valeurs sont des identifiants courts (`young_adult`, `t-shirt`) ; tout texte libre est refusé ;
- le prompt de base est reconstruit côté serveur à partir de ces identifiants, jamais repris de la requête ;
- les listes sont plafonnées et la réponse de Mistral est limitée à 400 tokens ;
- seuls le site et le développement local sont autorisés par CORS.

## 🚀 Lancer en local

Prérequis : Node.js 18 ou plus, et la [CLI Vercel](https://vercel.com/docs/cli) pour exécuter l'API.

```bash
# API sur http://localhost:3000, avec la clé dans api/.env (jamais versionné)
echo "MISTRAL_API_KEY=ta_cle" > api/.env
vercel dev

# Interface sur http://localhost:5173, dans un autre terminal
cd frontend
npm install
npm run dev
```

L'interface appelle `http://localhost:3000` par défaut. En production, `VITE_API_URL` indique l'adresse de l'API.

## 🛠️ Technologies

- **Interface** : React 19, Vite 7, Tailwind CSS 3, React Router 7, Lucide (icônes)
- **API** : fonctions serverless Vercel (Node.js), Mistral (`mistral-small-latest`)

## 👤 Auteur

**François Menguy**, [fmenguy.fr](https://fmenguy.fr)

## 📄 Licence

MIT, voir [LICENSE](LICENSE).
