// backend/middleware/auth.js

export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Clé API manquante',
      message: 'Ajoutez le header x-api-key'
    });
  }

  const validKey = process.env.API_KEY || 'sk_prod_d844037cde814fecb36a0813208819a0';
  
  if (apiKey !== validKey) {
    return res.status(403).json({ 
      error: 'Clé API invalide',
      message: 'La clé fournie n\'est pas autorisée'
    });
  }

  next();
}
