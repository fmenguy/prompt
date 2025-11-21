# 🎨 Générateur de Prompt IA

Application complète pour créer des prompts professionnels pour la génération d'images IA.

## 📦 Structure du projet

prompt/
├── frontend/    # Application React + Vite
└── backend/     # API Node.js + Express


## 🚀 Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurer HF_TOKEN
npm run dev
```


### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs de développement

* **Frontend** : [http://localhost:5173](http://localhost:5173)
* **Backend API** : [http://localhost:3001](http://localhost:3001)

## 📚 Documentation

* [Frontend README](./frontend/README.md)
* [Backend README](./backend/README.md)

## 👤 Auteur

**François Menguy**
🌐 [fmenguy.fr](https://fmenguy.fr)

## 📄 Licence

MIT

## Technologies

* React 18
* Vite
* Tailwind CSS
* Lucide React (icônes)

## Endpoints

* `GET /api/health` - Health check
* `POST /api/generate-prompt` - Génération de prompt

## Technologies

* Node.js
* Express
* Hugging Face API
