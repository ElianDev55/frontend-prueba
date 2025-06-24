"use client"

import type React from "react"
import { useState } from "react"
import Swal from "sweetalert2"
import { useGetAdditionalProducts } from "../hooks/useAdditionalProducts"
import { usePostBill } from "../hooks/useBills"
import { usePostBillDetails } from "../hooks/useBills-details"
import { useGetChips } from "../hooks/useChips"
import { useGetDishes } from "../hooks/useDishes"
import { useGetDrinks } from "../hooks/useDrinks"
import { useGetSauces } from "../hooks/useSauces"
import { transformJson } from "../lib/transform-json"

// Interfaces dentro del componente
interface CartItem {
  id: string
  name: string
  price: string
  image?: string
  quantity: number
  category: "dishes" | "additional" | "chips" | "drinks" | "sauces"
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { dishes, loading: dishesLoading } = useGetDishes()
  const { additionalProducts, loading: additionalProductsLoading } = useGetAdditionalProducts()
  const { chips, loading: chipsLoading } = useGetChips()
  const { drinks, loading: drinksLoading } = useGetDrinks()
  const { sauces, loading: saucesLoading } = useGetSauces()
  const [cart, setCart] = useState<CartItem[]>([])
  const { postBill } = usePostBill()
  const { postBillDetails } = usePostBillDetails()
  const totalDishes = cart.filter((item) => item.category === "dishes").reduce((total, item) => total + item.quantity, 0)
  const totalAdditionals = cart
    .filter((item) => item.category === "additional")
    .reduce((total, item) => total + item.quantity, 0)
  const totalSauces = cart.filter((item) => item.category === "sauces").reduce((total, item) => total + item.quantity, 0)

  const maxAdditionals = totalDishes * 3
  const maxSauces = totalDishes * 2

  // Estados para controlar qué acordeones están abiertos
  const [openSections, setOpenSections] = useState({
    dishes: false,
    additional: false,
    chips: false,
    drinks: false,
    sauces: false,
  })
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return numPrice === 0 ? "FREE" : `$${numPrice.toFixed(2)}`
  }

  const getItemQuantity = (id: string, category: CartItem["category"]) => {
    const item = cart.find((item) => item.id === id && item.category === category)
    return item ? item.quantity : 0
  }

  const updateQuantity = (
    id: string,
    name: string,
    price: string,
    category: CartItem["category"],
    quantity: number,
    image?: string,
  ) => {
    setCart((prevCart) => {
      const currentQuantity =
        prevCart.find((item) => item.id === id && item.category === category)?.quantity || 0

      if (quantity > currentQuantity) {
        if (totalDishes === 0 && (category === "additional" || category === "sauces")) {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Debes agregar al menos un plato principal para añadir adicionales o salsas.",
            timer: 2000,
            showConfirmButton: false,
          })
          return prevCart
        }

        if (category === "additional" && totalAdditionals >= maxAdditionals) {
          Swal.fire({
            icon: "warning",
            title: "Límite alcanzado",
            text: `Solo puedes agregar hasta ${maxAdditionals} adicionales con ${totalDishes} plato(s).`,
            timer: 2000,
            showConfirmButton: false,
          })
          return prevCart
        }

        if (category === "sauces" && totalSauces >= maxSauces) {
          Swal.fire({
            icon: "warning",
            title: "Límite alcanzado",
            text: `Solo puedes agregar hasta ${maxSauces} salsas con ${totalDishes} plato(s).`,
            timer: 2000,
            showConfirmButton: false,
          })
          return prevCart
        }
      }

      const existingItemIndex = prevCart.findIndex((item) => item.id === id && item.category === category)

      if (quantity === 0) {
        return prevCart.filter((item) => !(item.id === id && item.category === category))
      }

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart]
        newCart[existingItemIndex].quantity = quantity
        return newCart
      } else {
        return [...prevCart, { id, name, price, image, quantity, category }]
      }
    })
  }

  const removeItem = (id: string, category: CartItem["category"]) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.category === category)))
  }

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => {
        return total + Number.parseFloat(item.price) * item.quantity
      }, 0)
      .toFixed(2)
  }

  const handleCheckout = () => {
    const checkoutCategories: { [key: string]: Array<{ id: string; price: string }> } = {}

    cart.forEach((item) => {
      if (!checkoutCategories[item.category]) {
        checkoutCategories[item.category] = []
      }
      for (let i = 0; i < item.quantity; i++) {
        checkoutCategories[item.category].push({ id: item.id, price: item.price })
      }
    })

    const checkoutData = {
      ...checkoutCategories,
      total: getTotalPrice(),
    }

    const data = transformJson(checkoutData);
    postBill(data.bill).then(async (response) => {
      const billId = response?.data?.id;
      const details = data.details;
      // Use fetch directly to post each detail, since postBillDetails is not available here
      for (const detail of details) {
        detail.bill_id = billId;
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/bill-details`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(detail),
          });
        } catch (err) {
          // Optionally handle error here
          console.error('Error posting bill detail:', err);
        }
      }
    });

    console.log(data, 'data');


    Swal.fire({
      title: "¡Pedido listo para procesar!",
      html: "<p>Los datos de tu carrito se han registrado en la consola con el formato solicitado.</p>",
      icon: "success",
      confirmButtonText: "Entendido",
    })
    onClose();
  }

  const ProductCounter = ({
    id,
    name,
    price,
    category,
    image,
  }: {
    id: string
    name: string
    price: string
    category: CartItem["category"]
    image?: string
  }) => {
    const quantity = getItemQuantity(id, category)
    const isAddButtonDisabled =
      (category === "additional" && totalAdditionals >= maxAdditionals) ||
      (category === "sauces" && totalSauces >= maxSauces) ||
      (totalDishes === 0 && (category === "additional" || category === "sauces"))

    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(id, name, price, category, Math.max(0, quantity - 1), image)}
          className="w-7 h-7 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors text-sm font-bold disabled:opacity-50"
          disabled={quantity === 0}
        >
          −
        </button>
        <span className="w-6 text-center font-medium text-sm">{quantity}</span>
        <button
          onClick={() => updateQuantity(id, name, price, category, quantity + 1, image)}
          className="w-7 h-7 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAddButtonDisabled}
        >
          +
        </button>
      </div>
    )
  }

  const AccordionSection = ({
    title,
    emoji,
    count,
    isOpen,
    onToggle,
    children,
  }: {
    title: string
    emoji: string
    count: number
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{emoji}</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">{count} disponibles</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="px-4 pb-3">{children}</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0  bg-opacity-50 z-40 transition-opacity" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Mi Carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Selected Items Section */}
          {cart.length > 0 && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Items Seleccionados</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.category}`} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                            <p className="text-cyan-600 font-bold text-sm">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ProductCounter
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            category={item.category}
                            image={item.image}
                          />
                          <button
                            onClick={() => removeItem(item.id, item.category)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1 overflow-y-auto p-4">
            {dishesLoading || additionalProductsLoading || chipsLoading || drinksLoading || saucesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Dishes */}
                <AccordionSection
                  title="Platos Principales"
                  emoji="🍽️"
                  count={dishes.data.length}
                  isOpen={openSections.dishes}
                  onToggle={() => toggleSection("dishes")}
                >
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {dishes.data.map((dish) => (
                      <div key={dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={dish.image || "/placeholder.svg"}
                            alt={dish.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{dish.name}</h4>
                            <p className="text-cyan-600 font-bold text-sm">{formatPrice(dish.price)}</p>
                          </div>
                        </div>
                        <ProductCounter
                          id={dish.id}
                          name={dish.name}
                          price={dish.price}
                          category="dishes"
                          image={dish.image}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Additional Products */}
                <AccordionSection
                  title="Adicionales"
                  emoji="➕"
                  count={additionalProducts.data.length}
                  isOpen={openSections.additional}
                  onToggle={() => toggleSection("additional")}
                >
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {additionalProducts.data.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                          <p className="text-cyan-600 font-bold text-sm">{formatPrice(product.price)}</p>
                        </div>
                        <ProductCounter
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          category="additional"
                        />
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Chips */}
                <AccordionSection
                  title="Acompañamientos"
                  emoji="🍟"
                  count={chips.data.length}
                  isOpen={openSections.chips}
                  onToggle={() => toggleSection("chips")}
                >
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {chips.data.map((chip) => (
                      <div key={chip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={chip.image || "/placeholder.svg"}
                            alt={chip.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{chip.name}</h4>
                            <p className="text-cyan-600 font-bold text-sm">{formatPrice(chip.price)}</p>
                          </div>
                        </div>
                        <ProductCounter
                          id={chip.id}
                          name={chip.name}
                          price={chip.price}
                          category="chips"
                          image={chip.image}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Drinks */}
                <AccordionSection
                  title="Bebidas"
                  emoji="🥤"
                  count={drinks.data.length}
                  isOpen={openSections.drinks}
                  onToggle={() => toggleSection("drinks")}
                >
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {drinks.data.map((drink) => (
                      <div key={drink.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={drink.image || "/placeholder.svg"}
                            alt={drink.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{drink.name}</h4>
                            <p className="text-cyan-600 font-bold text-sm">{formatPrice(drink.price)}</p>
                          </div>
                        </div>
                        <ProductCounter
                          id={drink.id}
                          name={drink.name}
                          price={drink.price}
                          category="drinks"
                          image={drink.image}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* Sauces */}
                <AccordionSection
                  title="Salsas"
                  emoji="🍅"
                  count={sauces.data.length}
                  isOpen={openSections.sauces}
                  onToggle={() => toggleSection("sauces")}
                >
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {sauces.data.map((sauce) => (
                      <div key={sauce.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={sauce.image || "/placeholder.svg"}
                            alt={sauce.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{sauce.name}</h4>
                            <p className="text-cyan-600 font-bold text-sm">{formatPrice(sauce.price)}</p>
                          </div>
                        </div>
                        <ProductCounter
                          id={sauce.id}
                          name={sauce.name}
                          price={sauce.price}
                          category="sauces"
                          image={sauce.image}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}
          </div>
        </div>

        {/* Total y Checkout */}
        {cart.length > 0 && (
          <div className="p-1 bg-white border-t border-gray-200 flex-shrink-0">
            <div className="bg-cyan-500 text-white p-3 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold">Total:</span>
                <span className="text-xl font-bold">${getTotalPrice()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-white text-cyan-500 py-2 rounded-lg font-bold text-base hover:bg-gray-50 transition-colors"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
