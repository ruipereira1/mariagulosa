import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, RefreshCw, Plus, Edit, Trash2, Save, X, Package, BarChart3, FileText, Download, AlertTriangle } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'
import { 
  exportOrdersToPDF, 
  exportCakesToPDF, 
  exportOrdersToExcel, 
  exportCakesToExcel, 
  exportCompleteReport 
} from '../utils/exportUtils'

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
    description: '',
    image: '',
    category: 'bolos'
  })
  const [notification, setNotification] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [cakes, setCakes] = useState<any[]>([])
  const [editingCake, setEditingCake] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Autenticação local - Em produção, use JWT/OAuth
    if (credentials.username === 'maria' && credentials.password === 'julho2010') {
      setIsLoggedIn(true)
      loadDashboardData()
    } else {
      showNotification('❌ Credenciais inválidas!')
    }
  }

  const loadCakes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.manageCakes)
      const data = await response.json()
      
      if (data.success) {
        setCakes(data.cakes)
      } else {
        console.error('Erro ao carregar bolos:', data.error)
        // Usar dados mock em caso de erro
        setCakes([
          {
            id: '1',
            name: 'Bolo de Chocolate',
            price: 25.00,
            description: 'Delicioso bolo de chocolate com cobertura cremosa',
            image: '/images/cake-chocolate.jpg',
            category: 'chocolate',
            available: true
          },
          {
            id: '2',
            name: 'Bolo de Morango',
            price: 28.00,
            description: 'Bolo fofo com morangos frescos e chantilly',
            image: '/images/cake-strawberry.jpg',
            category: 'frutas',
            available: true
          }
        ])
      }
    } catch (error) {
      console.error('Erro ao carregar bolos:', error)
      setCakes([])
    }
  }

  const loadDashboardData = async (showSuccessNotification = false) => {
    setLoading(true)
    try {
      // Buscar estatísticas
      const statsResponse = await fetch(API_ENDPOINTS.stats)
      if (!statsResponse.ok) {
        throw new Error(`Stats API error: ${statsResponse.status}`)
      }
      const statsText = await statsResponse.text()
      let statsData
      try {
        statsData = JSON.parse(statsText)
      } catch (jsonError) {
        console.error('Erro ao parsear JSON das estatísticas:', statsText)
        throw new Error('Resposta inválida da API de estatísticas')
      }
      
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Buscar pedidos recentes
      const ordersResponse = await fetch(`${API_ENDPOINTS.orders}?limit=10`)
      if (!ordersResponse.ok) {
        throw new Error(`Orders API error: ${ordersResponse.status}`)
      }
      const ordersText = await ordersResponse.text()
      let ordersData
      try {
        ordersData = JSON.parse(ordersText)
      } catch (jsonError) {
        console.error('Erro ao parsear JSON dos pedidos:', ordersText)
        throw new Error('Resposta inválida da API de pedidos')
      }
      
      if (ordersData.success) {
        setOrders(ordersData.orders)
      }
      
      if (showSuccessNotification) {
        showNotification('Dados atualizados com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      console.error('Detalhes do erro:', error instanceof Error ? error.message : String(error))
      
      // Usar dados mock em caso de erro
      setStats({
        totalOrders: 15,
        todayOrders: 3,
        totalRevenue: 850.00,
        todayRevenue: 125.00,
        totalCakes: 6,
        statusBreakdown: [
          { _id: 'pendente', count: 2 },
          { _id: 'confirmado', count: 5 },
          { _id: 'em_preparo', count: 3 },
          { _id: 'pronto', count: 1 },
          { _id: 'entregue', count: 4 }
        ],
        popularCakes: [
          { name: 'Bolo de Chocolate', orders: 8 },
          { name: 'Bolo de Morango', orders: 5 },
          { name: 'Bolo Red Velvet', orders: 3 }
        ]
      })
      
      setOrders([
        {
          orderNumber: 'MG2412251001',
          status: 'pendente',
          totalPrice: 45.00,
          createdAt: new Date().toISOString(),
          items: [{ cakeName: 'Bolo de Chocolate', quantity: 1 }],
          customerInfo: { phone: '351914019142' }
        },
        {
          orderNumber: 'MG2412251002',
          status: 'confirmado',
          totalPrice: 80.00,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          items: [{ cakeName: 'Bolo de Morango', quantity: 2 }],
          customerInfo: { phone: '351914019142' }
        }
      ])
      
      showNotification('⚠️ Modo offline ativo. Dados de demonstração carregados.')
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
    setNewCake({ name: '', price: '', description: '', image: '', category: 'bolos' })
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
          image: newCake.image || '/images/default-cake.jpg',
          category: newCake.category,
          available: true
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Bolo adicionado com sucesso!')
        setShowAddCake(false)
        setNewCake({ name: '', price: '', description: '', image: '', category: 'bolos' })
        loadCakes()
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

  const handleEditCake = (cake: any) => {
    setEditingCake(cake)
    setShowEditModal(true)
  }

  const handleUpdateCake = async () => {
    try {
      if (!editingCake.name || !editingCake.price) {
        showNotification('Nome e preço são obrigatórios!')
        return
      }

      setLoading(true)

      const response = await fetch(API_ENDPOINTS.manageCakes, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCake.id,
          name: editingCake.name,
          price: parseFloat(editingCake.price),
          description: editingCake.description,
          image: editingCake.image,
          category: editingCake.category,
          available: editingCake.available
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Bolo atualizado com sucesso!')
        setShowEditModal(false)
        setEditingCake(null)
        loadCakes()
      } else {
        showNotification(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao atualizar bolo:', error)
      showNotification('Erro ao atualizar bolo')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCake = async (cakeId: string, cakeName: string) => {
    if (!confirm(`Tem certeza que deseja remover o bolo "${cakeName}"?`)) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch(API_ENDPOINTS.manageCakes, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: cakeId })
      })

      const data = await response.json()

      if (data.success) {
        showNotification('Bolo removido com sucesso!')
        loadCakes()
      } else {
        showNotification(`Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao remover bolo:', error)
      showNotification('Erro ao remover bolo')
    } finally {
      setLoading(false)
    }
  }



  const handleExportData = () => {
    setShowExportMenu(!showExportMenu)
  }

  const handleExportPDF = (type: 'orders' | 'cakes' | 'complete') => {
    try {
      switch (type) {
        case 'orders':
          exportOrdersToPDF(orders, stats)
          showNotification('📄 Relatório de pedidos exportado em PDF!')
          break
        case 'cakes':
          exportCakesToPDF(cakes)
          showNotification('📄 Catálogo de bolos exportado em PDF!')
          break
        case 'complete':
          exportCompleteReport(orders, cakes, stats)
          showNotification('📄 Relatório completo exportado em PDF!')
          break
      }
    } catch (error) {
      showNotification('❌ Erro ao exportar PDF!')
      console.error('Erro na exportação PDF:', error)
    }
    setShowExportMenu(false)
  }

  const handleExportExcel = (type: 'orders' | 'cakes') => {
    try {
      switch (type) {
        case 'orders':
          exportOrdersToExcel(orders, stats)
          showNotification('📊 Dados de pedidos exportados em Excel!')
          break
        case 'cakes':
          exportCakesToExcel(cakes)
          showNotification('📊 Catálogo de bolos exportado em Excel!')
          break
      }
    } catch (error) {
      showNotification('❌ Erro ao exportar Excel!')
      console.error('Erro na exportação Excel:', error)
    }
    setShowExportMenu(false)
  }

  const handleResetOrders = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/reset-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminKey: 'maria-reset-2024'
        })
      })

      const data = await response.json()

      if (data.success) {
        showNotification(`✅ ${data.message}`)
        // Recarregar dados
        await loadDashboardData()
      } else {
        showNotification(`❌ Erro: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao fazer reset:', error)
      showNotification('❌ Erro ao fazer reset das encomendas!')
    } finally {
      setLoading(false)
      setShowResetModal(false)
    }
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

  // Fechar menu de exportação ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      if (showExportMenu) {
        setShowExportMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

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

            {/* Sistema de Abas */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-chocolate shadow-sm'
                      : 'text-gray-600 hover:text-chocolate'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('cakes')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'cakes'
                      ? 'bg-white text-chocolate shadow-sm'
                      : 'text-gray-600 hover:text-chocolate'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Gerenciar Bolos</span>
                </button>
              </div>
            </div>

            {/* Conteúdo da Aba Dashboard */}
            {activeTab === 'dashboard' && (
              <>
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
              <div className="grid md:grid-cols-3 gap-4">
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
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Bolo</span>
                </button>
                <div className="relative">
                  <button 
                    onClick={handleExportData}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Dados</span>
                  </button>
                  
                  {/* Menu de Exportação */}
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b">
                          Exportar PDF
                        </div>
                        <button
                          onClick={() => handleExportPDF('orders')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Relatório de Pedidos</span>
                        </button>
                        <button
                          onClick={() => handleExportPDF('cakes')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Catálogo de Bolos</span>
                        </button>
                        <button
                          onClick={() => handleExportPDF('complete')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Relatório Completo</span>
                        </button>
                        
                        <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-t mt-2">
                          Exportar Excel
                        </div>
                        <button
                          onClick={() => handleExportExcel('orders')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Dados de Pedidos</span>
                        </button>
                        <button
                          onClick={() => handleExportExcel('cakes')}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Dados de Bolos</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
                <button 
                  onClick={() => window.open('/cardapio', '_blank')}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Catálogo</span>
                </button>
                <button 
                  onClick={() => setShowResetModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg w-full flex items-center justify-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset Encomendas</span>
                </button>
              </div>
            </div>

            {/* Modal de Confirmação de Reset */}
            {showResetModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowResetModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="font-dancing text-2xl text-chocolate mb-4">
                      Confirmar Reset
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Esta ação irá <strong>remover permanentemente</strong> todas as encomendas do sistema. 
                      Esta operação não pode ser desfeita.
                    </p>
                    <p className="text-sm text-red-600 mb-6">
                      ⚠️ Certifique-se de ter exportado os dados importantes antes de continuar.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleResetOrders}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Removendo...' : 'Confirmar Reset'}
                      </button>
                      <button
                        onClick={() => setShowResetModal(false)}
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
                    <input
                      type="url"
                      placeholder="URL da imagem (opcional)"
                      value={newCake.image}
                      onChange={(e) => setNewCake({...newCake, image: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <select
                      value={newCake.category}
                      onChange={(e) => setNewCake({...newCake, category: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    >
                      <option value="bolos">Bolos</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="frutas">Frutas</option>
                      <option value="especiais">Especiais</option>
                      <option value="tradicionais">Tradicionais</option>
                      <option value="tropical">Tropical</option>
                    </select>
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

            {/* Modal de Editar Bolo */}
            {showEditModal && editingCake && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowEditModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-dancing text-2xl text-chocolate mb-4">
                    Editar Bolo
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome do bolo"
                      value={editingCake.name}
                      onChange={(e) => setEditingCake({...editingCake, name: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <input
                      type="number"
                      placeholder="Preço (€)"
                      value={editingCake.price}
                      onChange={(e) => setEditingCake({...editingCake, price: e.target.value})}
                      step="0.01"
                      min="0"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <input
                      type="url"
                      placeholder="URL da imagem (opcional)"
                      value={editingCake.image || ''}
                      onChange={(e) => setEditingCake({...editingCake, image: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <select
                      value={editingCake.category || 'bolos'}
                      onChange={(e) => setEditingCake({...editingCake, category: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    >
                      <option value="bolos">Bolos</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="frutas">Frutas</option>
                      <option value="especiais">Especiais</option>
                      <option value="tradicionais">Tradicionais</option>
                      <option value="tropical">Tropical</option>
                    </select>
                    <textarea
                      placeholder="Descrição"
                      value={editingCake.description || ''}
                      onChange={(e) => setEditingCake({...editingCake, description: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
                    />
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="available"
                        checked={editingCake.available}
                        onChange={(e) => setEditingCake({...editingCake, available: e.target.checked})}
                        className="w-4 h-4 text-rose-gold focus:ring-rose-gold border-gray-300 rounded"
                      />
                      <label htmlFor="available" className="text-sm font-medium text-gray-700">
                        Disponível para venda
                      </label>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateCake}
                        disabled={loading || !editingCake.name || !editingCake.price}
                        className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowEditModal(false)
                          setEditingCake(null)
                        }}
                        disabled={loading}
                        className="btn-secondary flex-1 disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
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
              </>
            )}

            {/* Conteúdo da Aba Gerenciar Bolos */}
            {activeTab === 'cakes' && (
              <div className="space-y-6">
                {/* Cabeçalho da seção */}
                <div className="flex justify-between items-center">
                  <h2 className="font-dancing text-3xl text-chocolate">
                    Gerenciar Bolos
                  </h2>
                  <button
                    onClick={handleAddCake}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Bolo</span>
                  </button>
                </div>

                {/* Lista de Bolos */}
                <div className="grid gap-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-rose-gold" />
                      <p className="text-gray-600">Carregando bolos...</p>
                    </div>
                  ) : cakes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎂</div>
                      <h3 className="text-xl font-semibold text-chocolate mb-2">
                        Nenhum bolo cadastrado
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Adicione seu primeiro bolo ao catálogo
                      </p>
                      <button
                        onClick={handleAddCake}
                        className="btn-primary"
                      >
                        Adicionar Primeiro Bolo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cakes.map((cake: any, index: number) => (
                        <motion.div
                          key={cake.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            {/* Imagem do bolo */}
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {cake.image ? (
                                <img
                                  src={cake.image}
                                  alt={cake.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : null}
                              <div className="text-2xl">🎂</div>
                            </div>

                            {/* Informações do bolo */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-chocolate text-lg">
                                    {cake.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {cake.description}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <span className="font-bold text-rose-gold">
                                      € {typeof cake.price === 'number' ? cake.price.toFixed(2) : cake.price}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Categoria: {cake.category}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      cake.available 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {cake.available ? 'Disponível' : 'Indisponível'}
                                    </span>
                                  </div>
                                </div>

                                {/* Botões de ação */}
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditCake(cake)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar bolo"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCake(cake.id, cake.name)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remover bolo"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Estatísticas dos bolos */}
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  <div className="card p-4 text-center">
                    <div className="text-2xl mb-2">🎂</div>
                    <h3 className="font-semibold text-chocolate">Total de Bolos</h3>
                    <p className="text-2xl font-bold text-rose-gold">{cakes.length}</p>
                  </div>
                  <div className="card p-4 text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <h3 className="font-semibold text-chocolate">Disponíveis</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {cakes.filter(cake => cake.available).length}
                    </p>
                  </div>
                  <div className="card p-4 text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <h3 className="font-semibold text-chocolate">Preço Médio</h3>
                    <p className="text-2xl font-bold text-rose-gold">
                      € {cakes.length > 0 
                        ? (cakes.reduce((sum, cake) => sum + (typeof cake.price === 'number' ? cake.price : parseFloat(cake.price) || 0), 0) / cakes.length).toFixed(2)
                        : '0,00'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
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