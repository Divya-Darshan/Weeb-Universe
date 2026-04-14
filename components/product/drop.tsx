'use client'

import { ImageKitProvider, Image } from '@imagekit/next'
import { useEffect, useRef, useState } from 'react'

const categories = [
  { id: 'marvel', name: 'Marvel', imageSrc: 'Category/naruto' },
  { id: 'dc', name: 'DC', imageSrc: 'Category/dragonball' },
  { id: 'anime', name: 'Anime', imageSrc: 'Category/jujutsu' },
  { id: 'poster', name: 'Poster', imageSrc: 'Category/demonslayer' },
  { id: 'style', name: 'Style accessories', imageSrc: 'Category/retro' },
]

interface DropProps {
  selectedCategory?: string | null
  onCategorySelect?: (categoryId: string) => void
}

export default function Drop({ selectedCategory, onCategorySelect }: DropProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || isHovering) return

    let frame = 0
    let scrollLeft = el.scrollLeft
    const speed = window.innerWidth < 640 ? 0.4 : 0.8

    const loop = () => {
      scrollLeft += speed
      const maxScroll = el.scrollWidth / 2
      if (scrollLeft >= maxScroll) scrollLeft = 0
      el.scrollLeft = scrollLeft
      frame = requestAnimationFrame(loop)
    }

    const start = window.setTimeout(() => {
      frame = requestAnimationFrame(loop)
    }, 150)

    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(frame)
    }
  }, [isHovering])

  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
      <section id="Collection" className="w-full bg-[#101828]/95 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white">
              Collection
            </h2>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar pb-2"
            >
              {[...categories, ...categories].map((category, index) => (
                <button
                  key={`${category.id}-${index}`}
                  onClick={() => onCategorySelect?.(category.id)}
                  className="flex-shrink-0 w-[110px] sm:w-[150px] lg:w-[180px] group focus:outline-none"
                >
                  <div
                    className={`mx-auto mb-3 sm:mb-4 relative overflow-hidden rounded-full shadow-lg transition-transform duration-300
                      w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44
                      ${selectedCategory === category.id ? '' : 'group-hover:scale-105'}`}
                  >
                    <Image
                      width={400}
                      height={400}
                      alt={category.name}
                      src={category.imageSrc}
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 144px, 176px"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <h3
                    className={`text-center font-semibold text-xs sm:text-sm lg:text-base leading-tight transition-colors duration-300 ${
                      selectedCategory === category.id
                        ? 'text-cyan-400'
                        : 'text-white group-hover:text-cyan-400'
                    }`}
                  >
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>

            <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-[#020617] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </ImageKitProvider>
  )
}