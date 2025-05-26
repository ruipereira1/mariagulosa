// API Route para reset das encomendas - Vercel + Firebase
import { db } from '../lib/firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido'
    });
  }

  // Verificar se o Firebase está disponível
  if (!db) {
    console.warn('⚠️ Firebase not available');
    return res.status(503).json({
      success: false,
      error: 'Serviço temporariamente indisponível'
    });
  }

  try {
    // Verificar autenticação (opcional - adicionar validação de admin)
    const { adminKey } = req.body;
    
    // Validação simples - em produção, use JWT ou OAuth
    if (adminKey !== 'maria-reset-2024') {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado'
      });
    }

    console.log('🗑️ Iniciando reset das encomendas...');

    // Buscar todas as encomendas
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    
    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'Nenhuma encomenda encontrada para remover',
        deletedCount: 0
      });
    }

    // Contar encomendas antes da remoção
    const totalOrders = snapshot.size;
    
    // Remover todas as encomendas
    const deletePromises = [];
    snapshot.forEach((orderDoc) => {
      deletePromises.push(deleteDoc(doc(db, 'orders', orderDoc.id)));
    });

    // Executar todas as remoções
    await Promise.all(deletePromises);

    console.log(`✅ Reset concluído: ${totalOrders} encomendas removidas`);

    return res.status(200).json({
      success: true,
      message: `Reset concluído com sucesso! ${totalOrders} encomendas foram removidas.`,
      deletedCount: totalOrders,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao fazer reset das encomendas:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
} 