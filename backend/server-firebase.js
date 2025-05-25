import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getCakes, addCake, getOrders, addOrder, updateOrder, getStats, initializeFirebaseData } from './firebase-config.js'

// Configuração
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Inicializar Firebase
const initializeFirebase = async () => {
  try {
    console.log('🔥 Conectando ao Firebase...')
    await initializeFirebaseData()
    console.log('✅ Firebase configurado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao conectar com Firebase:', error.message)
    console.log('⚠️  Verifique sua configuração do Firebase')
  }
}

// Rotas da API

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: '🎂 API da Maria Gulosa funcionando com Firebase!',
    version: '2.0.0',
    database: 'Firebase Firestore',
    endpoints: {
      cakes: '/api/cakes',
      orders: '/api/orders',
      stats: '/api/stats'
    }
  })
})

// Rotas dos Bolos
app.get('/api/cakes', async (req, res) => {
  try {
    const cakes = await getCakes()
    res.json(cakes)
  } catch (error) {
    console.error('Erro ao buscar bolos:', error)
    res.status(500).json({ error: 'Erro ao buscar bolos' })
  }
})

app.post('/api/cakes', async (req, res) => {
  try {
    const cake = await addCake(req.body)
    res.status(201).json(cake)
  } catch (error) {
    console.error('Erro ao criar bolo:', error)
    res.status(400).json({ error: 'Erro ao criar bolo' })
  }
})

// Rotas dos Pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query
    
    const filters = {}
    if (status) filters.status = status
    if (limit) filters.limit = limit
    
    const orders = await getOrders(filters)
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length
      }
    })
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    res.status(500).json({ error: 'Erro ao buscar pedidos' })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { items, customerInfo, notes } = req.body
    
    // Validar dados obrigatórios
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items são obrigatórios' })
    }
    
    // Calcular totais
    const totalPrice = items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    
    // Gerar mensagem do WhatsApp
    const itemsText = items.map(item => 
      `• ${item.cakeName} (${item.quantity}x) - € ${item.subtotal.toFixed(2)}`
    ).join('\n')
    
    const whatsappMessage = `🎂 *ENCOMENDA MARIA GULOSA* 🎂\n\n📋 *Pedido:* {orderNumber}\n\n🍰 *Bolos escolhidos:*\n${itemsText}\n\n💰 *Total: € ${totalPrice.toFixed(2)}*\n\n📞 Confirme sua encomenda respondendo esta mensagem!\n\n🏪 *Maria Gulosa - Sabores que encantam* ✨`
    
    const orderData = {
      items,
      totalPrice,
      totalItems,
      customerInfo: customerInfo || {},
      notes: notes || '',
      whatsappMessage
    }
    
    const order = await addOrder(orderData)
    
    // Substituir {orderNumber} na mensagem
    const finalWhatsappMessage = whatsappMessage.replace('{orderNumber}', order.orderNumber)
    await updateOrder(order.id, { whatsappMessage: finalWhatsappMessage })
    
    res.status(201).json({
      ...order,
      whatsappMessage: finalWhatsappMessage
    })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    res.status(400).json({ error: 'Erro ao criar pedido' })
  }
})

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    const updatedOrder = await updateOrder(id, updateData)
    res.json(updatedOrder)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    res.status(400).json({ error: 'Erro ao atualizar pedido' })
  }
})

// Rota de estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats()
    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
})

// Rota para admin (login simples)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  
  const adminUsername = process.env.ADMIN_USERNAME || 'maria'
  const adminPassword = process.env.ADMIN_PASSWORD || 'gulosa123'
  
  if (username === adminUsername && password === adminPassword) {
    res.json({ 
      success: true, 
      message: 'Login realizado com sucesso',
      user: { username: adminUsername, role: 'admin' }
    })
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Credenciais inválidas' 
    })
  }
})

// Rota para testar WhatsApp
app.post('/api/whatsapp/test', (req, res) => {
  const { phone, message } = req.body
  
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '351914019142'
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
  
  res.json({
    success: true,
    whatsappUrl,
    message: 'URL do WhatsApp gerada com sucesso'
  })
})

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro na aplicação:', error)
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: error.message 
  })
})

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    availableRoutes: [
      'GET /',
      'GET /api/cakes',
      'POST /api/cakes',
      'GET /api/orders',
      'POST /api/orders',
      'PUT /api/orders/:id',
      'GET /api/stats',
      'POST /api/admin/login',
      'POST /api/whatsapp/test'
    ]
  })
})

// Inicializar servidor
const startServer = async () => {
  try {
    await initializeFirebase()
    
    app.listen(PORT, () => {
      console.log('\n🎉 SERVIDOR MARIA GULOSA INICIADO!')
      console.log('===================================')
      console.log(`🌐 Servidor rodando em: http://localhost:${PORT}`)
      console.log(`🔥 Banco de dados: Firebase Firestore`)
      console.log(`📱 WhatsApp: +${process.env.WHATSAPP_NUMBER || '351914019142'}`)
      console.log(`👤 Admin: ${process.env.ADMIN_USERNAME || 'maria'}`)
      console.log('')
      console.log('📋 ENDPOINTS DISPONÍVEIS:')
      console.log(`   🏠 Home: http://localhost:${PORT}`)
      console.log(`   🎂 Bolos: http://localhost:${PORT}/api/cakes`)
      console.log(`   📦 Pedidos: http://localhost:${PORT}/api/orders`)
      console.log(`   📊 Stats: http://localhost:${PORT}/api/stats`)
      console.log('')
      console.log('🚀 Sistema pronto para receber pedidos!')
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

// Tratamento de sinais para encerramento gracioso
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor Maria Gulosa...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Encerrando servidor Maria Gulosa...')
  process.exit(0)
})

// Iniciar servidor
startServer() 