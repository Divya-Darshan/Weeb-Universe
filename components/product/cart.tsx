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
        
        // 🔥 CRITICAL: Trigger cart update
        window.dispatchEvent(new CustomEvent('cartUpdated'))
      }
    }
  }
}

export default function CartComponent() {
  const [open, setOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // 🔥 FIXED: Live sync with localStorage + custom event
  const updateCartItems = useCallback(() => {
    const savedCart = localStorage.getItem('weeb_cart')
    if (savedCart) {
      const parsedItems = JSON.parse(savedCart)
      setCartItems(parsedItems)
    }
  }, [])

  useEffect(() => {
    updateCartItems()
    
    // Listen for cart updates from ProductOverview
    window.addEventListener('cartUpdated', updateCartItems)
    
    // Watch localStorage changes
    const handleStorageChange = () => updateCartItems()
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartItems)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [updateCartItems])

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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

  return (
    <div className="relative z-50">
      {/* Cart Icon with LIVE Count */}
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
          {/* Rest of your Dialog JSX stays EXACTLY the same */}
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
                          Shopping cart ({cartCount} items)
                        </DialogTitle>
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Close panel</span>
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
                        )}
                      </div>
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>₹{total.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <button className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 w-full">
                            Checkout
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              onClick={() => setOpen(false)}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Continue Shopping →
                            </button>
                          </p>
                        </div>
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
