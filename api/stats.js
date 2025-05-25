// API Route para estatísticas - Vercel
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Simular estatísticas para o painel admin
      // Em produção, estes dados viriam do banco de dados
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Dados mock para demonstração
      const stats = {
        totalOrders: 15,
        todayOrders: 3,
        totalRevenue: 425.50,
        todayRevenue: 79.00,
        totalCakes: 6,
        statusBreakdown: [
          { _id: 'pendente', count: 2 },
          { _id: 'confirmado', count: 1 },
          { _id: 'pronto', count: 0 },
          { _id: 'entregue', count: 12 }
        ],
        popularCakes: [
          { name: 'Bolo de Chocolate', orders: 8 },
          { name: 'Bolo de Morango', orders: 6 },
          { name: 'Bolo Red Velvet', orders: 4 },
          { name: 'Bolo de Cenoura', orders: 3 },
          { name: 'Bolo de Limão', orders: 2 },
          { name: 'Bolo de Coco', orders: 2 }
        ],
        recentActivity: [
          {
            type: 'new_order',
            message: 'Novo pedido #MG2412251234',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            type: 'order_confirmed',
            message: 'Pedido #MG2412251233 confirmado',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            type: 'order_delivered',
            message: 'Pedido #MG2412251232 entregue',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          }
        ]
      };

      // TODO: Integrar com banco de dados real
      // if (process.env.FIREBASE_PROJECT_ID) {
      //   stats = await getStatsFromFirebase();
      // } else if (process.env.MONGODB_URI) {
      //   stats = await getStatsFromMongoDB();
      // }

      return res.status(200).json({
        success: true,
        stats,
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  }

  // Método não permitido
  return res.status(405).json({
    success: false,
    error: 'Método não permitido'
  });
} 