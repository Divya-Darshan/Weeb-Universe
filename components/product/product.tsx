// components/product/product.tsx - FULL CODE with ProductOverview integration
'use client'
import { useEffect, useState } from 'react'
import { Image, ImageKitProvider } from '@imagekit/next'
import { getProducts } from '@/lib/supabase'
import ProductOverview from '@/components/product/productover' // Import ProductOverview

interface Product {
  id: number
  name: string
  price: number
  image_name_front: string
  image_name_back: string  // Added for overview
  category?: string
  description?: string     // Added for overview
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null) // Modal state

  useEffect(() => {
    getProducts().then(({ data }) => {
      setProducts(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="py-8">Loading products...</div>
  }

  return (
    <>
      {/* Product Grid */}
      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
        <div className="bg-white py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">Products</h2>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <button  // Changed from <a> to <button>
                  key={product.id}
                  onClick={() => setSelectedProduct(product)} // Open modal
                  className="group bg-white border rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 w-full text-left"
                >
                  {/* ImageKit Image - JUST image name! */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <Image
                      src={product.image_name_front}
                      width={400}
                      height={400}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-all group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ImageKitProvider>

      {/* Product Overview Modal */}
      {selectedProduct && (
        <ProductOverview 
          product={selectedProduct} 
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
