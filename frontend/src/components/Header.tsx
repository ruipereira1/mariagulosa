import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Cake } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Cake className="w-8 h-8 text-rose-gold" />
            <span className="font-dancing text-2xl md:text-3xl text-chocolate">
              Maria Gulosa
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-rose-gold transition-colors duration-300 font-medium"
            >
              Início
            </Link>
            <Link 
              to="/cardapio" 
              className="text-gray-700 hover:text-rose-gold transition-colors duration-300 font-medium"
            >
              Cardápio
            </Link>
            <a 
              href="https://wa.me/351914019142?text=Olá! Gostaria de fazer um pedido" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-rose-gold transition-colors duration-300 font-medium"
            >
              Contato
            </a>
          </nav>

          {/* Botão WhatsApp Desktop */}
          <a 
            href="https://wa.me/351914019142?text=Olá! Gostaria de fazer um pedido" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline-block btn-primary"
          >
            Fazer Pedido
          </a>

          {/* Menu Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-rose-gold transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-rose-gold transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/cardapio" 
                className="text-gray-700 hover:text-rose-gold transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Cardápio
              </Link>
              <a 
                href="https://wa.me/351914019142?text=Olá! Gostaria de fazer um pedido" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Fazer Pedido
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header 