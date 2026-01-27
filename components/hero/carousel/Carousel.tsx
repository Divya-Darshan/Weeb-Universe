'use client'

import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carousel({ items }: { items: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const router = useRouter()

        useEffect(() => {
            if (!emblaApi) return

            const interval = setInterval(() => {
              emblaApi.scrollNext()
            }, 3000) 

            return () => clearInterval(interval)
          }, [emblaApi])

  return (

    <>
      <h1 className="mb-8 text-center text-4xl sm:text-5xl lg:text-6xl  font-bold tracking-widest text-white
        drop-shadow-[0_0_18px_rgba(99,102,241,0.9)]">
        TRENDING
      </h1>

    <div className="relative">

      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((item, i) => (
            <div
              key={i}
              className="min-w-[80%] sm:min-w-[33%] px-2 cursor-pointer"
              onClick={() => router.push(item.href)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="rounded-xl object-cover w-full h-64"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
      >
        <ChevronRight />
      </button>
    </div>
    </>

  )
}
