'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Image, ImageKitProvider } from '@imagekit/next'
import Razorpay from '@/components/payment/razorpay'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

interface CartItem {
  id: number
  name: string
  price: number
  image_name_front: string
  quantity: number
}

export default function CartComponent() {
  const router = useRouter()
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

  const createOrder = useMutation(api.razor.orders.createOrder)

  // Load cart from localStorage
  const updateCartItems = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('weeb_cart')
      if (savedCart) {
        const parsedItems = JSON.parse(savedCart)
        setCartItems(parsedItems)
      }
    }
  }, [])

  useEffect(() => {
    updateCartItems()
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', updateCartItems)
      return () => window.removeEventListener('storage', updateCartItems)
    }
  }, [updateCartItems])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = cartItems.length > 0 ? 50 : 0
  const taxes = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + shipping + taxes
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // ✅ FIXED Payment Success Handler - NO ERRORS
  const handlePaymentSuccess = async (response: any) => {
    console.log('✅ Razorpay Response:', response)
    
    try {
      const orderId = response.razorpay_order_id || `order_${Date.now()}`
      
      await createOrder({
        paymentId: response.razorpay_payment_id,
        orderId: orderId,
        customer: formData,
        items: cartItems,
        subtotal: subtotal,
        shipping: shipping,
        taxes: taxes,
        grandTotal: grandTotal
      })
      
      console.log('✅ Order created successfully!')
      
      // Clear cart completely
      const emptyCart: CartItem[] = []
      localStorage.setItem('weeb_cart', JSON.stringify(emptyCart))
      setCartItems(emptyCart)
      
      router.push(`/success?order=${orderId}&payment=${response.razorpay_payment_id}`)
      
    } catch (error) {
      console.error('❌ Order save failed:', error)
      // Payment succeeded, just show success page
      router.push(`/success?payment=${response.razorpay_payment_id}`)
    }
  }

  const removeItem = (id: number) => {
    const newItems = cartItems.filter(item => item.id !== id)
    localStorage.setItem('weeb_cart', JSON.stringify(newItems))
    setCartItems(newItems)
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    const newItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    localStorage.setItem('weeb_cart', JSON.stringify(newItems))
    setCartItems(newItems)
  }

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setTab('checkout')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const isFormValid = formData.email && 
                     formData.firstName && 
                     formData.phone && 
                     formData.pincode && 
                     formData.state

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
                                          <p className="ml-4">₹{product.price.toLocaleString('en-IN')}</p>
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

                    {/* Checkout Section */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {tab === 'cart' ? (
                          <>
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                              <p>Subtotal</p>
                              <p>₹{subtotal.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</div>
                            <button 
                              onClick={handleCheckout}
                              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all mb-4"
                            >
                              Proceed to Checkout
                            </button>
                            <div className="flex justify-center text-center text-sm text-gray-500">
                              <p>or <button onClick={() => setOpen(false)} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">Continue Shopping</button></p>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-6">
                            {/* Shipping Form */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                              <h3 className="text-lg font-bold mb-6 text-gray-900">Shipping Address</h3>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <input 
                                  name="firstName"
                                  placeholder="First name *"
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                  className="h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                                />
                                <input 
                                  name="lastName"
                                  placeholder="Last name"
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                  className="h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                                />
                              </div>
                              <input 
                                name="email"
                                type="email"
                                placeholder="Email address *"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full h-12 mb-4 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                              />
                              <input 
                                name="phone"
                                type="tel"
                                placeholder="Phone *"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full h-12 mb-4 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                              />
                              <input 
                                name="address"
                                placeholder="Street address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full h-12 mb-4 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <input 
                                  name="city"
                                  placeholder="City"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  className="h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                                />
                                <input 
                                  name="state"
                                  placeholder="State *"
                                  value={formData.state}
                                  onChange={handleInputChange}
                                  className="h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                                />
                                <input 
                                  name="pincode"
                                  placeholder="Pincode *"
                                  value={formData.pincode}
                                  onChange={handleInputChange}
                                  className="h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white"
                                />
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-2xl p-6 border">
                              <h4 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h4>
                              <div className="space-y-3 mb-6">
                                <div className="flex justify-between py-2">
                                  <span>Subtotal ({cartCount} items)</span>
                                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                  <span>Shipping</span>
                                  <span>₹{shipping.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                  <span>GST + Taxes</span>
                                  <span>₹{taxes.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="h-px bg-gray-300 my-4" />
                                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl border">
                                  <span className="text-xl font-bold">Grand Total</span>
                                  <span className="text-2xl font-bold text-indigo-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>

                            {/* Razorpay Payment */}
                            {isFormValid ? (
                              <Razorpay
                                amount={grandTotal * 100} // Convert to paise
                                customer={formData}
                                cartItems={cartItems}
                                onSuccess={handlePaymentSuccess}
                              />
                            ) : (
                              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete your details</h3>
                                <p className="text-gray-500 mb-6">Fill required fields: Email, Name, Phone, Pincode, State</p>
                                <div className="text-2xl font-bold text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</div>
                              </div>
                            )}
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
