// API Route para gerenciar bolos - Vercel + Firebase
import { db } from '../lib/firebase.js';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Listar todos os bolos
  if (req.method === 'GET') {
    try {
      const cakesRef = collection(db, 'cakes');
      const snapshot = await getDocs(cakesRef);
      
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
        total: cakes.length
      });

    } catch (error) {
      console.error('❌ Erro ao buscar bolos:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // POST - Adicionar novo bolo
  if (req.method === 'POST') {
    try {
      const { name, price, description, image, category, available } = req.body;

      // Validar dados obrigatórios
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          error: 'Nome e preço são obrigatórios'
        });
      }

      // Criar objeto do bolo
      const cake = {
        name: name.trim(),
        price: parseFloat(price),
        description: description?.trim() || '',
        image: image || '/images/default-cake.jpg',
        category: category || 'bolos',
        available: available !== false, // Default true
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Salvar no Firebase
      const cakesRef = collection(db, 'cakes');
      const docRef = await addDoc(cakesRef, cake);

      console.log('🎂 Novo bolo adicionado:', name);

      return res.status(201).json({
        success: true,
        cake: {
          id: docRef.id,
          ...cake
        },
        message: 'Bolo adicionado com sucesso!'
      });

    } catch (error) {
      console.error('❌ Erro ao adicionar bolo:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  }

  // PUT - Atualizar bolo existente
  if (req.method === 'PUT') {
    try {
      const { id, name, price, description, image, category, available } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do bolo é obrigatório'
        });
      }

      // Verificar se o bolo existe
      const cakeRef = doc(db, 'cakes', id);
      const cakeDoc = await getDoc(cakeRef);

      if (!cakeDoc.exists()) {
        return res.status(404).json({
          success: false,
          error: 'Bolo não encontrado'
        });
      }

      // Preparar dados para atualização
      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (name) updateData.name = name.trim();
      if (price !== undefined) updateData.price = parseFloat(price);
      if (description !== undefined) updateData.description = description.trim();
      if (image) updateData.image = image;
      if (category) updateData.category = category;
      if (available !== undefined) updateData.available = available;

      // Atualizar no Firebase
      await updateDoc(cakeRef, updateData);

      // Buscar dados atualizados
      const updatedDoc = await getDoc(cakeRef);
      const updatedCake = {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };

      console.log('🎂 Bolo atualizado:', name || updatedCake.name);

      return res.status(200).json({
        success: true,
        cake: updatedCake,
        message: 'Bolo atualizado com sucesso!'
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar bolo:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: error.message
      });
    }
  }

  // DELETE - Remover bolo
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID do bolo é obrigatório'
        });
      }

      // Verificar se o bolo existe
      const cakeRef = doc(db, 'cakes', id);
      const cakeDoc = await getDoc(cakeRef);

      if (!cakeDoc.exists()) {
        return res.status(404).json({
          success: false,
          error: 'Bolo não encontrado'
        });
      }

      const cakeData = cakeDoc.data();

      // Remover do Firebase
      await deleteDoc(cakeRef);

      console.log('🗑️ Bolo removido:', cakeData.name);

      return res.status(200).json({
        success: true,
        message: `Bolo "${cakeData.name}" removido com sucesso!`
      });

    } catch (error) {
      console.error('❌ Erro ao remover bolo:', error);
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