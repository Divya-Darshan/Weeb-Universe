// e.g. app/page.tsx or components/Products.tsx
import { productList } from '@/lib/products'

function formatPriceInINR(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Products() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
          {productList.map((product) => (
            <div key={product.id} className="group relative">
              <img
                alt={product.name}
                src={product.image}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <h3 className="text-sm text-gray-700">
                  <a href={`#/products/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <p className="text-sm font-medium text-gray-900">
                  {formatPriceInINR(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
