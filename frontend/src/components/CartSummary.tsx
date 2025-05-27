import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus, MessageCircle, Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { API_ENDPOINTS } from '../config/api'
import { CONTACTS } from '../config/contacts'
import { useToast } from '../hooks/useToast'
import Toast from './Toast'

const CartSummary = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toasts, showToast, hideToast } = useToast()
  const { 
    items, 
    getTotalItems, 
    getTotalPrice, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getWhatsAppMessage 
  } = useCart()

  const handleSendToWhatsApp = async () => {
    if (isLoading) return // Previne múltiplos cliques
    
    setIsLoading(true)
    try {
      const message = getWhatsAppMessage()
      
      // Preparar dados do pedido para o backend
      const orderData = {
        items: items.map(item => ({
          cakeName: item.name,
          quantity: item.quantity,
          unitPrice: parseFloat(String(item.price).replace(/[€\s]/g, '').replace(',', '.')),
          subtotal: parseFloat(String(item.price).replace(/[€\s]/g, '').replace(',', '.')) * item.quantity
        })),
        customerInfo: {
          phone: CONTACTS.whatsapp.number
        },
        whatsappMessage: message,
        notes: "Pedido feito através do site"
      }
      
      // Salvar pedido no backend
      const response = await fetch(API_ENDPOINTS.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Pedido salvo no banco:', result.order?.orderNumber)
        
        // Abrir WhatsApp
        const whatsappUrl = `${CONTACTS.whatsapp.url}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        
        // Mostrar sucesso
        showToast(`🎉 Pedido ${result.order?.orderNumber || ''} criado com sucesso! Redirecionando para WhatsApp...`, 'success')
        
        // Limpar carrinho após enviar
        clearCart()
        setIsOpen(false)
      } else {
        console.error('❌ Erro ao salvar pedido:', result.error)
        
        // Mesmo com erro no backend, ainda permite enviar WhatsApp
        const whatsappUrl = `${CONTACTS.whatsapp.url}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        
        showToast('⚠️ Pedido enviado para WhatsApp, mas houve um problema ao salvar no sistema.', 'warning')
        
        clearCart()
        setIsOpen(false)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
      
      // Em caso de erro, ainda permite enviar WhatsApp
      const message = getWhatsAppMessage()
      const whatsappUrl = `${CONTACTS.whatsapp.url}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      
      showToast('⚠️ Pedido enviado para WhatsApp, mas houve um problema de conexão.', 'error')
      
      clearCart()
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const totalItems = getTotalItems()

  return (
    <>
      {/* Botão do Carrinho */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 bottom-6 bg-rose-gold hover:bg-rose-gold/80 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 ${
          totalItems > 0 ? 'scale-110' : ''
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.button>

      {/* Modal do Carrinho */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-gold to-strawberry text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Minha Encomenda</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {totalItems > 0 && (
                  <p className="text-white/80 mt-2">
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'} na encomenda
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col h-full max-h-[60vh]">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-chocolate mb-2">
                      Carrinho vazio
                    </h3>
                    <p className="text-gray-600">
                      Adicione alguns bolos deliciosos à sua encomenda!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-chocolate">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-rose-gold font-semibold">
                              {item.price}
                            </span>
                            
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-white hover:bg-gray-100 text-gray-700 p-1 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="font-bold text-chocolate min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-white hover:bg-gray-100 text-gray-700 p-1 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t bg-gray-50 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-chocolate">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-rose-gold">
                          € {getTotalPrice().toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={clearCart}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          Limpar
                        </button>
                        
                        <button
                          onClick={handleSendToWhatsApp}
                          disabled={isLoading}
                          className="flex-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-5 h-5" />
                              <span>Enviar Encomenda</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  )
}

export default CartSummary 