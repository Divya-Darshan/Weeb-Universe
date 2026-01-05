// components/products/cart.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/context'

interface CartProps {
  position?: 'top-right' | 'navbar' | 'custom'
  customClass?: string
}

export default function Cart({ position = 'top-right', customClass }: CartProps) {
  const [open, setOpen] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { items, removeFromCart } = useCart()
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  // Position classes based on prop
  const positionClasses = {
    'top-right': 'absolute top-9 right-14 md:top-9 md:right-32',
    'navbar': 'relative',
    'custom': customClass || '',
  }

  function handleCheckout() {
    setPressed(true)
    setTimeout(() => setPressed(false), 500)
    setOpen(false)
    router.push('/checkout')
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className={`
          ${positionClasses[position]}
          z-55
          rounded-md bg-gray-950/5
          p-2
          text-sm font-semibold text-white
          hover:bg-gray-950/10
          transition-colors duration-200
        `}
        aria-label={`Shopping cart with ${count} items`}
      >
        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">
                        Shopping cart
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {items.length === 0 && (
                            <li className="py-6 text-sm text-gray-500">
                              Your cart is empty.
                            </li>
                          )}
                          {items.map((product) => (
                            <li key={product.id} className="flex py-6">
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  alt={product.name}
                                  src={product.image + `?v=${Date.now()}`}
                                  className="size-full object-cover"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{product.name}</h3>
                                    <p className="ml-4">
                                      ₹{product.price * product.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <p className="text-gray-500">
                                    Qty {product.quantity}
                                  </p>

                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(product.id)}
                                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Section */}
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>₹{subtotal}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={items.length === 0}
                      className={`
                        w-full
                        rounded-md
                        px-6
                        py-3
                        text-sm
                        font-medium
                        text-white
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-indigo-500
                        focus-visible:ring-offset-2
                        transition
                        transform
                        duration-150
                        mt-6
                        ${
                          items.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : pressed
                              ? 'bg-green-600 hover:bg-green-700 scale-95'
                              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
                        }
                      `}
                    >
                      {items.length === 0 ? 'Cart is empty' : 'Checkout'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-6 w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
