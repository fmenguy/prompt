export function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;

  // Vérifier que la variable d'environnement existe
  if (!validKey) {
    console.error('❌ API_KEY non configurée dans .env');
    return res.status(500).json({ 
      error: 'Configuration serveur invalide' 
    });
  }

  // Vérifier que la clé est fournie
  if (!apiKey) {
    console.warn('⚠️ Tentative d\'accès sans clé API');
    return res.status(401).json({ 
      error: 'API key manquante' 
    });
  }

  // Vérifier que la clé est valide
  if (apiKey !== validKey) {
    console.warn('⚠️ Tentative d\'accès avec clé invalide:', apiKey.substring(0, 10) + '...');
    return res.status(403).json({ 
      error: 'API key invalide' 
    });
  }

  console.log('✅ Authentification réussie');
  next();
}
