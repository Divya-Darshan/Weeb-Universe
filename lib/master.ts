// lib/products/master.ts
export type ProductId = `p_${string}`

export type Product = {
  id: ProductId
  name: string
  price: number
  image: string
  colors: string[]
  sizes: string[]
  description: string
}

export const products: Product[] = [
  {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 1499,
    image: '/products/gojo-hoodie.jpg',
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: 'Itachi Tee',
    price: 799,
    image: '/products/itachi-tee.jpg',
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
]
