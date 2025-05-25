import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import Header from '../components/Header'
import CakeCard from '../components/CakeCard'

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const categories = [
    { id: 'todos', name: 'Todos os Bolos' },
    { id: 'chocolate', name: 'Chocolate' },
    { id: 'frutas', name: 'Frutas' },
    { id: 'tradicionais', name: 'Tradicionais' },
    { id: 'especiais', name: 'Especiais' }
  ]

  const allCakes = [
    {
      id: 1,
      name: "Bolo de Chocolate Especial",
      description: "Delicioso bolo de chocolate com cobertura cremosa e raspas de chocolate",
      price: "€ 25,00",
      image: "/images/chocolate-cake.jpg",
      rating: 5,
      category: 'chocolate'
    },
    {
      id: 2,
      name: "Bolo de Morango",
      description: "Bolo fofinho com morangos frescos e chantilly",
      price: "€ 23,00",
      image: "/images/strawberry-cake.jpg",
      rating: 5,
      category: 'frutas'
    },
    {
      id: 3,
      name: "Bolo de Cenoura",
      description: "Tradicional bolo de cenoura com cobertura de chocolate",
      price: "€ 21,00",
      image: "/images/carrot-cake.jpg",
      rating: 4,
      category: 'tradicionais'
    },
    {
      id: 4,
      name: "Bolo Red Velvet",
      description: "Bolo aveludado vermelho com cream cheese",
      price: "€ 27,00",
      image: "/images/red-velvet.jpg",
      rating: 5,
      category: 'especiais'
    },
    {
      id: 5,
      name: "Bolo de Limão",
      description: "Refrescante bolo de limão com cobertura de merengue",
      price: "€ 22,00",
      image: "/images/lemon-cake.jpg",
      rating: 4,
      category: 'frutas'
    },
    {
      id: 6,
      name: "Bolo Brigadeiro",
      description: "Bolo de chocolate recheado com brigadeiro gourmet",
      price: "€ 26,00",
      image: "/images/brigadeiro-cake.jpg",
      rating: 5,
      category: 'chocolate'
    },
    {
      id: 7,
      name: "Bolo de Fubá",
      description: "Tradicional bolo de fubá com erva-doce",
      price: "€ 19,00",
      image: "/images/fuba-cake.jpg",
      rating: 4,
      category: 'tradicionais'
    },
    {
      id: 8,
      name: "Bolo Floresta Negra",
      description: "Bolo de chocolate com cerejas e chantilly",
      price: "€ 29,00",
      image: "/images/black-forest.jpg",
      rating: 5,
      category: 'especiais'
    }
  ]

  const filteredCakes = allCakes.filter(cake => {
    const matchesSearch = cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cake.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'todos' || cake.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="title-fancy mb-4">
              Nosso Cardápio
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Descubra nossa seleção especial de bolos artesanais, 
              cada um preparado com ingredientes selecionados e muito amor.
            </p>
          </motion.div>

          {/* Filtros */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Busca */}
              <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar bolos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-rose-gold transition-all"
                />
              </div>

              {/* Categorias */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="text-gray-500 w-5 h-5" />
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-rose-gold text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de Bolos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCakes.map((cake, index) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CakeCard cake={cake} />
              </motion.div>
            ))}
          </div>

          {/* Mensagem quando não há resultados */}
          {filteredCakes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🎂</div>
              <h3 className="text-2xl font-semibold text-chocolate mb-2">
                Nenhum bolo encontrado
              </h3>
              <p className="text-gray-600">
                Tente buscar por outro termo ou categoria
              </p>
            </motion.div>
          )}

          {/* Chamada para ação */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16 p-8 bg-gradient-to-r from-rose-gold/10 to-strawberry/10 rounded-2xl"
          >
            <h3 className="text-2xl md:text-3xl font-dancing text-chocolate mb-4">
              Não encontrou o que procura?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Fazemos bolos personalizados para ocasiões especiais! 
              Entre em contato conosco e vamos criar algo único para você.
            </p>
            <a 
              href="https://wa.me/351914019142?text=Olá! Gostaria de encomendar um bolo personalizado" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Solicitar Bolo Personalizado
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Catalog 