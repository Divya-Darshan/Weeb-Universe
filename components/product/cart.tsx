'use client'
import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Image, ImageKitProvider } from '@imagekit/next'
import Razorpay from '@/components/payment/razorpay'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

interface CartItem {
  id: number
  name: string
  price: number
  image_name_front: string
  quantity: number
}

declare global {
  interface Window {
    cartContext: {
      cartItems: CartItem[]
      addToCart: (product: any, quantity: number) => void
    }
  }
}

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
  const [tab, setTab] = useState<'cart' | 'checkout' | 'login'>('cart')
  const { user } = useUser()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    phone: '',
    paymentMethod: 'razorpay'
  })

  const updateCartItems = useCallback(() => {
    const savedCart = localStorage.getItem('weeb_cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    updateCartItems()
    window.addEventListener('cartUpdated', updateCartItems)
    window.addEventListener('storage', updateCartItems)
    return () => {
      window.removeEventListener('cartUpdated', updateCartItems)
      window.removeEventListener('storage', updateCartItems)
    }
  }, [updateCartItems])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = total
  const shipping = cartItems.length > 0 ? 0.50 : 0
  const taxes = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + shipping + taxes
  const createOrder = useMutation(api.razor.orders.createOrder)

  const handlePaymentSuccess = async (response: any) => {
    try {
      await createOrder({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id || response.razorpay_payment_id,
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName || '',
          address: formData.address || '',
          city: formData.city || '',
          pincode: formData.pincode || '',
          state: formData.state,
          phone: formData.phone,
          paymentMethod: 'razorpay'
        },
        items: cartItems,
        subtotal,
        shipping,
        taxes,
        grandTotal
      })
    } catch (error) {
      console.error('Failed to save order:', error)
    }
    
    localStorage.removeItem('weeb_cart')
    if ((window as any).cartContext) {
      (window as any).cartContext.cartItems = []
    }
    setCartItems([])
    setTab('cart')
    setOpen(false)
    alert(`✅ Order confirmed!\nPayment ID: ${response.razorpay_payment_id}`)
  }

  const removeItem = (id: number) => {
    const newItems = cartItems.filter(item => item.id !== id)
    setCartItems(newItems)
    localStorage.setItem('weeb_cart', JSON.stringify(newItems))
    if ((window as any).cartContext) {
      (window as any).cartContext.cartItems = newItems
    }
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
    if ((window as any).cartContext) {
      (window as any).cartContext.cartItems = newItems
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isFormValid = formData.email && formData.firstName && formData.phone && formData.pincode && formData.state

  const handleCheckoutClick = () => {
    if (!user) {
      setTab('login')
    } else {
      setTab('checkout')
    }
  }

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-1 relative"
        title="Shopping cart"
      >
        <ShoppingBagIcon className="size-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>
      
      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
        <Dialog open={open} onClose={setOpen} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/50 z-40" />
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-10 z-50">
                <DialogPanel className="pointer-events-auto w-screen sm:w-96 h-screen bg-white flex flex-col shadow-xl">
                  {/* Header */}
                  <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 sm:px-5 border-b border-gray-200">
                    <DialogTitle className="text-base sm:text-lg font-bold text-gray-900">
                      {tab === 'cart' ? `Cart (${cartCount})` : tab === 'login' ? 'Sign In' : 'Checkout'}
                    </DialogTitle>
                    <button
                      onClick={() => {
                        if (tab === 'checkout') setTab('cart')
                        else if (tab === 'login') setTab('cart')
                        else setOpen(false)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
                    >
                      <XMarkIcon className="size-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBagIcon className="mx-auto h-10 w-10 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Empty cart</h3>
                        <p className="mt-1 text-xs text-gray-500">Add items to continue</p>
                      </div>
                    ) : tab === 'cart' ? (
                      <div className="space-y-4">
                        <ul role="list" className="divide-y divide-gray-100">
                          {cartItems.map((product) => (
                            <li key={product.id} className="py-3 flex gap-3">
                              <div className="h-16 w-16 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden">
                                <Image 
                                  src={product.image_name_front}
                                  width={64}
                                  height={64}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 flex flex-col">
                                <h4 className="text-xs font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">₹{product.price}</p>
                                <div className="flex items-center justify-between mt-auto">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                      className="p-1 hover:bg-gray-100 rounded text-gray-500 text-xs"
                                    >
                                      <MinusIcon className="size-3" />
                                    </button>
                                    <span className="w-5 text-center text-xs font-semibold">{product.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                      className="p-1 hover:bg-gray-100 rounded text-gray-500 text-xs"
                                    >
                                      <PlusIcon className="size-3" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => removeItem(product.id)}
                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="border-t border-gray-200 pt-3 mt-2">
                          <div className="flex justify-between text-xs font-medium text-gray-900 mb-2">
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">Taxes & shipping at checkout</p>
                          <button 
                            onClick={handleCheckoutClick}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-3 rounded-lg font-bold text-xs shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
                          >
                            Checkout
                          </button>
                          <button 
                            onClick={() => setOpen(false)} 
                            className="w-full mt-2 text-indigo-600 hover:text-indigo-700 text-xs font-medium py-2"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    ) : tab === 'login' ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="text-center">
                          <h3 className="text-base font-bold text-gray-900 mb-2">Sign in to continue</h3>
                          <p className="text-xs text-gray-600">You need to be signed in to complete your purchase</p>
                        </div>
                        <Unauthenticated>
                          <SignInButton mode="modal">
                            <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-xs hover:shadow-lg transition-all active:scale-95">
                              Sign In
                            </button>
                          </SignInButton>
                        </Unauthenticated>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Shipping */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <h3 className="text-xs font-bold mb-2 text-gray-900">Shipping</h3>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input 
                              name="firstName"
                              placeholder="First name *"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="h-8 text-black px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                            <input 
                              name="lastName"
                              placeholder="Last name"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="h-8 text-black px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                          <input 
                            name="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full h-8 text-black mb-2 px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                          />
                          <input 
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full h-8 text-black px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 mb-2"
                          />
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input 
                              name="state"
                              placeholder="State *"
                              value={formData.state}
                              onChange={handleInputChange}
                              className="h-8 text-black px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                            <input 
                              name="city"
                              placeholder="City"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="h-8 text-black px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              name="pincode"
                              placeholder="Pincode *"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              className="h-8 text-black px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                            <input 
                              name="phone"
                              placeholder="Phone *"
                              value={formData.phone}
                              type="tel"
                              onChange={handleInputChange}
                              className="h-8 text-black px-2 py-1 text-xs  border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
                          <h4 className="text-xs font-bold mb-2 text-black">Order Summary</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-black">Subtotal</span>
                              <span className="font-semibold text-black ">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-black">Shipping</span>
                              <span className="font-semibold text-black ">₹{shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-black">Tax</span>
                              <span className="font-semibold text-black ">₹{taxes.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-black my-1" />
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-900">Total</span>
                              <span className="font-black text-indigo-600">₹{grandTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {isFormValid ? (
                          <Razorpay
                            amount={grandTotal * 100}
                            customer={formData}
                            cartItems={cartItems}
                            onSuccess={handlePaymentSuccess}
                          />
                        ) : (
                          <div className="rounded-lg p-3 border border-gray-300 bg-gray-50 text-center">
                            <p className="text-xs text-gray-600">Complete form to pay</p>
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
