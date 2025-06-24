import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import shoppingCart from "../assets/shopping-cart.svg"
import CartSidebar from "./shopping-car"

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
  image: string
}

export default function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
    console.log("Cerrando sesión...")
  }


  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand - Izquierda */}
            <div className="flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">
                Food<span className="text-cyan-500">App</span>
              </h2>
            </div>

            {/* Enlaces centrales - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className="text-cyan-500 hover:text-cyan-600 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 hover:bg-cyan-50"
              >
                Home
              </Link>
              <Link
                to="/bills"
                className="text-cyan-500 hover:text-cyan-600 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 hover:bg-cyan-50"
              >
                Bills
              </Link>
              <Link
                to="/profile"
                className="text-cyan-500 hover:text-cyan-600 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 hover:bg-cyan-50"
              >
                Profile
              </Link>
            </div>

            {/* Carrito y Logout - Derecha Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Botón circular del carrito */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <img src={shoppingCart} alt="Carrito" className="w-6 h-6" />
                {/* Badge con número de items */}
                
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>

            {/* Botón hamburguesa - Mobile */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Carrito móvil */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 10-4 0v5.01"
                  />
                </svg>
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
                <a
                  href="#bills"
                  className="text-cyan-500 hover:text-cyan-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bills
                </a>
                <a
                  href="#profile"
                  className="text-cyan-500 hover:text-cyan-600 block px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </a>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200 mt-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  )
}
