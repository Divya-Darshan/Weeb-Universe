
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
    const [timestamp, setTimestamp] = useState(0)

  useEffect(() => {
    // Simulate loading (remove for real data)
    setTimestamp(Date.now())
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
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1769688191/anBn_futvrt.jpg' + `?v=${timestamp}`,
          href: '/collections/naruto',
          },
                        {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1769688191/anBn_futvrt.jpg'  + `?v=${timestamp}`,
          href: '/collections/naruto',
          },

                                  {
          image: 'https://res.cloudinary.com/dllduppce/image/upload/v1769688191/anBn_futvrt.jpg'  + `?v=${timestamp}`,
          href: '/collections/naruto',
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
