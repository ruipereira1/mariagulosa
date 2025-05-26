// API Route para bolos - Vercel + Firebase
import { db } from './_firebase.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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

  if (req.method === 'GET') {
    try {
      // Verificar se o Firebase está disponível
      if (!db) {
        console.warn('⚠️ Firebase not available, returning default cakes');
        return res.status(200).json({
          success: true,
          cakes: getDefaultCakes(),
          total: getDefaultCakes().length,
          source: 'default'
        });
      }

      // Buscar bolos do Firebase
      const cakesRef = collection(db, 'cakes');
      const snapshot = await getDocs(cakesRef);
      
      if (snapshot.empty) {
        // Se não há bolos no Firebase, retornar catálogo padrão
        return res.status(200).json({
          success: true,
          cakes: getDefaultCakes(),
          total: getDefaultCakes().length,
          source: 'default'
        });
      }

      // Converter dados do Firebase
      const cakes = [];
      snapshot.forEach((doc) => {
        cakes.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return res.status(200).json({
        success: true,
        cakes,
        total: cakes.length,
        source: 'firebase'
      });

    } catch (error) {
      console.error('❌ Erro ao buscar bolos:', error);
      // Retornar catálogo padrão em caso de erro
      return res.status(200).json({
        success: true,
        cakes: getDefaultCakes(),
        total: getDefaultCakes().length,
        source: 'default',
        error: 'Firebase temporarily unavailable'
      });
    }
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

      const cakeData = req.body;

      // Validar dados básicos
      if (!cakeData.name || !cakeData.price) {
        return res.status(400).json({
          success: false,
          error: 'Nome e preço são obrigatórios'
        });
      }

      // Adicionar ao Firebase
      const cakesRef = collection(db, 'cakes');
      const docRef = await addDoc(cakesRef, {
        ...cakeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return res.status(201).json({
        success: true,
        cake: {
          id: docRef.id,
          ...cakeData
        },
        message: 'Bolo criado com sucesso!'
      });

    } catch (error) {
      console.error('❌ Erro ao criar bolo:', error);
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

// Função para retornar catálogo padrão
function getDefaultCakes() {
  return [
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
} 