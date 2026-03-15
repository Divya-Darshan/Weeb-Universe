'use client'
import Profile from '@/components/profile/profile'
import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Cart from '@/components/product/cart'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

const sliderImages = [
  'https://static.getimg.ai/media/getimg_ai_img-eEUBXVbYBAAMq4uuiVme3.webp',
  'https://static.getimg.ai/media/getimg_ai_img-YNZFXURZzeJX6aKEeCy2z (1)-1.webp',
  'https://static.getimg.ai/media/getimg_ai_img-NVx2DfFXPRx9PzMCyDRmb (1).webp',
  'https://static.getimg.ai/media/getimg_ai_img-4dRQmdqK4Gqjp1hyt62ty.webp',
]

export default function Example() {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)

  return (
    <div className="bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-40">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Mobile menu + Cart - TOGETHER */}
          <div className="flex items-center gap-x-3 lg:hidden">
            {/* Cart */}
            <Cart />
            
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Profile + Cart - FIXED */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
            {/* Cart - DESKTOP VISIBLE */}
            <Cart />
            
            {/* Profile */}
            <Profile />
          </div>
        </nav>

        {/* Mobile menu dialog */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </a>
              
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                {/* Mobile Profile */}
                <div className="py-6">
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5">
                    <Profile />
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Image Slider */}
      <div className="relative w-full pt-20 bg-gray-900">
        {/* Slider container */}
        <div className="relative h-96 sm:h-screen max-h-[600px] w-full overflow-hidden rounded-2xl mx-auto max-w-6xl mt-8">
          {/* Images */}
          {sliderImages.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 rounded-2xl" />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content below slider */}
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="text-gray-400 text-sm tracking-wide mb-4 uppercase">Latest Collections</p>
        </div>
      </div>
    </div>
  )
}
