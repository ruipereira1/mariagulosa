// API Route de teste - Vercel
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`🧪 Test API - ${req.method} ${req.url}`);

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API funcionando corretamente!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      url: req.url,
      headers: req.headers
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Método não permitido'
  });
} 