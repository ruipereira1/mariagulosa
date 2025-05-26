import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const GlobalModal = () => {
  const [quantity, setQuantity] = useState(1)
  const { selectedCake, isModalOpen, closeModal, addItem } = useCart()

  if (!selectedCake) return null

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedCake.id,
        name: selectedCake.name,
        price: selectedCake.price,
        image: selectedCake.image
      })
    }
    
    // Reset quantity and close modal
    setQuantity(1)
    closeModal()
    
    // Show success message (seria melhor usar toast, mas este modal será removido em favor do AddToCartModal)
    // alert(`${selectedCake.name} adicionado à encomenda! 🎂`)
  }

  const handleClose = () => {
    setQuantity(1)
    closeModal()
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const totalPrice = parseFloat(selectedCake.price.replace(/[€\s]/g, '').replace(',', '.')) * quantity

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br from-rose-gold to-strawberry">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🎂</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-chocolate mb-2">
                {selectedCake.name}
              </h3>
              
              <p className="text-gray-600 mb-4 text-sm">
                {selectedCake.description}
              </p>

              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-rose-gold">
                  {selectedCake.price}
                </span>
                <div className="flex items-center">
                  {[...Array(selectedCake.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={decrementQuantity}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="text-2xl font-bold text-chocolate min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={incrementQuantity}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-soft-pink/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="text-2xl font-bold text-rose-gold">
                    € {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GlobalModal 