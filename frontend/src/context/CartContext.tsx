import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: number
  name: string
  price: string
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getWhatsAppMessage: () => string
  // Modal management
  selectedCake: any | null
  isModalOpen: boolean
  openModal: (cake: any) => void
  closeModal: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedCake, setSelectedCake] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (cake: any) => {
    setSelectedCake(cake)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedCake(null)
    setIsModalOpen(false)
  }

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Se é um novo item, adiciona com quantidade 1
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[€\s]/g, '').replace(',', '.'))
      return total + (price * item.quantity)
    }, 0)
  }

  const getWhatsAppMessage = () => {
    if (items.length === 0) return 'Olá! Gostaria de fazer um pedido'
    
    let message = 'Olá! Gostaria de fazer a seguinte encomenda:\n\n'
    
    items.forEach(item => {
      message += `🎂 ${item.name}\n`
      message += `   Quantidade: ${item.quantity}\n`
      message += `   Preço unitário: ${item.price}\n`
      message += `   Subtotal: € ${(parseFloat(item.price.replace(/[€\s]/g, '').replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}\n\n`
    })
    
    message += `💰 Total: € ${getTotalPrice().toFixed(2).replace('.', ',')}\n\n`
    message += 'Obrigado!'
    
    return message
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getWhatsAppMessage,
    selectedCake,
    isModalOpen,
    openModal,
    closeModal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
} 