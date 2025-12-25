// components/Products.tsx
'use client'

import { useState } from 'react'
import { productList, getProductById, type Product } from '@/lib/products'
import OverView from './OverView' // from previous step

function formatPriceInINR(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Products() {
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  function handleOpen(id: string) {
    const p = getProductById(id)
    if (!p) return
    setSelectedProduct(p)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setSelectedProduct(null)
  }

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
            {productList.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleOpen(product.id)}
                className="group relative text-left"
              >
                <img
                  alt={product.name}
                  src={product.image}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPriceInINR(product.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <OverView open={open} onClose={handleClose} product={selectedProduct} />
    </>
  )
}
