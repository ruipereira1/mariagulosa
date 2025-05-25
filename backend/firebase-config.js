import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs",
  authDomain: "maria-gulosa-b460f.firebaseapp.com",
  projectId: "maria-gulosa-b460f",
  storageBucket: "maria-gulosa-b460f.firebasestorage.app",
  messagingSenderId: "373372889835",
  appId: "1:373372889835:web:0577d99b04c94e75112cae"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Função para gerar número de pedido único
const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const time = Date.now().toString().slice(-6)
  return `MG${year}${month}${day}${time}`
}

// Dados iniciais dos bolos
const seedCakes = [
  {
    name: "Bolo de Chocolate Especial",
    description: "Delicioso bolo de chocolate com cobertura cremosa e raspas de chocolate",
    price: 25.00,
    category: 'chocolate',
    rating: 5,
    available: true,
    createdAt: new Date()
  },
  {
    name: "Bolo de Morango",
    description: "Bolo fofinho com morangos frescos e chantilly",
    price: 23.00,
    category: 'frutas',
    rating: 5,
    available: true,
    createdAt: new Date()
  },
  {
    name: "Bolo de Cenoura",
    description: "Tradicional bolo de cenoura com cobertura de chocolate",
    price: 21.00,
    category: 'tradicionais',
    rating: 4,
    available: true,
    createdAt: new Date()
  },
  {
    name: "Bolo Red Velvet",
    description: "Bolo aveludado vermelho com cream cheese",
    price: 27.00,
    category: 'especiais',
    rating: 5,
    available: true,
    createdAt: new Date()
  },
  {
    name: "Bolo de Limão",
    description: "Bolo cítrico refrescante com cobertura de limão",
    price: 22.00,
    category: 'frutas',
    rating: 4,
    available: true,
    createdAt: new Date()
  },
  {
    name: "Bolo de Coco",
    description: "Bolo tropical com coco ralado e leite condensado",
    price: 24.00,
    category: 'tradicionais',
    rating: 5,
    available: true,
    createdAt: new Date()
  }
]

// Funções para Bolos
export const getCakes = async () => {
  try {
    const cakesRef = collection(db, 'cakes')
    const q = query(cakesRef, where('available', '==', true))
    const querySnapshot = await getDocs(q)
    
    const cakes = []
    querySnapshot.forEach((doc) => {
      cakes.push({ id: doc.id, ...doc.data() })
    })
    
    return cakes
  } catch (error) {
    console.error('Erro ao buscar bolos:', error)
    throw error
  }
}

export const addCake = async (cakeData) => {
  try {
    const cakesRef = collection(db, 'cakes')
    const docRef = await addDoc(cakesRef, {
      ...cakeData,
      available: true,
      createdAt: new Date()
    })
    return { id: docRef.id, ...cakeData }
  } catch (error) {
    console.error('Erro ao adicionar bolo:', error)
    throw error
  }
}

// Funções para Pedidos
export const getOrders = async (filters = {}) => {
  try {
    const ordersRef = collection(db, 'orders')
    let q = query(ordersRef, orderBy('createdAt', 'desc'))
    
    if (filters.status) {
      q = query(ordersRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'))
    }
    
    if (filters.limit) {
      q = query(q, limit(parseInt(filters.limit)))
    }
    
    const querySnapshot = await getDocs(q)
    
    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() })
    })
    
    return orders
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    throw error
  }
}

export const addOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, 'orders')
    const orderNumber = generateOrderNumber()
    
    const order = {
      orderNumber,
      ...orderData,
      status: 'pendente',
      paymentStatus: 'pendente',
      whatsappSent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const docRef = await addDoc(ordersRef, order)
    return { id: docRef.id, ...order }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    throw error
  }
}

export const updateOrder = async (orderId, updateData) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      ...updateData,
      updatedAt: new Date()
    })
    return { id: orderId, ...updateData }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    throw error
  }
}

// Função para obter estatísticas
export const getStats = async () => {
  try {
    // Buscar todos os bolos
    const cakes = await getCakes()
    
    // Buscar todos os pedidos
    const orders = await getOrders()
    
    // Calcular estatísticas
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    const pendingOrders = orders.filter(order => order.status === 'pendente').length
    const completedOrders = orders.filter(order => order.status === 'entregue').length
    
    return {
      totalCakes: cakes.length,
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
      pendingOrders,
      completedOrders,
      recentOrders: orders.slice(0, 5)
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    throw error
  }
}

// Função para inicializar dados (executar uma vez)
export const initializeFirebaseData = async () => {
  try {
    console.log('🔥 Inicializando dados no Firebase...')
    
    // Verificar se já existem bolos
    const existingCakes = await getCakes()
    
    if (existingCakes.length === 0) {
      console.log('➕ Inserindo bolos iniciais...')
      
      for (const cake of seedCakes) {
        await addCake(cake)
      }
      
      console.log('✅ Bolos inseridos com sucesso!')
    } else {
      console.log(`🎂 ${existingCakes.length} bolos já existem no Firebase`)
    }
    
    // Verificar se já existem pedidos
    const existingOrders = await getOrders()
    
    if (existingOrders.length === 0) {
      console.log('➕ Criando pedido de exemplo...')
      
      const sampleOrder = {
        items: [{
          cakeName: "Bolo de Chocolate Especial",
          quantity: 1,
          unitPrice: 25.00,
          subtotal: 25.00
        }],
        totalPrice: 25.00,
        totalItems: 1,
        customerInfo: {
          name: "Ana Silva",
          phone: "914019142",
          email: "ana@email.com"
        },
        whatsappMessage: "🎂 *ENCOMENDA MARIA GULOSA* 🎂\n\n📋 *Pedido de exemplo*\n\n🍰 *Bolos escolhidos:*\n• Bolo de Chocolate Especial (1x) - € 25,00\n\n💰 *Total: € 25,00*\n\n📞 Confirme sua encomenda respondendo esta mensagem!\n\n🏪 *Maria Gulosa - Sabores que encantam* ✨"
      }
      
      const order = await addOrder(sampleOrder)
      console.log(`✅ Pedido ${order.orderNumber} criado!`)
    } else {
      console.log(`📋 ${existingOrders.length} pedidos já existem no Firebase`)
    }
    
    // Mostrar estatísticas
    const stats = await getStats()
    console.log('\n📊 ESTATÍSTICAS DO FIREBASE:')
    console.log('============================')
    console.log(`🎂 Bolos: ${stats.totalCakes}`)
    console.log(`📋 Pedidos: ${stats.totalOrders}`)
    console.log(`💰 Receita: € ${stats.totalRevenue}`)
    
    return true
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error)
    return false
  }
}

export { db, generateOrderNumber } 