import mongoose from 'mongoose'

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/maria-gulosa', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Conectado ao MongoDB!')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message)
    return false
  }
}

// Schemas
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

// Dados iniciais
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
  },
  {
    name: "Bolo de Limão",
    description: "Bolo cítrico refrescante com cobertura de limão",
    price: 22.00,
    category: 'frutas',
    rating: 4
  },
  {
    name: "Bolo de Coco",
    description: "Bolo tropical com coco ralado e leite condensado",
    price: 24.00,
    category: 'tradicionais',
    rating: 5
  }
]

// Função principal
const setupDatabase = async () => {
  console.log('🗄️ Configurando banco de dados Maria Gulosa...\n')
  
  const connected = await connectDB()
  if (!connected) {
    console.log('❌ Não foi possível conectar ao MongoDB')
    process.exit(1)
  }

  try {
    // Verificar coleções existentes
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('📋 Coleções existentes:', collections.map(c => c.name))

    // Verificar bolos
    const cakeCount = await Cake.countDocuments()
    console.log(`🎂 Bolos no banco: ${cakeCount}`)

    if (cakeCount === 0) {
      console.log('➕ Inserindo bolos iniciais...')
      await Cake.insertMany(seedCakes)
      console.log('✅ Bolos inseridos com sucesso!')
    }

    // Verificar pedidos
    const orderCount = await Order.countDocuments()
    console.log(`📋 Pedidos no banco: ${orderCount}`)

    // Mostrar estatísticas
    console.log('\n📊 ESTATÍSTICAS DO BANCO:')
    console.log('========================')
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    })
    
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])
    
    const statusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    console.log(`📋 Total de pedidos: ${orderCount}`)
    console.log(`📅 Pedidos hoje: ${todayOrders}`)
    console.log(`💰 Receita total: € ${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`)
    console.log(`🎂 Bolos disponíveis: ${cakeCount}`)
    
    if (statusStats.length > 0) {
      console.log('\n📊 Status dos pedidos:')
      statusStats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count}`)
      })
    }

    // Mostrar alguns pedidos recentes
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('orderNumber totalPrice status createdAt')

    if (recentOrders.length > 0) {
      console.log('\n📋 Pedidos recentes:')
      recentOrders.forEach(order => {
        console.log(`   ${order.orderNumber} - € ${order.totalPrice.toFixed(2)} - ${order.status} - ${order.createdAt.toLocaleString('pt-PT')}`)
      })
    }

    console.log('\n✅ Banco de dados configurado com sucesso!')
    console.log('🌐 Acesse: http://localhost:5173/admin (maria/gulosa123)')
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error.message)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Conexão fechada')
  }
}

// Executar
setupDatabase() 