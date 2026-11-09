# Générateur de prompt IA (AIPrompt)

🇫🇷 Français · 🇬🇧 [English](#english)

<a id="francais"></a>

Application web qui compose un prompt pour les IA de génération d'images (syntaxe Stable Diffusion) à partir de tags choisis à la souris, puis le fait réécrire par Mistral en un prompt fluide et ordonné. Le prompt négatif est calculé dans le navigateur, sans appel à l'IA.

En ligne : **[aiprompt.fmenguy.fr](https://aiprompt.fmenguy.fr)**

## Fonctionnalités

- **229 tags répartis en 7 familles** : sujet (âge, genre, espèce), apparence, vêtements, composition (pose, angle de vue), environnement (lieu, moment de la journée, lumière, météo), style (technique artistique) et qualité.
- **Sélection guidée** : la plupart des catégories n'acceptent qu'un tag à la fois, et en choisir un autre remplace le précédent, avec un avertissement quand les deux sont déclarés incompatibles. Coiffure, accessoires et qualité acceptent plusieurs tags.
- **Réécriture par IA** : les tags sont envoyés à une fonction serverless qui demande à Mistral un prompt en anglais, ordonné (sujet, traits, apparence, vêtements, pose, environnement, style) et limité à 200 mots. Il commence par `1girl`, `1woman`, `1boy` ou `1man` selon le genre et l'âge choisis.
- **Prompt négatif** : une base fixe (défauts de qualité et d'anatomie) complétée selon les tags sélectionnés, calculée localement.
- **Copie en un clic** du prompt et du prompt négatif.
- **Tirage aléatoire** (bouton « 42 ») : une combinaison complète au hasard. Les tags épinglés (📌) sont conservés.
- **Journal des versions** sur la page `/changelog`.

## Architecture

```
prompt/
├── frontend/                   application React (Vite, Tailwind CSS)
│   ├── index.html
│   └── src/
│       ├── main.jsx                       routes / et /changelog
│       ├── App.jsx                        écran principal (tags, épingles, tirage, résultats)
│       ├── Changelog.jsx                  page /changelog
│       ├── data/prompts.js                catalogue des tags
│       ├── utils/tagConflicts.js          règles d'incompatibilité
│       ├── utils/negativePromptGenerator.js   prompt négatif
│       └── services/promptGenerator.js    appel de l'API
├── api/                        fonctions serverless Vercel
│   ├── generate-prompt.js      réécriture du prompt par Mistral
│   └── health.js               état du service
├── backend/                    vestiges d'une ancienne version, plus utilisés
├── ordre                       schéma texte du flux de génération
└── vercel.json                 build du frontend et routage de l'API
```

Le frontend et l'API sont déployés ensemble sur Vercel. La clé Mistral reste côté serveur : le navigateur n'envoie que des identifiants de tags.

La fonction `api/generate-prompt.js` regroupe les tags par thème, déduit le préfixe (`1girl`, `1man`...), puis appelle `mistral-small-latest` (400 tokens au plus, température 0,7) et nettoie la réponse (guillemets, phrases d'introduction, virgules doublées). Pour changer le style des prompts produits, c'est le prompt système de ce fichier qu'il faut modifier.

## Sécurité de l'API

`/api/generate-prompt` est appelée sans authentification. Pour limiter son usage à ce qu'elle doit faire :

- elle n'accepte que des catégories de tags connues, dont les valeurs sont des identifiants courts (`young_adult`, `t-shirt`) ; tout texte libre est refusé ;
- le prompt de base est reconstruit côté serveur à partir de ces identifiants, jamais repris de la requête ;
- les listes sont plafonnées à 20 éléments par catégorie et la réponse de Mistral à 400 tokens ;
- CORS n'autorise que le site et le développement local (ports 5173 et 3000).

CORS ne protège que des appels faits depuis un navigateur, et il n'y a pas de limitation de débit : un script peut toujours appeler l'API, mais seulement avec des tags. `/api/health` indique publiquement si la clé Mistral est configurée, sans jamais la renvoyer.

## Prérequis

- Node.js 20.19 ou plus, ou 22.12 ou plus (exigence de Vite 7).
- La [CLI Vercel](https://vercel.com/docs/cli) pour exécuter l'API en local.
- Une clé API Mistral ([console.mistral.ai](https://console.mistral.ai/)).

## Lancer en local

```bash
# API sur http://localhost:3000
vercel dev

# Interface sur http://localhost:5173, dans un autre terminal
cd frontend
npm install
npm run dev
```

La fonction lit la clé dans la variable `MISTRAL_API_KEY`. `vercel env pull` la récupère depuis le projet Vercel ; sinon, la placer dans un fichier `.env` à la racine du dépôt (ignoré par git).

L'interface appelle `http://localhost:3000` par défaut. Sans API joignable, le bouton de génération affiche « Impossible de contacter le serveur ».

Autres commandes, dans `frontend/` : `npm run build` (sortie dans `frontend/dist`), `npm run lint`, `npm run preview`.

## Déploiement

`vercel.json` décrit le build (`cd frontend && npm install && npm run build`, sortie `frontend/dist`) et le routage : `/api/*` vers les fonctions, tout le reste vers `index.html`. Deux variables d'environnement côté Vercel :

| Variable | Rôle |
| :-- | :-- |
| `MISTRAL_API_KEY` | Clé Mistral, lue par `api/generate-prompt.js`. |
| `VITE_API_URL` | Adresse de l'API, injectée dans le frontend au build. Sans elle, l'interface appelle `http://localhost:3000`. |

Après déploiement, `GET /api/health` renvoie `"mistral": "connected"` si la clé est présente.

## Limites

- Les épingles et les sélections ne sont pas conservées au rechargement de la page.
- La table d'incompatibilités ne couvre pas tout le catalogue : certaines règles visent des valeurs qui n'y figurent pas.
- Pas de tests automatisés ni d'intégration continue.

## Technologies

- **Interface** : React 19, Vite 7, Tailwind CSS 3, React Router 7, ESLint 9.
- **API** : fonctions serverless Vercel (Node.js, sans framework), Mistral (`mistral-small-latest`).

## Licence

MIT, voir [LICENSE](LICENSE).

## Auteur

François Menguy, [fmenguy.fr](https://fmenguy.fr).

---

<a id="english"></a>

# AI prompt generator (AIPrompt)

🇫🇷 [Français](#francais) · 🇬🇧 English

A web app that builds a prompt for image generation models (Stable Diffusion syntax) from tags picked with the mouse, then has Mistral rewrite it into a clean, well-ordered prompt. The negative prompt is computed in the browser, with no AI call.

Live at **[aiprompt.fmenguy.fr](https://aiprompt.fmenguy.fr)** (interface in French).

## Features

- **229 tags in 7 groups**: subject (age, gender, species), appearance, clothing, composition (pose, viewpoint), environment (location, time of day, lighting, weather), style (art medium) and quality.
- **Guided selection**: most categories take one tag at a time, and picking another replaces the previous one, with a warning when the two are declared incompatible. Hair style, accessories and quality accept several tags.
- **AI rewrite**: tags are sent to a serverless function that asks Mistral for an English prompt, ordered (subject, traits, appearance, clothing, pose, environment, style) and capped at 200 words. It starts with `1girl`, `1woman`, `1boy` or `1man` depending on the selected gender and age.
- **Negative prompt**: a fixed base (quality and anatomy defects) extended according to the selected tags, computed locally.
- **One-click copy** of the prompt and the negative prompt.
- **Random roll** (the "42" button): a full random combination. Pinned tags (📌) are kept.
- **Release notes** on the `/changelog` page.

## Architecture

```
prompt/
├── frontend/                   React app (Vite, Tailwind CSS)
│   ├── index.html
│   └── src/
│       ├── main.jsx                       routes / and /changelog
│       ├── App.jsx                        main screen (tags, pins, random roll, results)
│       ├── Changelog.jsx                  /changelog page
│       ├── data/prompts.js                tag catalogue
│       ├── utils/tagConflicts.js          incompatibility rules
│       ├── utils/negativePromptGenerator.js   negative prompt
│       └── services/promptGenerator.js    API call
├── api/                        Vercel serverless functions
│   ├── generate-prompt.js      prompt rewrite with Mistral
│   └── health.js               service status
├── backend/                    leftovers from an earlier version, unused
├── ordre                       text diagram of the generation flow
└── vercel.json                 frontend build and API routing
```

The frontend and the API are deployed together on Vercel. The Mistral key stays on the server: the browser only sends tag identifiers.

`api/generate-prompt.js` groups the tags by theme, works out the prefix (`1girl`, `1man`...), then calls `mistral-small-latest` (400 tokens max, temperature 0.7) and cleans up the reply (quotes, introductory phrases, doubled commas). To change the style of the generated prompts, edit the system prompt in that file.

## API security

`/api/generate-prompt` requires no authentication. To keep it to its intended use:

- it only accepts known tag categories whose values are short identifiers (`young_adult`, `t-shirt`); any free text is rejected;
- the base prompt is rebuilt server-side from those identifiers, never taken from the request;
- lists are capped at 20 items per category and Mistral's reply at 400 tokens;
- CORS only allows the site and local development (ports 5173 and 3000).

CORS only guards against browser calls, and there is no rate limiting: a script can still call the API, but only with tags. `/api/health` publicly reports whether the Mistral key is configured, without ever returning it.

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 7).
- The [Vercel CLI](https://vercel.com/docs/cli) to run the API locally.
- A Mistral API key ([console.mistral.ai](https://console.mistral.ai/)).

## Running locally

```bash
# API on http://localhost:3000
vercel dev

# UI on http://localhost:5173, in another terminal
cd frontend
npm install
npm run dev
```

The function reads the key from the `MISTRAL_API_KEY` variable. `vercel env pull` fetches it from the Vercel project; otherwise, put it in a `.env` file at the repository root (ignored by git).

The UI calls `http://localhost:3000` by default. If the API is unreachable, the generate button shows "Impossible de contacter le serveur" (cannot reach the server).

Other commands, in `frontend/`: `npm run build` (output in `frontend/dist`), `npm run lint`, `npm run preview`.

## Deployment

`vercel.json` defines the build (`cd frontend && npm install && npm run build`, output `frontend/dist`) and routing: `/api/*` goes to the functions, everything else to `index.html`. Two environment variables on Vercel:

| Variable | Purpose |
| :-- | :-- |
| `MISTRAL_API_KEY` | Mistral key, read by `api/generate-prompt.js`. |
| `VITE_API_URL` | API address, baked into the frontend at build time. Without it, the UI calls `http://localhost:3000`. |

Once deployed, `GET /api/health` returns `"mistral": "connected"` when the key is set.

## Limitations

- Pins and selections are not kept when the page reloads.
- The incompatibility table does not cover the whole catalogue: some rules target values that are not in it.
- No automated tests or CI.

## Tech stack

- **UI**: React 19, Vite 7, Tailwind CSS 3, React Router 7, ESLint 9.
- **API**: Vercel serverless functions (Node.js, no framework), Mistral (`mistral-small-latest`).

## License

MIT, see [LICENSE](LICENSE).

## Author

François Menguy, [fmenguy.fr](https://fmenguy.fr).
