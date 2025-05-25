import mongoose from 'mongoose'
import readline from 'readline'

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Função para obter string de conexão do usuário
const getConnectionString = () => {
  return new Promise((resolve) => {
    console.log('🌐 CONFIGURAÇÃO MONGODB ATLAS')
    console.log('============================\n')
    console.log('Cole aqui sua string de conexão do MongoDB Atlas:')
    console.log('(Exemplo: mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/maria-gulosa)')
    console.log('')
    
    rl.question('String de conexão: ', (connectionString) => {
      resolve(connectionString.trim())
    })
  })
}

// Conectar ao MongoDB Atlas
const connectToAtlas = async (connectionString) => {
  try {
    // Adicionar nome do banco se não estiver presente
    if (!connectionString.includes('/maria-gulosa')) {
      connectionString = connectionString.replace('mongodb.net/', 'mongodb.net/maria-gulosa')
    }
    
    await mongoose.connect(connectionString)
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!')
    console.log(`📍 Conectado em: ${connectionString.split('@')[1].split('/')[0]}`)
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message)
    console.log('\n💡 Dicas para resolver:')
    console.log('   1. Verifique se a string de conexão está correta')
    console.log('   2. Substitua <password> pela sua senha real')
    console.log('   3. Verifique se o IP está liberado (0.0.0.0/0)')
    console.log('   4. Verifique se o usuário tem permissões')
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

// Função para gerar número de pedido
const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const time = Date.now().toString().slice(-6)
  return `MG${year}${month}${day}${time}`
}

// Configurar dados iniciais
const setupInitialData = async () => {
  try {
    // Verificar e inserir bolos
    const cakeCount = await Cake.countDocuments()
    console.log(`🎂 Bolos existentes: ${cakeCount}`)
    
    if (cakeCount === 0) {
      console.log('➕ Inserindo bolos iniciais...')
      await Cake.insertMany(seedCakes)
      console.log('✅ Bolos inseridos com sucesso!')
    }

    // Adicionar um pedido de exemplo
    const orderCount = await Order.countDocuments()
    console.log(`📋 Pedidos existentes: ${orderCount}`)
    
    if (orderCount === 0) {
      console.log('➕ Criando pedido de exemplo...')
      const sampleOrder = {
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
        whatsappMessage: "🎂 *ENCOMENDA MARIA GULOSA* 🎂\n\n📋 *Pedido:* " + generateOrderNumber() + "\n\n🍰 *Bolos escolhidos:*\n• Bolo de Chocolate Especial (1x) - € 25,00\n\n💰 *Total: € 25,00*\n\n📞 Confirme sua encomenda respondendo esta mensagem!\n\n🏪 *Maria Gulosa - Sabores que encantam* ✨"
      }
      
      const order = new Order(sampleOrder)
      await order.save()
      console.log(`✅ Pedido ${order.orderNumber} criado!`)
    }

    // Mostrar estatísticas
    const finalCakeCount = await Cake.countDocuments()
    const finalOrderCount = await Order.countDocuments()
    
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])

    console.log('\n📊 ESTATÍSTICAS DO ATLAS:')
    console.log('=========================')
    console.log(`🎂 Bolos: ${finalCakeCount}`)
    console.log(`📋 Pedidos: ${finalOrderCount}`)
    console.log(`💰 Receita: € ${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`)
    
  } catch (error) {
    console.error('❌ Erro ao configurar dados:', error.message)
  }
}

// Criar arquivo .env
const createEnvFile = (connectionString) => {
  const envContent = `PORT=5000
MONGODB_URI=${connectionString}
NODE_ENV=development

# Configurações da aplicação
JWT_SECRET=maria_gulosa_secret_key_2024
ADMIN_USERNAME=maria
ADMIN_PASSWORD=gulosa123

# Configurações do WhatsApp
WHATSAPP_NUMBER=351914019142`

  console.log('\n📝 ARQUIVO .ENV SUGERIDO:')
  console.log('==========================')
  console.log(envContent)
  console.log('\n💡 Copie o conteúdo acima e cole em backend/.env')
}

// Função principal
const main = async () => {
  try {
    const connectionString = await getConnectionString()
    
    if (!connectionString) {
      console.log('❌ String de conexão não fornecida')
      rl.close()
      return
    }

    console.log('\n🔄 Testando conexão...')
    const connected = await connectToAtlas(connectionString)
    
    if (!connected) {
      rl.close()
      return
    }

    console.log('\n🗄️ Configurando dados iniciais...')
    await setupInitialData()

    createEnvFile(connectionString)

    console.log('\n🎉 MONGODB ATLAS CONFIGURADO COM SUCESSO!')
    console.log('==========================================')
    console.log('✅ Conexão testada e funcionando')
    console.log('✅ Dados iniciais inseridos')
    console.log('✅ Pronto para usar no projeto')
    console.log('')
    console.log('🚀 PRÓXIMOS PASSOS:')
    console.log('1. Copie o conteúdo do .env mostrado acima')
    console.log('2. Cole em backend/.env')
    console.log('3. Execute: npm run dev')
    console.log('4. Acesse: http://localhost:5173')
    console.log('')
    console.log('🌐 Seu banco está na nuvem e acessível de qualquer lugar!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await mongoose.connection.close()
    rl.close()
    console.log('🔌 Conexão fechada')
  }
}

// Executar
main() 