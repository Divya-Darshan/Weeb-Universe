'use client'

import { ImageKitProvider, Image } from '@imagekit/next'
import { useEffect, useRef, useState } from 'react'

const categories = [
  {
    id: 'naruto',
    name: 'NARUTO',
    imageSrc: 'Category/naruto.png',
  },
  {
    id: 'dragonball',
    name: 'DRAGON BALL',
    imageSrc: 'Category/dragonball',
  },
  {
    id: 'jujutsu',
    name: 'JUJUTSU KAISEN',
    imageSrc: 'Category/jujutsu',
  },
  {
    id: 'demonslayer',
    name: 'DEMON SLAYER',
    imageSrc: 'Category/demonslayer',
  },
  {
    id: 'retro',
    name: 'RETRO FAVOURITES',
    imageSrc: 'Category/retro',
  },
]

interface DropProps {
  selectedCategory?: string | null
  onCategorySelect?: (categoryId: string) => void
}

export default function Drop({ selectedCategory, onCategorySelect }: DropProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || isHovering) return

    let animationFrameId: number
    let scrollLeft = 0
    const scrollSpeed = 1 // pixels per frame
    const totalItemWidth = container.scrollWidth / 2

    const animate = () => {
      scrollLeft += scrollSpeed
      container.scrollLeft = scrollLeft % totalItemWidth
      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovering])

  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
      <div className="w-full bg-[#101828]/95 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Collection

            </h2>

          </div>



          {/* Infinite Carousel */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              ref={scrollContainerRef}
              className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth no-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Tripled for better infinite effect */}
              {[...categories, ...categories, ...categories].map((category, index) => (
                <button
                  key={`${category.id}-${index}`}
                  onClick={() => onCategorySelect?.(category.id)}
                  className="flex-shrink-0 group cursor-pointer transition-all duration-300 focus:outline-none"
                >
                  {/* Circular Image Container */}
                  <div className={`relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-4 transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? '' 
                      : 'hover:scale-110'
                  }`}>
                    <div className={`absolute inset-0 rounded-full overflow-hidden transition-all duration-300 shadow-lg ${
                      selectedCategory === category.id 
                        ? '' 
                        : 'border-2 '
                    }`}>
                      <Image
                        width={300}
                        height={300}
                        alt={category.name}
                        src={category.imageSrc}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Category Name */}
                  <div className="text-center">
                    <h3 className={`font-bold text-sm sm:text-base whitespace-nowrap px-2 transition-colors duration-300 ${
                      selectedCategory === category.id 
                        ? 'text-cyan-400' 
                        : 'text-white group-hover:text-cyan-400'
                    }`}>
                      {category.name}
                    </h3>

                  </div>
                </button>
              ))}
            </div>

            {/* Gradient Overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#020617] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>

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
