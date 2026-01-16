
// app/page.tsx (or app/products/page.tsx)

'use client'

import LogoLoop from '@/components/hero/logoloop/LogoLoop'


// logo loop data (image src + version)
const cacheBust = () => Date.now()

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
  return (
    <>
      

      <Hero />
      <Products />

      <div>
        {/* Basic horizontal loop */}
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

      {/* other commented sections unchanged */}
    </>
  )
}
