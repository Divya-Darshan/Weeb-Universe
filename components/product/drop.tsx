'use client'

import { ImageKitProvider, Image } from '@imagekit/next'
import { useMemo, useState } from 'react'

const categories = [
  { id: 'marvel', name: 'Marvel', imageSrc: 'Category/naruto' },
  { id: 'dc', name: 'DC', imageSrc: 'Category/mainlogo.png' },
  { id: 'anime', name: 'Anime', imageSrc: 'Category/jujutsu' },
  { id: 'poster', name: 'Poster', imageSrc: 'Category/demonslayer' },
  { id: 'style', name: 'Style accessories', imageSrc: 'Category/retro' },
]

interface DropProps {
  selectedCategory?: string | null
  onCategorySelect?: (categoryId: string | null) => void
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export default function Drop({
  selectedCategory,
  onCategorySelect,
  direction = 'left',
  pauseOnHover = true,
}: DropProps) {
  const [isHovering, setIsHovering] = useState(false)
  const items = useMemo(() => [...categories, ...categories], [])

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
            className="relative overflow-hidden"
            onMouseEnter={() => pauseOnHover && setIsHovering(true)}
            onMouseLeave={() => pauseOnHover && setIsHovering(false)}
            onTouchStart={() => pauseOnHover && setIsHovering(true)}
            onTouchEnd={() => pauseOnHover && setIsHovering(false)}
          >
            <div
              className={`marquee-track ${
                direction === 'right' ? 'marquee-right' : 'marquee-left'
              } ${pauseOnHover && isHovering ? 'paused' : ''}`}
            >
              {items.map((category, index) => (
                <button
                  key={`${category.id}-${index}`}
                  onClick={() =>
                    onCategorySelect?.(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                  className="item group flex-shrink-0 focus:outline-none"
                >
                  <div
                    className={`mx-auto mb-3 sm:mb-4 relative overflow-hidden rounded-full shadow-lg transition-transform duration-300
                    w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44
                    ${
                      selectedCategory === category.id
                        ? 'ring-2 ring-white scale-105'
                        : 'group-hover:scale-105'
                    }`}
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

                  <h3 className="text-center font-semibold text-xs sm:text-sm lg:text-base leading-tight text-white">
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>

            <div className="fade-left" />
            <div className="fade-right" />
          </div>
        </div>
      </section>

      <style jsx>{`
        .marquee-track {
          display: flex;
          width: max-content;
          gap: 1rem;
          will-change: transform;
        }

        .item {
          width: 110px;
        }

        @media (min-width: 640px) {
          .marquee-track {
            gap: 1.5rem;
          }
          .item {
            width: 150px;
          }
        }

        @media (min-width: 1024px) {
          .item {
            width: 180px;
          }
        }

        .marquee-left {
          animation: scroll-left 20s linear infinite;
        }

        .marquee-right {
          animation: scroll-right 20s linear infinite;
        }

        .paused {
          animation-play-state: paused;
        }

        .fade-left,
        .fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2rem;
          z-index: 10;
          pointer-events: none;
        }

        .fade-left {
          left: 0;
          background: linear-gradient(to right, #020617, transparent);
        }

        .fade-right {
          right: 0;
          background: linear-gradient(to left, #020617, transparent);
        }

        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-left,
          .marquee-right {
            animation: none;
          }
        }
      `}</style>
    </ImageKitProvider>
  )
}