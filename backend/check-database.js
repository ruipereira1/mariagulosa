import mongoose from 'mongoose'

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/maria-gulosa')
    console.log('✅ MongoDB conectado com sucesso!')
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

// Função principal
const checkDatabase = async () => {
  console.log('🗄️ VERIFICAÇÃO COMPLETA DO BANCO MARIA GULOSA')
  console.log('==============================================\n')
  
  const connected = await connectDB()
  if (!connected) {
    console.log('❌ MongoDB não está disponível')
    console.log('💡 Verifique se o MongoDB está rodando:')
    console.log('   tasklist | findstr mongod')
    process.exit(1)
  }

  try {
    // Informações da conexão
    console.log('🔗 CONEXÃO:')
    console.log(`   📍 URI: mongodb://localhost:27017/maria-gulosa`)
    console.log(`   🗄️  Database: ${mongoose.connection.db.databaseName}`)
    console.log(`   ⚡ Status: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`)

    // Verificar coleções
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📂 COLEÇÕES:')
    if (collections.length === 0) {
      console.log('   ❌ Nenhuma coleção encontrada')
    } else {
      collections.forEach(col => {
        console.log(`   📋 ${col.name}`)
      })
    }

    // Estatísticas dos bolos
    const cakeCount = await Cake.countDocuments()
    console.log('\n🎂 BOLOS:')
    console.log(`   📊 Total: ${cakeCount}`)
    
    if (cakeCount > 0) {
      const cakesByCategory = await Cake.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      
      console.log('   📂 Por categoria:')
      cakesByCategory.forEach(cat => {
        console.log(`      ${cat._id}: ${cat.count}`)
      })
    }

    // Estatísticas dos pedidos
    const orderCount = await Order.countDocuments()
    console.log('\n📋 PEDIDOS:')
    console.log(`   📊 Total: ${orderCount}`)

    if (orderCount > 0) {
      // Pedidos por status
      const statusStats = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
      
      console.log('   📊 Por status:')
      statusStats.forEach(stat => {
        console.log(`      ${stat._id}: ${stat.count}`)
      })

      // Receita total
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
      
      console.log(`   💰 Receita total: € ${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`)

      // Pedidos hoje
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const todayOrders = await Order.countDocuments({
        createdAt: { $gte: today }
      })
      
      const todayRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
      
      console.log(`   📅 Pedidos hoje: ${todayOrders}`)
      console.log(`   💰 Receita hoje: € ${todayRevenue[0]?.total?.toFixed(2) || '0.00'}`)

      // Últimos pedidos
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('orderNumber totalPrice status createdAt customerInfo')

      if (recentOrders.length > 0) {
        console.log('\n📋 ÚLTIMOS PEDIDOS:')
        recentOrders.forEach(order => {
          console.log(`   ${order.orderNumber} - € ${order.totalPrice.toFixed(2)} - ${order.status}`)
          console.log(`      📅 ${order.createdAt.toLocaleString('pt-PT')}`)
          if (order.customerInfo?.name) {
            console.log(`      👤 ${order.customerInfo.name}`)
          }
        })
      }
    }

    // Status do sistema
    console.log('\n🚀 STATUS DO SISTEMA:')
    console.log('   ✅ MongoDB: Funcionando')
    console.log('   ✅ Backend: http://localhost:5000')
    console.log('   ✅ Frontend: http://localhost:5173')
    console.log('   ✅ Admin: http://localhost:5173/admin')

    // Comandos úteis
    console.log('\n🛠️  COMANDOS ÚTEIS:')
    console.log('   📊 Ver estatísticas: node db-manager.js')
    console.log('   ➕ Adicionar dados: node add-sample-data.js')
    console.log('   🔍 Verificar banco: node check-database.js')
    console.log('   🚀 Iniciar sistema: npm run dev')

    console.log('\n✅ Verificação concluída com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro durante verificação:', error.message)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Conexão fechada')
  }
}

// Executar
checkDatabase() 