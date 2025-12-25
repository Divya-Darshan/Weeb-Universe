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

// Simple cache buster function for image URLs👇
const cacheBust = () => Date.now()

export const products: Product[] = [
  {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
    {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
    {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
    {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
    {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
    {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
    {
    id: 'p_gojo-hoodie',
    name: 'Gojo Hoodie',
    price: 100,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766660170/anime3.png?v=${cacheBust()}`,
    colors: ['black', 'purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Oversized hoodie inspired by Gojo Satoru with soft fleece lining.',
  },
  {
    id: 'p_itachi-tee',
    name: `hello`,
    price: 120,
    image: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png?v=${cacheBust()}`,
    colors: ['black', 'red'],
    sizes: ['M', 'L', 'XL'],
    description: 'Graphic tee featuring Itachi with minimal line art style.',
  },
  
]
