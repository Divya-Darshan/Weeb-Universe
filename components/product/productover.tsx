// components/product/productover.tsx
'use client'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import { Image, ImageKitProvider } from '@imagekit/next'

interface Product {
  id: number
  name: string
  price: number
  image_name_front: string
  image_name_back: string
  category?: string
  description?: string
  rating?: number 
}

interface ProductOverviewProps {
  product: Product
  open: boolean
  onClose: () => void
}

function classNames(...classes: (string | null | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductOverview({ product, open, onClose }: ProductOverviewProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    { src: product.image_name_front, alt: `${product.name} - Front` },
    { src: product.image_name_back, alt: `${product.name} - Back` }
  ]

  const goToPrevious = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const goToNext = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <DialogPanel
              transition
              className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-4xl"
            >
              <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>

                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                  {/* Image Slider */}
                  <div className="sm:col-span-4 lg:col-span-5">
                    <div className="aspect-[2/3] rounded-lg bg-gray-100 overflow-hidden relative">
                      <Image
                        src={images[currentImage].src}
                        width={400}
                        height={600}
                        alt={images[currentImage].alt}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* DESKTOP + MOBILE Navigation */}
                      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                        <button
                          onClick={goToPrevious}
                          className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-sm pointer-events-auto shadow-lg border transition-all hover:scale-110 md:ml-2"
                        >
                          ←
                        </button>
                        <button
                          onClick={goToNext}
                          className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-sm pointer-events-auto shadow-lg border transition-all hover:scale-110 md:mr-2"
                        >
                          →
                        </button>
                      </div>

                      {/* Thumbnails */}
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-2 px-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={classNames(
                              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                              currentImage === idx 
                                ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-1 shadow-md scale-105' 
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            )}
                          >
                            <Image
                              src={img.src}
                              width={80}
                              height={80}
                              alt={img.alt}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="sm:col-span-8 lg:col-span-7">
                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>
                    
                    <section aria-labelledby="information-heading" className="mt-2">
                      <h3 id="information-heading" className="sr-only">Product information</h3>
                      <p className="text-3xl font-bold text-gray-900">₹{product.price}</p>
                      
                      {/* ⭐ SIMPLE FIXED RATING - NO ERRORS */}
                      <div className="mt-6 flex items-center">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                rating < 4 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300',
                                'size-5 shrink-0'
                              )}
                            />
                          ))}
                        </div>
                        <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          117 reviews
                        </a>
                      </div>

                      {product.description && (
                        <p className="mt-4 text-gray-600 text-sm leading-6">{product.description}</p>
                      )}
                    </section>

                    <section className="mt-10">
                      <button className="w-full rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none transition-all shadow-lg hover:shadow-xl">
                        Add to bag
                      </button>
                    </section>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </ImageKitProvider>
  )
}
