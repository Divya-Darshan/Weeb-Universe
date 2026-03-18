// src/components/Footer.tsx
'use client'

import { FaFacebookF, FaInstagram, FaXTwitter, FaGithub, FaYoutube } from 'react-icons/fa6'

const navigation = {
  support: ['+91 9092659556', 'weebstore.com', 'Instagram'], 
  company: ['About', 'Instagram', 'weebstore.com', 'Press'],   
  legal: ['Terms of service', 'Privacy policy', 'License'],
}

// Helper function to detect and format links
function getLinkHref(item: string): string {
  const cleanItem = item.trim()
  
  // Phone number
  if (/^[\d\s+()-]+$/.test(cleanItem)) {
    return `tel:${cleanItem.replace(/\s/g, '')}`
  }
  
  // Email
  if (cleanItem.includes('@')) {
    return `mailto:${cleanItem}`
  }
  
  return '#'
}

export default function Footer() {
  const date = new Date()

  return (
    <footer className="bg-[#020617] text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Top section */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Left block - Logo + Description + Social */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500">
              <span className="text-2xl font-bold text-white">~</span>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              Making the world a better place through constructing elegant hierarchies.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaFacebookF className="h-4 w-4 group-hover:scale-110" />
              </a>
              <a href="#" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaInstagram className="h-4 w-4 group-hover:scale-110" />
              </a>
              <a href="#" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaXTwitter className="h-4 w-4 group-hover:scale-110" />
              </a>
              <a href="#" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaYoutube className="h-4 w-4 group-hover:scale-110" />
              </a>
              <a href="#" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
                <FaGithub className="h-4 w-4 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Right columns - FIXED RESPONSIVE LAYOUT */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Support Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Support</h3>
              <ul className="space-y-2 text-sm">
                {navigation.support.map((item, index) => (
                  <li key={item}>
                    <a 
                      href={getLinkHref(item)} 
                      className="block max-w-[200px] truncate hover:text-white transition-colors duration-200 text-gray-300 hover:underline"
                      title={item} // Full email on hover
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                {navigation.company.map((item) => (
                  <li key={item}>
                    <a 
                      href={getLinkHref(item)} 
                      className="block max-w-[200px] truncate hover:text-white transition-colors duration-200 text-gray-300 hover:underline"
                      title={item}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                {navigation.legal.map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="block hover:text-white transition-colors duration-200 text-gray-300 hover:underline"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom divider + Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs text-gray-500 sm:text-center">
            © {date.getFullYear()} Weeb Store, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
