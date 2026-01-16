// components/products/Products.tsx
'use client'

import { useEffect, useState } from 'react'
import { fetchProducts, fetchProductById } from '@/lib/products/supabase'
import type { Product } from '@/lib/products/master'
import OverView from './OverView'

function formatPriceInINR(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)



  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  function handleOpen(id: string) {
    const product = products.find((p) => p.id === id)
    if (!product) return
    setSelectedProduct(product)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <div className="bg-white py-16 text-center text-gray-500">
        Loading products...
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white py-16 text-center text-gray-500">
        No products found
      </div>
    )
  }

  return (
    <>
      <div className="bg-transparent">
        <div className="mx-auto max-w-2xl  px-4  py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
            {products.map((product) => (
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
                  <h3 className="text-sm text-white">{product.name}</h3>
                  <p className="text-sm font-medium text-white">
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
