import { Star, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'

interface Cake {
  id: number
  name: string
  description: string
  price: string
  image: string
  rating: number
}

interface CakeCardProps {
  cake: Cake
}

const CakeCard = ({ cake }: CakeCardProps) => {
  const { openModal } = useCart()

  const handleAddToCart = () => {
    openModal(cake)
  }

  return (
    <motion.div 
      className="card p-0 overflow-hidden group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagem do Bolo */}
      <div className="relative h-48 bg-gradient-to-br from-rose-gold to-strawberry rounded-t-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎂</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium ml-1">{cake.rating}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-chocolate mb-2">
          {cake.name}
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          {cake.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-rose-gold">
            {cake.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-rose-gold hover:bg-rose-gold/80 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CakeCard 