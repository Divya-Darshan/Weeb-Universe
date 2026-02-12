// components/product/cart.tsx
//hello from payment gateway integration branch
//didi nothing today

'use client'
import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Image, ImageKitProvider } from '@imagekit/next'

interface CartItem {
  id: number
  name: string
  price: number
  image_name_front: string
  quantity: number
}

// FIXED: Global cart context - LIVE SYNC
if (typeof window !== 'undefined') {
  if (!window.cartContext) {
    window.cartContext = {
      cartItems: JSON.parse(localStorage.getItem('weeb_cart') || '[]'),
      addToCart: (product: any, quantity: number) => {
        const existingItems = JSON.parse(localStorage.getItem('weeb_cart') || '[]')
        const existingItem = existingItems.find((item: CartItem) => item.id === product.id)
        
        let newItems
        if (existingItem) {
          newItems = existingItems.map((item: CartItem) =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          newItems = [...existingItems, {
            id: product.id,
            name: product.name,
            price: product.price,
            image_name_front: product.image_name_front,
            quantity
          }]
        }
        
        localStorage.setItem('weeb_cart', JSON.stringify(newItems))
        window.cartContext.cartItems = newItems
        
        window.dispatchEvent(new CustomEvent('cartUpdated'))
      }
    }
  }
}

export default function CartComponent() {
  const [open, setOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [tab, setTab] = useState<'cart' | 'checkout'>('cart')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    phone: '',
    paymentMethod: 'card'
  })


  const updateCartItems = useCallback(() => {
    const savedCart = localStorage.getItem('weeb_cart')
    if (savedCart) {
      const parsedItems = JSON.parse(savedCart)
      setCartItems(parsedItems)
    }
  }, [])

  useEffect(() => {
    updateCartItems()
    window.addEventListener('cartUpdated', updateCartItems)
    const handleStorageChange = () => updateCartItems()
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartItems)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [updateCartItems])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = total
  const shipping = cartItems.length > 0 ? 30 : 0
  const taxes = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + shipping + taxes

  const removeItem = (id: number) => {
    const newItems = cartItems.filter(item => item.id !== id)
    setCartItems(newItems)
    localStorage.setItem('weeb_cart', JSON.stringify(newItems))
    window.cartContext.cartItems = newItems
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    const newItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(newItems)
    localStorage.setItem('weeb_cart', JSON.stringify(newItems))
    window.cartContext.cartItems = newItems
  }

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setTab('checkout')
    }
  }

const handleConfirmOrder = () => {
  if (formData.email && formData.firstName && formData.phone && formData.pincode && formData.state) {
    alert(`Order confirmed! Total: ₹${grandTotal.toLocaleString('en-IN')}\nEmail: ${formData.email}`)
    localStorage.removeItem('weeb_cart')
    window.cartContext.cartItems = []
    setCartItems([])
    setTab('cart')
    setFormData({ email: '', firstName: '', lastName: '', address: '', city: '', pincode: '', state: '', phone: '', paymentMethod: 'card' })
  } else {
    alert('Please fill required fields: Email, Name, Phone, Pincode, State')
  }
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-1 relative"
        title="Shopping cart"
      >
        <ShoppingBagIcon className="size-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
        <span className="sr-only">Open cart ({cartCount} items)</span>
      </button>
      
      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
        <Dialog open={open} onClose={setOpen} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/50 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
          />
          <div className="fixed inset-0 overflow-hidden z-50">
            <div className="absolute inset-0 overflow-hidden z-50">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16 z-50">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-md h-screen transform transition-all duration-500 ease-in-out data-closed:translate-x-full sm:duration-700 shadow-2xl z-50"
                >
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-2xl z-50">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                          {tab === 'cart' ? `Shopping cart (${cartCount} items)` : 'Checkout'}
                        </DialogTitle>
                        <button
                          type="button"
                          onClick={() => tab === 'checkout' ? setTab('cart') : setOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">{tab === 'checkout' ? 'Back to cart' : 'Close panel'}</span>
                          <XMarkIcon className="size-6" />
                        </button>
                      </div>

                      <div className="mt-8">
                        {cartItems.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                            <p className="mt-1 text-sm text-gray-500">Add items to get started.</p>
                          </div>
                        ) : (
                          tab === 'cart' && (
                            <div className="flow-root">
                              <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {cartItems.map((product) => (
                                  <li key={product.id} className="flex py-6">
                                    <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image 
                                        src={product.image_name_front}
                                        width={96}
                                        height={96}
                                        alt={product.name}
                                        className="size-full object-cover object-center"
                                      />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>{product.name}</h3>
                                          <p className="ml-4">₹{product.price}</p>
                                        </div>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                            className="p-1 text-gray-500 hover:text-gray-700"
                                          >
                                            <MinusIcon className="size-5" />
                                          </button>
                                          <span className="w-8 text-center font-semibold">{product.quantity}</span>
                                          <button
                                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                            className="p-1 text-gray-500 hover:text-gray-700"
                                          >
                                            <PlusIcon className="size-5" />
                                          </button>
                                        </div>
                                        <button
                                          onClick={() => removeItem(product.id)}
                                          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                                        >
                                          <TrashIcon className="size-4" />
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* 🔥 PRODUCTION CHECKOUT SYSTEM */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {tab === 'cart' ? (
                          <>
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                              <p>Subtotal</p>
                              <p>₹{total.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</div>
                            <button 
                              onClick={handleCheckout}
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] mb-4"
                            >
                              Proceed to Checkout
                            </button>
                            <div className="flex justify-center text-center text-sm text-gray-500">
                              <p>or <button onClick={() => setOpen(false)} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">Continue Shopping →</button></p>
                            </div>
                          </>
                        ) : (

                          //checkout form section
                          
<div className="space-y-6">


  {/* Shipping Info */}
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-bold mb-6 text-gray-900">Shipping Address & Information</h3>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <input 
        name="firstName"
        placeholder="First name *"
        value={formData.firstName}
        onChange={handleInputChange}
        className="h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />
      <input 
        name="lastName"
        placeholder="Last name"
        value={formData.lastName}
        onChange={handleInputChange}
        className="h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />
    </div>
     <input 
        name="email"
        placeholder="Email address *"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full h-12 mb-4 px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />
     
    <input 
      name="address"
      placeholder="Street address"
      value={formData.address}
      onChange={handleInputChange}
      className="w-full h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500 mb-4"
    />
    <div className="grid grid-cols-2 gap-4">

      <input 
        name="state"
        placeholder="State *"
        value={formData.state}
        onChange={handleInputChange}
        className="h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />


      <input 
        name="city"
        placeholder="City *"
        value={formData.city}
        onChange={handleInputChange}
        className="h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />
      <input 
        name="pincode"
        placeholder="Pincode *"                    
        value={formData.pincode}
        onChange={handleInputChange}
        className="h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />
      <input 
        name="phone"
        placeholder="Phone *"
        value={formData.phone}
        type='phone'
        onChange={handleInputChange}
        className="h-12 px-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200 text-sm font-medium placeholder-gray-500"
      />
    </div>
  </div>

  {/* Order Summary + Pay */}
  <div className=" rounded-2xl p-6 shadow-lg border-2 ">
    <h4 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h4>
    <div className="space-y-3 text-sm mb-8">
      <div className="flex justify-between text-gray-900 py-2 px-4 bg-white/50 rounded-xl border border-gray-200">
        <span>Subtotal</span>
        <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between text-gray-900 py-2 px-4 bg-white/50 rounded-xl border border-gray-200">
        <span>Shipping</span>
        <span className="font-semibold">₹{shipping.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between py-2 text-gray-900 px-4 bg-white/50 rounded-xl border border-gray-200">
        <span>Tax + GST</span>
        <span className="font-semibold">₹{taxes.toLocaleString('en-IN')}</span>
      </div>
      <div className="h-px bg-gray-300 my-3" />
      <div className="flex justify-between items-center p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
        <span className="text-1xl font-bold text-gray-900">Total</span>
        <span className="text-1xl font-black text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</span>
      </div>
    </div>
    
    <button 
      onClick={handleConfirmOrder}
      disabled={!formData.email || !formData.firstName || !formData.phone}
      className="w-full h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl duration-200 disabled:cursor-not-allowed"
    >
       Pay ₹{grandTotal.toLocaleString('en-IN')}
    </button>
    
    <div className="text-xs text-center text-gray-500 mt-4 font-medium">
      Secure checkout. Supports all cards & UPI.
    </div>
  </div>
</div>


                        )}
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </ImageKitProvider>
    </div>
  )
}
