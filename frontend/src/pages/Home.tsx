import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Star, ChefHat, Clock } from 'lucide-react'
import Header from '../components/Header'
import CakeCard from '../components/CakeCard'

const Home = () => {
  const featuredCakes = [
    {
      id: 1,
      name: "Bolo de Chocolate Especial",
      description: "Delicioso bolo de chocolate com cobertura cremosa",
      price: "€ 25,00",
      image: "/images/chocolate-cake.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Bolo de Morango",
      description: "Bolo fofinho com morangos frescos e chantilly",
      price: "€ 23,00",
      image: "/images/strawberry-cake.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Bolo de Cenoura",
      description: "Tradicional bolo de cenoura com cobertura de chocolate",
      price: "€ 21,00",
      image: "/images/carrot-cake.jpg",
      rating: 4
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="title-fancy mb-6">
              Maria Gulosa
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Transformando momentos especiais em memórias doces desde 2020. 
              Nossos bolos artesanais são feitos com amor e os melhores ingredientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cardapio" className="btn-primary">
                Ver Cardápio Completo
              </Link>
              <a 
                href="https://wa.me/351914019142?text=Olá! Gostaria de fazer um pedido" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Fazer Pedido
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-dancing text-chocolate text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Por que escolher a Maria Gulosa?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Feito com Amor", desc: "Cada bolo é preparado com carinho e dedicação" },
              { icon: Star, title: "Qualidade Premium", desc: "Ingredientes selecionados e receitas exclusivas" },
              { icon: ChefHat, title: "Receitas Artesanais", desc: "Técnicas tradicionais com toques modernos" },
              { icon: Clock, title: "Entrega Rápida", desc: "Freshinho para você em até 24h" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <item.icon className="w-12 h-12 text-rose-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-chocolate mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bolos em Destaque */}
      <section className="py-16 px-4 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-dancing text-chocolate text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Nossos Queridinhos
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCakes.map((cake, index) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CakeCard cake={cake} />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/cardapio" className="btn-primary">
              Ver Todos os Bolos
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-dancing text-chocolate text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            O que nossos clientes dizem
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Ana Silva",
                text: "O bolo de aniversário da minha filha foi simplesmente perfeito! Super recomendo a Maria Gulosa!",
                rating: 5
              },
              {
                name: "Carlos Santos",
                text: "Encomendei um bolo de chocolate para o casamento e todos os convidados elogiaram. Delicioso!",
                rating: 5
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                className="card p-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <p className="font-semibold text-chocolate">- {review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 