import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Configuração
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Conexão com MongoDB
const connectDB = async () => {
  try {
    // Usar MongoDB local se não houver URI configurada
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maria-gulosa'
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB conectado com sucesso!')
    console.log(`📍 Conectado em: ${mongoURI}`)
    
    // Inicializar dados se necessário
    await initializeData()
    
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message)
    console.log('⚠️  Continuando sem banco de dados (modo demo)')
  }
}

// Função para inicializar dados
const initializeData = async () => {
  try {
    const cakeCount = await Cake.countDocuments()
    if (cakeCount === 0) {
      await Cake.insertMany(seedCakes)
      console.log('🎂 Dados iniciais dos bolos inseridos!')
    }
  } catch (error) {
    console.log('⚠️  Erro ao inicializar dados:', error.message)
  }
}

// Modelos (Schemas)
const CakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 5 },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  items: [{
    cakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake' },
    cakeName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  customerInfo: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  status: { 
    type: String, 
    enum: ['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado'], 
    default: 'pendente' 
  },
  paymentStatus: {
    type: String,
    enum: ['pendente', 'pago', 'cancelado'],
    default: 'pendente'
  },
  deliveryDate: { type: Date },
  deliveryAddress: { type: String },
  notes: { type: String },
  whatsappSent: { type: Boolean, default: false },
  whatsappMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Cake = mongoose.model('Cake', CakeSchema)
const Order = mongoose.model('Order', OrderSchema)

// Função para gerar número de pedido único
const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const time = Date.now().toString().slice(-6)
  return `MG${year}${month}${day}${time}`
}

// Dados iniciais (seed)
const seedCakes = [
  {
    name: "Bolo de Chocolate Especial",
    description: "Delicioso bolo de chocolate com cobertura cremosa e raspas de chocolate",
    price: 25.00,
    category: 'chocolate',
    rating: 5
  },
  {
    name: "Bolo de Morango",
    description: "Bolo fofinho com morangos frescos e chantilly",
    price: 23.00,
    category: 'frutas',
    rating: 5
  },
  {
    name: "Bolo de Cenoura",
    description: "Tradicional bolo de cenoura com cobertura de chocolate",
    price: 21.00,
    category: 'tradicionais',
    rating: 4
  },
  {
    name: "Bolo Red Velvet",
    description: "Bolo aveludado vermelho com cream cheese",
    price: 27.00,
    category: 'especiais',
    rating: 5
  }
]

// Rotas da API

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: '🎂 API da Maria Gulosa funcionando!',
    version: '1.0.0',
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
    if (mongoose.connection.readyState === 1) {
      const cakes = await Cake.find({ available: true })
      res.json(cakes)
    } else {
      // Retorna dados mock se não houver conexão com DB
      res.json(seedCakes.map((cake, index) => ({ ...cake, id: index + 1 })))
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar bolos' })
  }
})

app.post('/api/cakes', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const cake = new Cake(req.body)
      await cake.save()
      res.status(201).json(cake)
    } else {
      res.status(201).json({ message: 'Bolo criado (modo demo)', data: req.body })
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar bolo' })
  }
})

// Rotas dos Pedidos
app.get('/api/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { status, limit = 50, page = 1 } = req.query
      
      let query = {}
      if (status) query.status = status
      
      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('items.cakeId', 'name category')
      
      const total = await Order.countDocuments(query)
      
      res.json({
        success: true,
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      })
    } else {
      // Dados mock para demonstração
      res.json({
        success: true,
        orders: [
          {
            orderNumber: "MG24120112345",
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
              phone: "914019142"
            },
            status: "pendente",
            createdAt: new Date()
          }
        ],
        pagination: { total: 1, page: 1, limit: 50, pages: 1 }
      })
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar pedidos',
      details: error.message 
    })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { items, customerInfo, notes, whatsappMessage } = req.body
      
      // Calcular totais
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0)
      
      // Criar pedido
      const orderData = {
        orderNumber: generateOrderNumber(),
        items,
        totalPrice,
        totalItems,
        customerInfo,
        notes,
        whatsappMessage,
        whatsappSent: true
      }
      
      const order = new Order(orderData)
      await order.save()
      
      console.log(`📋 Novo pedido criado: ${order.orderNumber}`)
      console.log(`💰 Total: € ${totalPrice.toFixed(2)}`)
      console.log(`📱 Itens: ${totalItems}`)
      
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso!',
        order: {
          orderNumber: order.orderNumber,
          totalPrice: order.totalPrice,
          totalItems: order.totalItems,
          createdAt: order.createdAt
        }
      })
    } else {
      res.status(201).json({ 
        success: true,
        message: 'Pedido criado (modo demo)', 
        data: req.body 
      })
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    res.status(400).json({ 
      success: false,
      error: 'Erro ao criar pedido',
      details: error.message 
    })
  }
})

// Estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const totalOrders = await Order.countDocuments()
      const todayOrders = await Order.countDocuments({
        createdAt: { $gte: today }
      })
      
      const revenueResult = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
      const totalRevenue = revenueResult[0]?.total || 0
      
      const todayRevenueResult = await Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
      const todayRevenue = todayRevenueResult[0]?.total || 0
      
      const statusStats = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      
      const topCakes = await Order.aggregate([
        { $unwind: '$items' },
        { $group: { 
          _id: '$items.cakeName', 
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }},
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ])
      
      res.json({
        success: true,
        stats: {
          totalOrders,
          todayOrders,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          todayRevenue: parseFloat(todayRevenue.toFixed(2)),
          totalCakes: await Cake.countDocuments({ available: true }),
          statusBreakdown: statusStats,
          topSellingCakes: topCakes,
          lastUpdated: new Date()
        }
      })
    } else {
      // Dados mock
      res.json({
        success: true,
        stats: {
          totalOrders: 156,
          todayOrders: 12,
          totalRevenue: 3780.00,
          todayRevenue: 285.00,
          totalCakes: 8,
          statusBreakdown: [
            { _id: 'pendente', count: 8 },
            { _id: 'confirmado', count: 3 },
            { _id: 'pronto', count: 1 }
          ],
          topSellingCakes: [
            { _id: 'Bolo de Chocolate Especial', totalSold: 45, revenue: 1125.00 },
            { _id: 'Bolo de Morango', totalSold: 32, revenue: 736.00 }
          ],
          lastUpdated: new Date()
        }
      })
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar estatísticas',
      details: error.message 
    })
  }
})

// Atualizar status de pedido
app.patch('/api/orders/:orderNumber/status', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { orderNumber } = req.params
      const { status, paymentStatus, notes } = req.body
      
      const updateData = { updatedAt: new Date() }
      if (status) updateData.status = status
      if (paymentStatus) updateData.paymentStatus = paymentStatus
      if (notes) updateData.notes = notes
      
      const order = await Order.findOneAndUpdate(
        { orderNumber },
        updateData,
        { new: true }
      )
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        })
      }
      
      console.log(`📋 Pedido ${orderNumber} atualizado: ${status || 'status não alterado'}`)
      
      res.json({
        success: true,
        message: 'Pedido atualizado com sucesso!',
        order
      })
    } else {
      res.json({
        success: true,
        message: 'Pedido atualizado (modo demo)',
        data: req.body
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar pedido',
      details: error.message
    })
  }
})

// Buscar pedido específico
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const { orderNumber } = req.params
      
      const order = await Order.findOne({ orderNumber })
        .populate('items.cakeId', 'name category description')
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        })
      }
      
      res.json({
        success: true,
        order
      })
    } else {
      res.json({
        success: true,
        order: {
          orderNumber: req.params.orderNumber,
          message: 'Modo demo - pedido não encontrado'
        }
      })
    }
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedido',
      details: error.message
    })
  }
})

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo deu errado!' })
})

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Inicialização do servidor
const startServer = async () => {
  await connectDB()
  
  // Seed inicial dos dados (apenas se conectado ao MongoDB)
  if (mongoose.connection.readyState === 1) {
    try {
      const existingCakes = await Cake.countDocuments()
      if (existingCakes === 0) {
        await Cake.insertMany(seedCakes)
        console.log('✅ Dados iniciais dos bolos inseridos!')
      }
    } catch (error) {
      console.log('⚠️  Erro ao inserir dados iniciais:', error.message)
    }
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
    console.log(`📱 API disponível em: http://localhost:${PORT}`)
    console.log(`🎂 Maria Gulosa Backend iniciado com sucesso!`)
  })
}

startServer() 