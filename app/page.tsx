'use client'


import LogoLoop from '@/components/hero/logoloop/LogoLoop'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

//logo loop data
const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Alternative with image sources for logoloop
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];


import './globals.css'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Hero from '@/components/hero/Hero'
import Products from '@/components/products/Products'
//import OverView from '@/app/src/products/OverView';
import Promo from '@/components/hero/promo/Promo';
import Footer from '@/components/footer/Footer';
//import Carousel from './src/hero/carousel/Carousel'
//import  MagicBento  from './src/hero/magicbento/MagicBento'


export default function Home() {
  
  return (
    <>
    
 
      <Hero />
      <Products />

    <div style={{ height: '200px', position: 'relative', overflow: 'hidden', marginTop: '100px' }}>
        {/* Basic horizontal loop */}
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={40}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Technology partners"
        />
    </div> 
    <Promo />
 
 
        <Footer />
    
 
      {/* <div
        style={{ height: '200px', position: 'relative',  }} id='Carousel'  className="mb-20 flex items-center justify-center gap-10 ">
          
        {[0, 1, 2, 3].map((index) => (
          <Carousel
            key={index}
            baseWidth={300}
            autoplay
      //carousel and magic bento temporarily removed 
            autoplayDelay={4000}   
            pauseOnHover
            loop
            round={false}
          />
        ))}
      </div>

            <div
        style={{ height: '600px', position: 'relative',  }}  id='MagicBento'  className=" mt-10 mb-20 flex items-center justify-center gap-10 ">

          <MagicBento 
      textAutoHide={true}
      enableStars={true}
      enableSpotlight={true}
      enableBorderGlow={true}
      enableTilt={true}
      enableMagnetism={true}
      clickEffect={true}
      spotlightRadius={300}
      particleCount={12}
      glowColor="182, 0, 255"
    />

      </div> */}



    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  return <div>Authenticated content: {messages?.length ?? 0}</div>
}