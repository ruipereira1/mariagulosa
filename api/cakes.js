// API Route para bolos - Vercel
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Dados dos bolos (mesmo catálogo do sistema original)
      const cakes = [
        {
          id: 1,
          name: "Bolo de Chocolate",
          description: "Delicioso bolo de chocolate com cobertura cremosa",
          price: "€ 25,00",
          image: "/cake-chocolate.jpg",
          category: "chocolate",
          available: true
        },
        {
          id: 2,
          name: "Bolo de Morango",
          description: "Bolo fofo com morangos frescos e chantilly",
          price: "€ 28,00",
          image: "/cake-strawberry.jpg",
          category: "frutas",
          available: true
        },
        {
          id: 3,
          name: "Bolo de Cenoura",
          description: "Tradicional bolo de cenoura com cobertura de chocolate",
          price: "€ 22,00",
          image: "/cake-carrot.jpg",
          category: "tradicional",
          available: true
        },
        {
          id: 4,
          name: "Bolo Red Velvet",
          description: "Elegante bolo red velvet com cream cheese",
          price: "€ 32,00",
          image: "/cake-red-velvet.jpg",
          category: "especial",
          available: true
        },
        {
          id: 5,
          name: "Bolo de Limão",
          description: "Refrescante bolo de limão com cobertura cítrica",
          price: "€ 26,00",
          image: "/cake-lemon.jpg",
          category: "frutas",
          available: true
        },
        {
          id: 6,
          name: "Bolo de Coco",
          description: "Tropical bolo de coco com flocos naturais",
          price: "€ 24,00",
          image: "/cake-coconut.jpg",
          category: "tropical",
          available: true
        }
      ];

      return res.status(200).json({
        success: true,
        cakes,
        total: cakes.length
      });

    } catch (error) {
      console.error('Erro ao buscar bolos:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Método não permitido
  return res.status(405).json({
    success: false,
    error: 'Método não permitido'
  });
} 