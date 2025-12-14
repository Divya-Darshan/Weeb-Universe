'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import  Profile from '../profile/Profile'
const navigation = [
  { name: 'Home', href: '#' },
  { name: 'Limited Drops', href: '#' },
  { name: 'by Anime', href: '#' },
  { name: 'About', href: '#' },
]

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  return (
    <div className="bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://yt3.googleusercontent.com/MUldyqL2E7aShIFghCq8AAvZMFrQqTgOJmSIbzbuyyyiEiytkzWXyQf3c1VXnXjL8OhJyZXgULg=s160-c-k-c0x00ffffff-no-rj" // logo source here
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
   
            <Profile />

          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://yt3.googleusercontent.com/MUldyqL2E7aShIFghCq8AAvZMFrQqTgOJmSIbzbuyyyiEiytkzWXyQf3c1VXnXjL8OhJyZXgULg=s160-c-k-c0x00ffffff-no-rj" // logo source here for mobile
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
                <div className="py-6">
                    <Profile />

                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
    
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              Check out our new Anime clothing collection {' '}
              <a href="#" className="font-semibold text-indigo-400">
                <span aria-hidden="true" className="absolute inset-0" />
                Here <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              Weeb Universe 
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">``
     Anime merch that feels like the show you love – clean designs, everyday comfort, zero cringe.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Get started
              </a>

            </div>
          </div>
        </div>

                  
        
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-1xl"
        style={{ // Tailwind CSS does not support background images directly in class names
          backgroundImage:
            'url("https://imgs.search.brave.com/I_h8XO-NB3iOkU4PXht-pg4tprvZ0DB5f-fNYQLRrts/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE3/MTQ0NDI0OC92ZWN0/b3IvYW5pbWUtc3R5/bGUtY3V0ZS1naXJs/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1rczFuVzZnRm0x/Nmw2TnBxcEc1UDRB/aVJBSXFDUW1xWmJF/VXVEUktLQlVVPQ")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />


      </div>
    </div>
  )
}
