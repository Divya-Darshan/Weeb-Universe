// lib/products/views.ts
import type { Product } from './master'
import { products } from './master'

// Lightweight items for grids / carousels
export type ProductListItem = Pick<Product, 'id' | 'name' | 'price' | 'image'>

export const productList: ProductListItem[] = products.map(
  ({ id, name, price, image }) => ({
    id,
    name,
    price,
    image,
  })
)

// Fast lookup map for details
const productById: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.id, p])
)

export function getProductById(id: string): Product | null {
  return productById[id] ?? null
}
