export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const hfStatus = process.env.HF_TOKEN ? 'connected' : 'missing';

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    huggingface: hfStatus
  });
}
