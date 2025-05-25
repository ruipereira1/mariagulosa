// Script para popular a base de dados com bolos iniciais
import { db } from '../lib/firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const initialCakes = [
  {
    name: "Bolo de Chocolate",
    price: 25.00,
    description: "Delicioso bolo de chocolate com cobertura cremosa",
    image: "/images/bolo-chocolate.jpg",
    category: "bolos",
    available: true
  },
  {
    name: "Bolo de Morango",
    price: 28.00,
    description: "Bolo fofo com morangos frescos e chantilly",
    image: "/images/bolo-morango.jpg",
    category: "bolos",
    available: true
  },
  {
    name: "Bolo de Cenoura",
    price: 22.00,
    description: "Tradicional bolo de cenoura com cobertura de chocolate",
    image: "/images/bolo-cenoura.jpg",
    category: "bolos",
    available: true
  },
  {
    name: "Bolo Red Velvet",
    price: 32.00,
    description: "Elegante bolo red velvet com cream cheese",
    image: "/images/bolo-red-velvet.jpg",
    category: "bolos",
    available: true
  },
  {
    name: "Bolo de Limão",
    price: 24.00,
    description: "Refrescante bolo de limão com cobertura cítrica",
    image: "/images/bolo-limao.jpg",
    category: "bolos",
    available: true
  },
  {
    name: "Bolo de Coco",
    price: 26.00,
    description: "Bolo tropical de coco com flocos naturais",
    image: "/images/bolo-coco.jpg",
    category: "bolos",
    available: true
  }
];

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Verificar se já existem bolos
      const cakesRef = collection(db, 'cakes');
      const existingCakes = await getDocs(cakesRef);

      if (existingCakes.size > 0) {
        return res.status(200).json({
          success: true,
          message: `Base de dados já contém ${existingCakes.size} bolos`,
          existing: existingCakes.size
        });
      }

      // Adicionar bolos iniciais
      const addedCakes = [];
      
      for (const cake of initialCakes) {
        const cakeData = {
          ...cake,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(cakesRef, cakeData);
        addedCakes.push({
          id: docRef.id,
          ...cakeData
        });
        
        console.log(`🎂 Bolo adicionado: ${cake.name}`);
      }

      return res.status(200).json({
        success: true,
        message: `${addedCakes.length} bolos adicionados com sucesso!`,
        cakes: addedCakes
      });

    } catch (error) {
      console.error('❌ Erro ao popular base de dados:', error);
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