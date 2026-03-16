'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          {/* Anime GIF - Perfectly Centered */}
          <div className="w-45 h-45 flex items-center justify-center p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/30">
            <img 
              src="/anime.gif"
              alt="Anime loading"
              className="w-50 h-40 drop-shadow-2xl animate-pulse rounded-lg object-cover"
            />
          </div>

        </div>
   
    </div>
  )
}
