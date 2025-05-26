// API Route para estatísticas - Vercel + Firebase
import { db } from '../lib/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

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

  // Log da requisição
  console.log(`📊 Stats API - ${req.method} ${req.url}`);

  if (req.method === 'GET') {
    try {
      // Verificar se o Firebase está disponível
      if (!db) {
        console.warn('⚠️ Firebase not available, returning mock data');
        return res.status(200).json({
          success: true,
          stats: getMockStats(),
          generatedAt: new Date().toISOString(),
          source: 'mock'
        });
      }

      // Buscar estatísticas reais do Firebase
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Buscar todos os pedidos
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      
      // Buscar pedidos de hoje
      const todayOrdersQuery = query(
        ordersRef, 
        where('createdAt', '>=', startOfDay.toISOString())
      );
      const todayOrdersSnapshot = await getDocs(todayOrdersQuery);
      
      // Calcular estatísticas
      let totalRevenue = 0;
      let todayRevenue = 0;
      const statusBreakdown = {};
      const popularCakes = {};
      
      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        totalRevenue += order.totalPrice || 0;
        
        // Contar status
        const status = order.status || 'pendente';
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
        
        // Contar bolos populares
        if (order.items) {
          order.items.forEach(item => {
            const cakeName = item.cakeName;
            popularCakes[cakeName] = (popularCakes[cakeName] || 0) + item.quantity;
          });
        }
      });
      
      todayOrdersSnapshot.forEach((doc) => {
        const order = doc.data();
        todayRevenue += order.totalPrice || 0;
      });
      
      // Converter para formato esperado
      const statusBreakdownArray = Object.entries(statusBreakdown).map(([status, count]) => ({
        _id: status,
        count
      }));
      
      const popularCakesArray = Object.entries(popularCakes)
        .map(([name, orders]) => ({ name, orders }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 6);
      
      const stats = {
        totalOrders: ordersSnapshot.size,
        todayOrders: todayOrdersSnapshot.size,
        totalRevenue: totalRevenue,
        todayRevenue: todayRevenue,
        totalCakes: 6, // Número fixo de bolos no catálogo
        statusBreakdown: statusBreakdownArray,
        popularCakes: popularCakesArray,
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

      return res.status(200).json({
        success: true,
        stats,
        generatedAt: new Date().toISOString(),
        source: 'firebase'
      });

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      console.error('Stack trace:', error.stack);
      
      // Retornar dados mock em caso de erro
      return res.status(200).json({
        success: true,
        stats: getMockStats(),
        generatedAt: new Date().toISOString(),
        source: 'mock',
        error: 'Firebase temporarily unavailable',
        errorDetails: error.message
      });
    }
  }

  // Método não permitido
  return res.status(405).json({
    success: false,
    error: 'Método não permitido'
  });
}

// Função para retornar dados mock
function getMockStats() {
  return {
    totalOrders: 42,
    todayOrders: 8,
    totalRevenue: 2450.00,
    todayRevenue: 320.00,
    totalCakes: 6,
    statusBreakdown: [
      { _id: 'pendente', count: 5 },
      { _id: 'confirmado', count: 12 },
      { _id: 'em_preparo', count: 8 },
      { _id: 'pronto', count: 3 },
      { _id: 'entregue', count: 14 }
    ],
    popularCakes: [
      { name: 'Bolo de Chocolate', orders: 15 },
      { name: 'Bolo de Morango', orders: 12 },
      { name: 'Bolo de Cenoura', orders: 8 },
      { name: 'Bolo Red Velvet', orders: 6 },
      { name: 'Bolo de Limão', orders: 4 },
      { name: 'Bolo de Coco', orders: 3 }
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
} 