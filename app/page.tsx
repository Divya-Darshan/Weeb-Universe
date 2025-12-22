'use client'


import LogoLoop from '@/components/hero/logoloop/LogoLoop'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

//logo loop data
const techLogos = [ 
  { src: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-08.jpg', alt: 'React', title: 'React' },
  { src: 'https://yt3.ggpht.com/MUldyqL2E7aShIFghCq8AAvZMFrQqTgOJmSIbzbuyyyiEiytkzWXyQf3c1VXnXjL8OhJyZXgULg=s88-c-k-c0x00ffffff-no-rj', alt: 'Next.js', title: 'Next.js' },
  { src: 'https://yt3.ggpht.com/MUldyqL2E7aShIFghCq8AAvZMFrQqTgOJmSIbzbuyyyiEiytkzWXyQf3c1VXnXjL8OhJyZXgULg=s88-c-k-c0x00ffffff-no-rj', alt: 'TypeScript', title: 'TypeScript' },
  { src: 'https://yt3.ggpht.com/MUldyqL2E7aShIFghCq8AAvZMFrQqTgOJmSIbzbuyyyiEiytkzWXyQf3c1VXnXjL8OhJyZXgULg=s88-c-k-c0x00ffffff-no-rj', alt: 'Tailwind CSS', title: 'Tailwind CSS' },
]


// Alternative with image sources for logoloop
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];


import './globals.css'
import Hero from '@/components/hero/Hero'
import Products from '@/components/products/Products'
import OverView from '@/components/products/OverView';
import Promo from '@/components/hero/promo/Promo';
import Footer from '@/components/footer/Footer';
//import Carousel from './src/hero/carousel/Carousel'
//import  MagicBento  from './src/hero/magicbento/MagicBento'


export default function Home() {
  
  return (
    <>

      <OverView   /> 

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
