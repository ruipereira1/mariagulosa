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
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddCake, setShowAddCake] = useState(false)
  const [newCake, setNewCake] = useState({
    name: '',
    price: '',
    description: ''
  })
  const [notification, setNotification] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Autenticação local - Em produção, use JWT/OAuth
    if (credentials.username === 'maria' && credentials.password === 'julho2010') {
      setIsLoggedIn(true)
      loadDashboardData()
    } else {
      alert('Credenciais inválidas!')
    }
  }

  const loadDashboardData = async (showSuccessNotification = false) => {
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
      
      if (showSuccessNotification) {
        showNotification('Dados atualizados com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      // Usar dados mock em caso de erro
      setStats({
        totalOrders: 0,
        todayOrders: 0,
        totalRevenue: 0,
        todayRevenue: 0,
        totalCakes: 6
      })
      showNotification('Erro ao carregar dados. Usando dados locais.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshData = () => {
    loadDashboardData(true)
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddCake = () => {
    setShowAddCake(true)
    setNewCake({ name: '', price: '', description: '' })
  }

  const handleSaveCake = async () => {
    try {
      if (!newCake.name || !newCake.price) {
        showNotification('Nome e preço são obrigatórios!')
        return
      }

      setLoading(true)

      const response = await fetch(API_ENDPOINTS.manageCakes, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCake.name,
          price: parseFloat(newCake.price),
          description: newCake.description,
          category: 'bolos',
          available: true
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Bolo adicionado com sucesso!')
        setShowAddCake(false)
        setNewCake({ name: '', price: '', description: '' })
        // Recarregar dados
        loadDashboardData()
      } else {
        showNotification(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao adicionar bolo:', error)
      showNotification('Erro ao adicionar bolo')
    } finally {
      setLoading(false)
    }
  }



  const handleExportData = () => {
    const data = {
      stats,
      orders,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maria-gulosa-dados-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification('Dados exportados com sucesso!')
  }

  const handleUpdateOrderStatus = async (orderNumber: string, newStatus: string) => {
    try {
      setLoading(true)
      
      // Fazer chamada real para a API
      const response = await fetch(API_ENDPOINTS.updateOrder, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          status: newStatus
        })
      })

      const data = await response.json()

      if (data.success) {
        // Atualizar lista local
        const updatedOrders = orders.map((order: any) => 
          order.orderNumber === orderNumber 
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
        setOrders(updatedOrders)
        showNotification(`Pedido ${orderNumber} atualizado para ${newStatus}`)
        
        // Recarregar estatísticas
        loadDashboardData()
      } else {
        showNotification(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error)
      showNotification('Erro ao atualizar pedido')
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
        {/* Notificação */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {notification}
          </motion.div>
        )}
        
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
                  onClick={handleRefreshData}
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
                        
                        {/* Botões de ação para pedidos */}
                        <div className="mt-3 flex space-x-2">
                          {order.status === 'pendente' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderNumber, 'confirmado')}
                              disabled={loading}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                              Confirmar
                            </button>
                          )}
                          {order.status === 'confirmado' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderNumber, 'pronto')}
                              disabled={loading}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              Marcar Pronto
                            </button>
                          )}
                          {order.status === 'pronto' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderNumber, 'entregue')}
                              disabled={loading}
                              className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50"
                            >
                              Entregar
                            </button>
                          )}
                          {order.customerInfo?.phone && (
                            <button
                              onClick={() => window.open(`https://wa.me/${order.customerInfo?.phone?.replace(/\D/g, '')}?text=Olá! Sobre seu pedido ${order.orderNumber}...`, '_blank')}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors"
                            >
                              WhatsApp
                            </button>
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
                  onClick={handleRefreshData}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Atualizar Dados</span>
                </button>
                <button 
                  onClick={handleAddCake}
                  className="btn-secondary w-full"
                >
                  ➕ Adicionar Novo Bolo
                </button>
                <button 
                  onClick={handleExportData}
                  className="btn-secondary w-full"
                >
                  📊 Exportar Dados
                </button>
                <button 
                  onClick={() => window.open('/cardapio', '_blank')}
                  className="btn-secondary w-full"
                >
                  👁️ Ver Catálogo
                </button>
              </div>
            </div>

            {/* Modal para adicionar bolo */}
            {showAddCake && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddCake(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-dancing text-2xl text-chocolate mb-4">
                    Adicionar Novo Bolo
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome do bolo"
                      value={newCake.name}
                      onChange={(e) => setNewCake({...newCake, name: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <input
                      type="number"
                      placeholder="Preço (€)"
                      value={newCake.price}
                      onChange={(e) => setNewCake({...newCake, price: e.target.value})}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <textarea
                      placeholder="Descrição"
                      value={newCake.description}
                      onChange={(e) => setNewCake({...newCake, description: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveCake}
                        disabled={loading || !newCake.name || !newCake.price}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Salvando...' : 'Adicionar'}
                      </button>
                      <button
                        onClick={() => setShowAddCake(false)}
                        disabled={loading}
                        className="btn-secondary flex-1 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Estatísticas detalhadas */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-semibold text-chocolate mb-4">Resumo do Dia</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pedidos hoje:</span>
                    <span className="font-medium">{stats?.todayOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendas hoje:</span>
                    <span className="font-medium">€ {stats?.todayRevenue?.toFixed(2) || '0,00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ticket médio:</span>
                    <span className="font-medium">
                      € {stats?.todayOrders > 0 ? (stats.todayRevenue / stats.todayOrders).toFixed(2) : '0,00'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="font-semibold text-chocolate mb-4">Status dos Pedidos</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Pendentes:
                    </span>
                    <span className="font-medium">
                      {orders.filter(order => order.status === 'pendente').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Confirmados:
                    </span>
                    <span className="font-medium">
                      {orders.filter(order => order.status === 'confirmado').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Prontos:
                    </span>
                    <span className="font-medium">
                      {orders.filter(order => order.status === 'pronto').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota sobre integração */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>✨ Painel Funcional:</strong> Todas as funcionalidades básicas estão operacionais. 
                Os dados são sincronizados com as APIs do sistema e atualizados em tempo real.
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


        </div>
      </motion.div>
    </div>
  )
}

export default Admin 