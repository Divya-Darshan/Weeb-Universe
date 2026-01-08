// components/products/OverView.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import type { Product } from '@/lib/products'
import { useCart } from '@/lib/cart/context'
import Cart from '@/components/products/cart'

const cacheBust = () => Date.now()

type OverViewProps = {
  open: boolean
  onClose: () => void
  product: Product | null
}

const reviews = { href: '#', average: 3.9, totalCount: 117 }

function classNames(classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function OverView({ open, onClose, product }: OverViewProps) {
  const { addToCart, items } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [cartOpen, setCartOpen] = useState(false)

  if (!product) return null

  const rating = 4
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function handleAdd() {
    if (!product) return
    if (quantity < 1) return
    addToCart(product as Product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 600)
  }

  function dec() {
    setQuantity((q) => (q > 1 ? q - 1 : 1))
  }

  function inc() {
    setQuantity((q) => (q < 10 ? q + 1 : 10))
  }

  function handleViewCart() {
    setCartOpen(true)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} className="relative z-40">
        {/* Backdrop with fade */}
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 duration-200 ease-out data-[closed]:opacity-0"
        />

        {/* Full-screen container - small mobile padding */}
        <div className="fixed inset-0 z-50 flex w-screen items-center justify-center p-3 sm:p-4">
          {/* Panel - slightly smaller on mobile */}
          <DialogPanel
            transition
            className="relative w-full max-w-lg sm:max-w-2xl rounded-lg bg-white p-4 sm:p-6 shadow-xl duration-200 ease-out data-[closed]:opacity-0 max-h-[95vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-500 sm:right-1 sm:top-1"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon aria-hidden="true" className="size-5 sm:size-6" />
            </button>

            {/* CONTENT - same layout, slightly tighter spacing */}
            <div className="grid w-full grid-cols-1 items-start gap-y-4 sm:gap-y-8 sm:grid-cols-12 lg:gap-x-8">
              <img
                alt={product.name}
                src={product.image + `?v=${Date.now()}`}
                className="aspect-[3/4] w-full max-h-100 mt-4 rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5 sm:aspect-2/3 sm:max-h-none"
              />

              <div className="sm:col-span-8 lg:col-span-7 space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pr-8 sm:pr-12 line-clamp-2">
                  {product.name}
                </h2>

                <section aria-labelledby="information-heading" className="mt-1 sm:mt-2">
                  <h3 id="information-heading" className="sr-only">
                    Product information
                  </h3>

                  <p className="text-xl mt-[-5] sm:text-2xl text-gray-900 font-bold">
                    ₹{product.price}
                  </p>
                </section>

                <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                  {product.description}
                </p>

                {/* Quantity selector */}
                <div className="mt-4 sm:mt-6 inline-flex items-center rounded-md border border-gray-300">
                  <button
                    type="button"
                    onClick={dec}
                    className="px-2 sm:px-3 py-1 text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="min-w-[2.5rem] sm:min-w-[3rem] text-center text-xs sm:text-sm font-medium text-gray-900 px-2">
                    Qty: {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={inc}
                    className="px-2 sm:px-3 py-1 text-base sm:text-lg font-medium text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Action buttons - Add to cart + View cart */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`flex-1 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-white
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                      transition transform duration-150
                      ${
                        added
                          ? 'bg-green-600 hover:bg-green-700 scale-95'
                          : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
                      }`}
                  >
                    {added ? '✓ Added!' : `Add ${quantity} to cart`}
                  </button>

                  {/* Cart button - shows cart badge */}
                  <button
                    type="button"
                    onClick={handleViewCart}
                    className="relative flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition"
                  >
                    <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="hidden sm:inline">View Cart</span>

                    {/* Badge showing cart count */}
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Cart component - controlled by cartOpen state */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

// Separate component for cart modal
function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeFromCart } = useCart()
  const { useRouter } = require('next/navigation')
  const router = useRouter()
  const [pressed, setPressed] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function handleCheckout() {
    setPressed(true)
    setTimeout(() => setPressed(false), 500)
    onClose()
    router.push('/checkout')
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-40">
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
                    <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                    <button
                      type="button"
                      onClick={onClose}
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="size-6" />
                    </button>
                  </div>

                  {/* Cart Items */}
                  <div className="mt-8">
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
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{product.name}</h3>
                              <p className="ml-4">
                                ₹{product.price * product.quantity}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <p className="text-gray-500">Qty {product.quantity}</p>
                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Checkout Section */}
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
                    <p>Subtotal</p>
                    <p>₹{subtotal}</p>
                  </div>
                  <p className="mb-6 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                    className={`w-full rounded-md px-6 py-3 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition transform duration-150 ${
                      items.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : pressed
                          ? 'bg-green-600 hover:bg-green-700 scale-95'
                          : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
                    }`}
                  >
                    {items.length === 0 ? 'Cart is empty' : 'Checkout'}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
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
  )
}
