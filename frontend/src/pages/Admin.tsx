import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const Admin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // ⚠️ DEMO ONLY - Em produção, use autenticação real (JWT, OAuth, etc.)
    if (credentials.username === 'maria' && credentials.password === 'julho2010') {
      setIsLoggedIn(true)
      loadDashboardData()
    } else {
      alert('Credenciais inválidas!')
    }
  }

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Buscar estatísticas
      const statsResponse = await fetch(API_ENDPOINTS.stats)
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Buscar pedidos recentes
      const ordersResponse = await fetch(`${API_ENDPOINTS.orders}?limit=10`)
      const ordersData = await ordersResponse.json()
      if (ordersData.success) {
        setOrders(ordersData.orders)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      // Usar dados mock em caso de erro
      setStats({
        totalOrders: 0,
        todayOrders: 0,
        totalRevenue: 0,
        todayRevenue: 0,
        totalCakes: 8
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData()
    }
  }, [isLoggedIn])

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream to-soft-pink p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-dancing text-4xl text-chocolate">
                Painel Administrativo
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="btn-secondary"
                >
                  Sair
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card de Pedidos Hoje */}
              <motion.div
                className="card p-6 text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-chocolate mb-2">
                  Pedidos Hoje
                </h3>
                <p className="text-3xl font-bold text-rose-gold">
                  {loading ? '...' : stats?.todayOrders || 0}
                </p>
                <p className="text-gray-600 text-sm">
                  Total: {stats?.totalOrders || 0}
                </p>
              </motion.div>

              {/* Card de Vendas Hoje */}
              <motion.div
                className="card p-6 text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-chocolate mb-2">
                  Vendas Hoje
                </h3>
                <p className="text-3xl font-bold text-rose-gold">
                  {loading ? '...' : `€ ${stats?.todayRevenue?.toFixed(2) || '0,00'}`}
                </p>
                <p className="text-gray-600 text-sm">
                  Total: € {stats?.totalRevenue?.toFixed(2) || '0,00'}
                </p>
              </motion.div>

              {/* Card de Produtos */}
              <motion.div
                className="card p-6 text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">🎂</div>
                <h3 className="text-xl font-semibold text-chocolate mb-2">
                  Bolos Ativos
                </h3>
                <p className="text-3xl font-bold text-rose-gold">
                  {loading ? '...' : stats?.totalCakes || 8}
                </p>
                <p className="text-gray-600 text-sm">Catálogo ativo</p>
              </motion.div>

              {/* Card de Status */}
              <motion.div
                className="card p-6 text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold text-chocolate mb-2">
                  Pendentes
                </h3>
                <p className="text-3xl font-bold text-rose-gold">
                  {loading ? '...' : stats?.statusBreakdown?.find((s: any) => s._id === 'pendente')?.count || 0}
                </p>
                <p className="text-gray-600 text-sm">Aguardando</p>
              </motion.div>
            </div>

            {/* Seção de Pedidos Recentes */}
            <div className="mt-12">
              <h2 className="font-dancing text-3xl text-chocolate mb-6 text-center">
                Pedidos Recentes
              </h2>
              <div className="card p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-rose-gold" />
                    <p className="text-gray-600">Carregando pedidos...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-chocolate mb-2">
                      Nenhum pedido ainda
                    </h3>
                    <p className="text-gray-600">
                      Os pedidos feitos pelo site aparecerão aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any, index: number) => (
                      <motion.div
                        key={order.orderNumber || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 border-l-4 border-rose-gold"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-chocolate">
                              Pedido #{order.orderNumber}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleString('pt-PT')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-rose-gold">
                              € {order.totalPrice?.toFixed(2)}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'pronto' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p><strong>Itens:</strong> {order.totalItems}</p>
                          {order.items && order.items.length > 0 && (
                            <p><strong>Bolos:</strong> {order.items.map((item: any) => `${item.cakeName} (${item.quantity}x)`).join(', ')}</p>
                          )}
                          {order.customerInfo?.phone && (
                            <p><strong>Telefone:</strong> {order.customerInfo.phone}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seção de Ações Rápidas */}
            <div className="mt-12">
              <h2 className="font-dancing text-3xl text-chocolate mb-6 text-center">
                Ações Rápidas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={loadDashboardData}
                  className="btn-primary w-full"
                >
                  🔄 Atualizar Dados
                </button>
                <button className="btn-secondary w-full">
                  ➕ Adicionar Novo Bolo
                </button>
                <button className="btn-secondary w-full">
                  📊 Relatório de Vendas
                </button>
                <button className="btn-secondary w-full">
                  ⚙️ Configurações
                </button>
              </div>
            </div>

            {/* Nota sobre integração */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Este é um painel demonstrativo. 
                Para um sistema completo de gestão, seria necessário implementar 
                autenticação real, banco de dados e APIs específicas.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-cream to-soft-pink p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-gold/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-rose-gold" />
            </div>
            <h1 className="font-dancing text-3xl text-chocolate">
              Admin Maria Gulosa
            </h1>
            <p className="text-gray-600 mt-2">
              Faça login para acessar o painel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold transition-all"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold transition-all"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Demo:</strong> usuário: maria | senha: julho2010
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Admin 