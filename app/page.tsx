
// app/page.tsx (or app/products/page.tsx)

'use client'

import LogoLoop from '@/components/hero/logoloop/LogoLoop'
import Carousel from '@/components/hero/carousel/Carousel'
import { useState, useEffect } from 'react'
import Loading from '@/components/Loading'




const techLogos = [
  {
    src: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime1.png`,

  },
  {
    src: `https://res.cloudinary.com/dllduppce/image/upload/v1766401599/anime2.png`,

  },
  {
    src: `https://res.cloudinary.com/dllduppce/image/upload/v1766402083/anime3.png`,

  },
  {
    src: `https://res.cloudinary.com/dllduppce/image/upload/v1766402289/anime4.png`,

  },
]

import './globals.css'
import Hero from '@/components/hero/Hero'
import Products from '@/components/products/Products'
import Promo from '@/components/hero/promo/Promo'
import Footer from '@/components/footer/Footer'
import { Radius } from 'lucide-react'
// import Carousel from './src/hero/carousel/Carousel'
// import MagicBento from './src/hero/magicbento/MagicBento'

export default function Home() {
    const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading (remove for real data)
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loading />

  return (
    <>
      

      <Hero />

      <Carousel
          items={[
                          {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
          {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/naruto',
          },
          {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1767072820/file_00000000caec7206840882f3220454d6_xy5ynw.png',
          href: '/collections/one-piece',
          },
          ]}
      />
      
      <Products />

      <div>
      
        <LogoLoop 
          logos={techLogos}
          speed={110}
          direction="left"
          logoHeight={200}
          gap={30}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Anime Characters Logo Loop"
        />

      </div>

      <Promo />
      <Footer />

   
    </>
  )
}
