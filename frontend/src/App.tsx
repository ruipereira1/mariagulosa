import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Admin from './pages/Admin'
import SocialLinks from './components/SocialLinks'
import CartSummary from './components/CartSummary'
import GlobalModal from './components/GlobalModal'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cardapio" element={<Catalog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <SocialLinks />
          <CartSummary />
          <GlobalModal />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
