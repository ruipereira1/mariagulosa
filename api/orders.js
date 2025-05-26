// API Route para pedidos - Vercel + Firebase
import { db } from '../lib/firebase.js';
import { collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Verificar se o Firebase está disponível
      if (!db) {
        console.warn('⚠️ Firebase not available');
        return res.status(503).json({
          success: false,
          error: 'Serviço temporariamente indisponível'
        });
      }

      const orderData = req.body;

      // Validar dados básicos
      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Itens do pedido são obrigatórios'
        });
      }

      // Gerar número do pedido único
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-5);
      const orderNumber = `MG${year}${month}${day}${timestamp}`;

      // Calcular totais
      const totalItems = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = orderData.items.reduce((sum, item) => {
        const price = parseFloat(item.unitPrice || item.price?.replace(/[€\s]/g, '').replace(',', '.') || 0);
        return sum + (price * item.quantity);
      }, 0);

      // Criar objeto do pedido
      const order = {
        orderNumber,
        items: orderData.items.map(item => ({
          cakeName: item.cakeName || item.name,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice || item.price?.replace(/[€\s]/g, '').replace(',', '.') || 0),
          subtotal: parseFloat(item.unitPrice || item.price?.replace(/[€\s]/g, '').replace(',', '.') || 0) * item.quantity
        })),
        totalItems,
        totalPrice,
        customerInfo: {
          phone: orderData.customerInfo?.phone || "351914019142",
          name: orderData.customerInfo?.name || "Cliente",
          email: orderData.customerInfo?.email || ""
        },
        whatsappMessage: orderData.whatsappMessage || "",
        notes: orderData.notes || "Pedido feito através do site",
        status: 'pendente',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      // Salvar no Firebase
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, order);
      
      console.log('📦 Novo pedido criado:', orderNumber);
      console.log('🛒 Itens:', order.items);
      console.log('💰 Total:', `€ ${totalPrice.toFixed(2)}`);
      console.log('🔥 Salvo no Firebase:', docRef.id);

      return res.status(200).json({
        success: true,
        order: {
          id: docRef.id,
          ...order
        },
        message: 'Pedido criado com sucesso!'
      });

    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  }

  if (req.method === 'GET') {
    try {
      // Verificar se o Firebase está disponível
      if (!db) {
        console.warn('⚠️ Firebase not available, returning empty orders');
        return res.status(200).json({
          success: true,
          orders: [],
          total: 0,
          source: 'mock'
        });
      }

      // Buscar pedidos do Firebase
      const { limit: limitParam = 10 } = req.query;
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(parseInt(limitParam)));
      const snapshot = await getDocs(q);
      
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return res.status(200).json({
        success: true,
        orders,
        total: orders.length,
        source: 'firebase'
      });

    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error);
      return res.status(200).json({
        success: true,
        orders: [],
        total: 0,
        source: 'mock',
        error: 'Firebase temporarily unavailable'
      });
    }
  }

  // Método não permitido
  return res.status(405).json({
    success: false,
    error: 'Método não permitido'
  });
} 