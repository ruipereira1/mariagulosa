import mongoose from 'mongoose'

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

// Schema do pedido
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

const Order = mongoose.model('Order', OrderSchema)

// Função para gerar número de pedido
const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const time = Date.now().toString().slice(-6)
  return `MG${year}${month}${day}${time}`
}

// Dados de exemplo
const sampleOrders = [
  {
    orderNumber: generateOrderNumber(),
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
    status: "pendente",
    whatsappSent: true,
    whatsappMessage: "🎂 *ENCOMENDA MARIA GULOSA* 🎂\n\n📋 *Pedido:* MG24120112345\n\n🍰 *Bolos escolhidos:*\n• Bolo de Chocolate Especial (1x) - € 25,00\n\n💰 *Total: € 25,00*\n\n📞 Confirme sua encomenda respondendo esta mensagem!\n\n🏪 *Maria Gulosa - Sabores que encantam* ✨"
  },
  {
    orderNumber: generateOrderNumber(),
    items: [
      {
        cakeName: "Bolo de Morango",
        quantity: 2,
        unitPrice: 23.00,
        subtotal: 46.00
      },
      {
        cakeName: "Bolo de Cenoura",
        quantity: 1,
        unitPrice: 21.00,
        subtotal: 21.00
      }
    ],
    totalPrice: 67.00,
    totalItems: 3,
    customerInfo: {
      name: "João Santos",
      phone: "912345678",
      email: "joao@email.com"
    },
    status: "confirmado",
    paymentStatus: "pago",
    whatsappSent: true,
    notes: "Entrega para festa de aniversário",
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
    whatsappMessage: "🎂 *ENCOMENDA MARIA GULOSA* 🎂\n\n📋 *Pedido:* MG24120112346\n\n🍰 *Bolos escolhidos:*\n• Bolo de Morango (2x) - € 46,00\n• Bolo de Cenoura (1x) - € 21,00\n\n💰 *Total: € 67,00*\n\n📞 Confirme sua encomenda respondendo esta mensagem!\n\n🏪 *Maria Gulosa - Sabores que encantam* ✨"
  },
  {
    orderNumber: generateOrderNumber(),
    items: [{
      cakeName: "Bolo Red Velvet",
      quantity: 1,
      unitPrice: 27.00,
      subtotal: 27.00
    }],
    totalPrice: 27.00,
    totalItems: 1,
    customerInfo: {
      name: "Maria Costa",
      phone: "913456789",
      email: "maria@email.com"
    },
    status: "pronto",
    paymentStatus: "pago",
    whatsappSent: true,
    notes: "Cliente preferencial",
    whatsappMessage: "🎂 *ENCOMENDA MARIA GULOSA* 🎂\n\n📋 *Pedido:* MG24120112347\n\n🍰 *Bolos escolhidos:*\n• Bolo Red Velvet (1x) - € 27,00\n\n💰 *Total: € 27,00*\n\n📞 Confirme sua encomenda respondendo esta mensagem!\n\n🏪 *Maria Gulosa - Sabores que encantam* ✨"
  }
]

// Função principal
const addSampleData = async () => {
  console.log('🎂 Adicionando dados de exemplo ao banco Maria Gulosa...\n')
  
  const connected = await connectDB()
  if (!connected) {
    console.log('❌ Não foi possível conectar ao MongoDB')
    process.exit(1)
  }

  try {
    // Verificar pedidos existentes
    const existingOrders = await Order.countDocuments()
    console.log(`📋 Pedidos existentes: ${existingOrders}`)

    // Adicionar pedidos de exemplo
    console.log('➕ Inserindo pedidos de exemplo...')
    
    for (const orderData of sampleOrders) {
      try {
        const order = new Order(orderData)
        await order.save()
        console.log(`✅ Pedido ${order.orderNumber} criado - € ${order.totalPrice.toFixed(2)}`)
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Pedido ${orderData.orderNumber} já existe`)
        } else {
          console.error(`❌ Erro ao criar pedido: ${error.message}`)
        }
      }
    }

    // Mostrar estatísticas finais
    const totalOrders = await Order.countDocuments()
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])

    console.log('\n📊 ESTATÍSTICAS ATUALIZADAS:')
    console.log('============================')
    console.log(`📋 Total de pedidos: ${totalOrders}`)
    console.log(`💰 Receita total: € ${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`)

    // Mostrar pedidos por status
    const statusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    console.log('\n📊 Pedidos por status:')
    statusStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`)
    })

    console.log('\n✅ Dados de exemplo adicionados com sucesso!')
    console.log('🌐 Acesse o admin: http://localhost:5173/admin')
    console.log('🛒 Teste o carrinho: http://localhost:5173')
    
  } catch (error) {
    console.error('❌ Erro ao adicionar dados:', error.message)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Conexão fechada')
  }
}

// Executar
addSampleData() 