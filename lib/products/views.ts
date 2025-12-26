// lib/products/views.ts

import type { Product } from './master'

// Lightweight items for grids / carousels
export type ProductListItem = Pick<Product, 'id' | 'name' | 'price' | 'image'>

// If you want to keep these helpers, make them accept data from outside:

export function toProductList(products: Product[]): ProductListItem[] {
  return products.map(({ id, name, price, image }) => ({
    id,
    name,
    price,
    image,
  }))
}

export function buildProductByIdMap(
  products: Product[]
): Record<string, Product> {
  return Object.fromEntries(products.map((p) => [p.id, p]))
}

export function getProductByIdFromMap(
  map: Record<string, Product>,
  id: string
): Product | null {
  return map[id] ?? null
}
