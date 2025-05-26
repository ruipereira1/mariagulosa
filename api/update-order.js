// API Route para atualizar pedidos - Vercel + Firebase
import { db } from '../lib/firebase.js';
import { collection, doc, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      // Verificar se o Firebase está disponível
      if (!db) {
        console.warn('⚠️ Firebase not available');
        return res.status(503).json({
          success: false,
          error: 'Serviço temporariamente indisponível'
        });
      }

      const { orderNumber, status, notes } = req.body;

      // Validar dados
      if (!orderNumber || !status) {
        return res.status(400).json({
          success: false,
          error: 'Número do pedido e status são obrigatórios'
        });
      }

      // Validar status permitidos
      const allowedStatuses = ['pendente', 'confirmado', 'em_preparo', 'pronto', 'entregue', 'cancelado'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status inválido'
        });
      }

      // Buscar pedido pelo orderNumber
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderNumber', '==', orderNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      // Pegar o primeiro documento (orderNumber deve ser único)
      const orderDoc = querySnapshot.docs[0];
      const orderRef = doc(db, 'orders', orderDoc.id);

      // Atualizar o pedido
      const updateData = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (notes) {
        updateData.adminNotes = notes;
      }

      await updateDoc(orderRef, updateData);

      // Buscar dados atualizados
      const updatedDoc = await getDoc(orderRef);
      const updatedOrder = {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };

      console.log(`📋 Pedido ${orderNumber} atualizado para: ${status}`);

      return res.status(200).json({
        success: true,
        order: updatedOrder,
        message: `Pedido ${orderNumber} atualizado para ${status}`
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar pedido:', error);
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