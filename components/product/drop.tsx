import { ImageKitProvider, Image } from '@imagekit/next'

const collections = [
  {
    id: 'figures',
    name: 'Anime Figures',
    description: 'Highly detailed collectible figures from your favorite anime series. Premium quality with stunning craftsmanship.',
    imageSrc: 'a',
    imageAlt: 'Collection of premium anime figures with detailed sculpting',
  },
  {
    id: 'clothing',
    name: 'Clothing & Apparel',
    description: 'Comfortable and stylish anime-themed t-shirts, hoodies, and merchandise wear. Express your passion with quality fabric.',
    imageSrc: 'a',
    imageAlt: 'Anime themed clothing and apparel collection',
  },
  {
    id: 'accessories',
    name: 'Accessories & Gear',
    description: 'Functional accessories including bags, keychains, and wearables. Perfect for everyday anime enthusiasts.',
    imageSrc: 'a',
    imageAlt: 'Anime accessories and gear collection',
  },
]

export default function Drop() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/weeb/">
      <div className="min-h-screen bg-gray-100">
        {/* Header Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Anime Collections
              </h1>
            </div>

            {/* Featured Categories */}
            <div className="mt-12 sm:mt-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                      <Image
                        width={500}
                        height={500}
                        alt={collection.imageAlt}
                        src={collection.imageSrc}
                        className="w-full aspect-square object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
                    </div>

                    {/* Content */}
                    <div className="mt-4 px-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {collection.description}
                      </p>
                      <button className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300">
                        Explore Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

 
          </div>
        </div>
      </div>
    </ImageKitProvider>
  )
}
