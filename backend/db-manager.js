import mongoose from 'mongoose'
import readline from 'readline'

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/maria-gulosa')
    console.log('✅ Conectado ao MongoDB!')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message)
    return false
  }
}

// Schemas (mesmos do server.js)
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
  },
  {
    name: "Bolo de Baunilha Premium",
    description: "Bolo clássico de baunilha com cobertura de buttercream",
    price: 26.00,
    category: 'especiais',
    rating: 5
  },
  {
    name: "Bolo de Noz",
    description: "Bolo rico em nozes com cobertura de caramelo",
    price: 28.00,
    category: 'especiais',
    rating: 4
  }
]

// Funções do gerenciador
const showStats = async () => {
  console.log('\n📊 ESTATÍSTICAS DO BANCO:')
  console.log('========================')
  
  const cakeCount = await Cake.countDocuments()
  const orderCount = await Order.countDocuments()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayOrders = await Order.countDocuments({
    createdAt: { $gte: today }
  })
  
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ])
  
  const todayRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ])
  
  const statusStats = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])

  console.log(`🎂 Bolos disponíveis: ${cakeCount}`)
  console.log(`📋 Total de pedidos: ${orderCount}`)
  console.log(`📅 Pedidos hoje: ${todayOrders}`)
  console.log(`💰 Receita total: € ${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`)
  console.log(`💰 Receita hoje: € ${todayRevenue[0]?.total?.toFixed(2) || '0.00'}`)
  
  if (statusStats.length > 0) {
    console.log('\n📊 Status dos pedidos:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`)
    })
  }
}

const showCakes = async () => {
  console.log('\n🎂 BOLOS NO CATÁLOGO:')
  console.log('====================')
  
  const cakes = await Cake.find().sort({ category: 1, name: 1 })
  
  if (cakes.length === 0) {
    console.log('❌ Nenhum bolo encontrado')
    return
  }
  
  let currentCategory = ''
  cakes.forEach(cake => {
    if (cake.category !== currentCategory) {
      currentCategory = cake.category
      console.log(`\n📂 ${currentCategory.toUpperCase()}:`)
    }
    console.log(`   ${cake.name} - € ${cake.price.toFixed(2)} - ⭐ ${cake.rating}/5`)
    console.log(`      ${cake.description}`)
  })
}

const showOrders = async () => {
  console.log('\n📋 PEDIDOS RECENTES:')
  console.log('===================')
  
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
  
  if (orders.length === 0) {
    console.log('❌ Nenhum pedido encontrado')
    return
  }
  
  orders.forEach(order => {
    console.log(`\n📋 ${order.orderNumber}`)
    console.log(`   💰 Total: € ${order.totalPrice.toFixed(2)}`)
    console.log(`   📊 Status: ${order.status}`)
    console.log(`   📅 Data: ${order.createdAt.toLocaleString('pt-PT')}`)
    console.log(`   📱 Itens: ${order.totalItems}`)
    
    if (order.items && order.items.length > 0) {
      console.log(`   🎂 Bolos:`)
      order.items.forEach(item => {
        console.log(`      - ${item.cakeName} (${item.quantity}x) = € ${item.subtotal.toFixed(2)}`)
      })
    }
    
    if (order.customerInfo?.phone) {
      console.log(`   📞 Telefone: ${order.customerInfo.phone}`)
    }
  })
}

const resetDatabase = async () => {
  console.log('\n⚠️  RESETAR BANCO DE DADOS')
  console.log('==========================')
  console.log('Esta ação irá APAGAR TODOS os dados!')
  
  return new Promise((resolve) => {
    rl.question('Tem certeza? Digite "CONFIRMAR" para continuar: ', async (answer) => {
      if (answer === 'CONFIRMAR') {
        try {
          await Order.deleteMany({})
          await Cake.deleteMany({})
          console.log('🗑️  Todos os dados foram apagados!')
          
          await Cake.insertMany(seedCakes)
          console.log('✅ Bolos iniciais inseridos!')
          
          console.log('✅ Banco resetado com sucesso!')
        } catch (error) {
          console.error('❌ Erro ao resetar:', error.message)
        }
      } else {
        console.log('❌ Operação cancelada')
      }
      resolve()
    })
  })
}

const addSampleOrders = async () => {
  console.log('\n➕ ADICIONANDO PEDIDOS DE EXEMPLO...')
  
  const sampleOrders = [
    {
      orderNumber: `MG${Date.now()}001`,
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
      whatsappSent: true
    },
    {
      orderNumber: `MG${Date.now()}002`,
      items: [{
        cakeName: "Bolo de Morango",
        quantity: 2,
        unitPrice: 23.00,
        subtotal: 46.00
      }],
      totalPrice: 46.00,
      totalItems: 2,
      customerInfo: {
        name: "João Santos",
        phone: "912345678"
      },
      status: "confirmado",
      whatsappSent: true
    }
  ]
  
  try {
    await Order.insertMany(sampleOrders)
    console.log('✅ Pedidos de exemplo adicionados!')
  } catch (error) {
    console.error('❌ Erro ao adicionar pedidos:', error.message)
  }
}

// Menu principal
const showMenu = () => {
  console.log('\n🗄️ GERENCIADOR DO BANCO MARIA GULOSA')
  console.log('===================================')
  console.log('1. 📊 Ver estatísticas')
  console.log('2. 🎂 Ver bolos')
  console.log('3. 📋 Ver pedidos')
  console.log('4. ➕ Adicionar pedidos de exemplo')
  console.log('5. 🔄 Resetar banco de dados')
  console.log('6. 🚪 Sair')
  console.log('')
}

const handleMenu = async () => {
  return new Promise((resolve) => {
    rl.question('Escolha uma opção (1-6): ', async (choice) => {
      switch (choice) {
        case '1':
          await showStats()
          break
        case '2':
          await showCakes()
          break
        case '3':
          await showOrders()
          break
        case '4':
          await addSampleOrders()
          break
        case '5':
          await resetDatabase()
          break
        case '6':
          console.log('👋 Até logo!')
          resolve(true)
          return
        default:
          console.log('❌ Opção inválida!')
      }
      resolve(false)
    })
  })
}

// Função principal
const main = async () => {
  console.log('🎂 Iniciando Gerenciador do Banco Maria Gulosa...\n')
  
  const connected = await connectDB()
  if (!connected) {
    console.log('❌ Não foi possível conectar ao MongoDB')
    process.exit(1)
  }

  // Verificar se há bolos, se não, inserir dados iniciais
  const cakeCount = await Cake.countDocuments()
  if (cakeCount === 0) {
    console.log('➕ Inserindo bolos iniciais...')
    await Cake.insertMany(seedCakes)
    console.log('✅ Bolos inseridos!')
  }

  let exit = false
  while (!exit) {
    showMenu()
    exit = await handleMenu()
  }
  
  await mongoose.connection.close()
  rl.close()
  console.log('🔌 Conexão fechada')
}

// Executar
main().catch(console.error) 