// components/products/OverView.tsx
'use client'

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import type { Product } from '@/lib/products'

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
  if (!product) return null

  const rating = 4

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop with fade */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 duration-200 ease-out data-[closed]:opacity-0"
      />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 z-50 flex w-screen items-center justify-center p-4">
        {/* Panel with fade */}
        <DialogPanel
          transition
          className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl duration-200 ease-out data-[closed]:opacity-0"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon aria-hidden="true" className="size-6" />
          </button>

          {/* CONTENT (unchanged) */}
          <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
            <img
              alt={product.name}
              src={product.image}
              className="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
            />

            <div className="sm:col-span-8 lg:col-span-7">
              <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                {product.name}
              </h2>

              <section aria-labelledby="information-heading" className="mt-2">
                <h3 id="information-heading" className="sr-only">
                  Product information
                </h3>

                <p className="text-2xl text-gray-900">₹{product.price}</p>

                <div className="mt-6">
                  <h4 className="sr-only">Reviews</h4>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((r) => (
                        <StarIcon
                          key={r}
                          aria-hidden="true"
                          className={classNames([
                            rating > r ? 'text-gray-900' : 'text-gray-200',
                            'size-5 shrink-0',
                          ])}
                        />
                      ))}
                    </div>
                    <p className="sr-only">{rating} out of 5 stars</p>
                    <a
                      href={reviews.href}
                      className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {reviews.totalCount} reviews
                    </a>
                  </div>
                </div>
              </section>

              <p className="mt-6 text-sm text-gray-700">
                {product.description}
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
