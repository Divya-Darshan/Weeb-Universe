// lib/products/master.ts
export type ProductId = `p_${string}`

export type Product = {
  id: ProductId
  name: string
  price: number
  image: string
  back: string
  colors: string[]
  sizes: string[]
  description: string
}
