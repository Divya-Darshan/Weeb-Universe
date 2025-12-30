// components/products/OverView.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import type { Product } from '@/lib/products'
import { useCart } from '@/lib/cart/context'

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
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const rating = 4

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

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
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

                <p className="text-xl mt-[-5] sm:text-2xl text-gray-900 font-bold">₹{product.price}</p>


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

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                    transition transform duration-150
                    ${added
                      ? 'bg-green-600 hover:bg-green-700 scale-95'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'}`}
                >
                  {added ? 'Added!' : `Add ${quantity} to cart`}
                </button>

              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
