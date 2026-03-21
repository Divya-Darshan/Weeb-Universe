// src/components/Footer.tsx - COMPLETE CODE (Pure Tailwind, NO packages)
'use client'

import { useState } from 'react'
import { FaInstagram } from 'react-icons/fa6'

const navigation = {
  support: ['+91 9092659556', 'weebstore.com', 'Instagram'], 
  company: ['About', 'Instagram', 'weebstore.com', 'Press'],  
  legal: ['Terms of Service', 'Privacy Policy'],
}

const TERMS_CONTENT = [
  'No refunds on custom anime merch',
  '7-10 day delivery across India', 
  'Contact +91 9092659556 for issues',
  "Weeb Store - 3 friends building anime dreams 🇯🇵"
]

const PRIVACY_CONTENT = [
  'We collect email/phone only for orders',
  'Razorpay handles payments (we see nothing)',
  'Email hello@weebstore.com to delete data',
  'No selling your info to anyone',
  "Last updated March 2026"
]

function getLinkHref(item: string): string {
  const cleanItem = item.trim()
  if (/^[\d\s+()-]+$/.test(cleanItem)) {
    return `tel:${cleanItem.replace(/\s/g, '')}`
  }
  return '#'
}

export default function Footer() {
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const date = new Date()

  return (
    <>
      {/* TERMS MODAL */}
      {termsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setTermsOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Terms of Service</h3>
                  <button
                    onClick={() => setTermsOpen(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="space-y-3 text-sm text-gray-300">
                  {TERMS_CONTENT.map((line, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PRIVACY MODAL */}
      {privacyOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPrivacyOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Privacy Policy</h3>
                  <button
                    onClick={() => setPrivacyOpen(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="space-y-3 text-sm text-gray-300">
                  {PRIVACY_CONTENT.map((line, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="bg-[#020617] text-gray-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Left block */}
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500">
                <span className="text-2xl font-bold text-white">~</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-gray-300">
                Making the world a better place through constructing elegant hierarchies.
              </p>
              <div className="flex items-center gap-4 text-gray-400">
                <a href="#" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
                  <FaInstagram className="h-4 w-4 group-hover:scale-110" />
                </a>
              </div>
            </div>

            {/* Right columns */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Support */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Support</h3>
                <ul className="space-y-2 text-sm">
                  {navigation.support.map((item) => (
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

              {/* Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Info</h3>
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

              {/* Legal */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button
                      onClick={() => setTermsOpen(true)}
                      className="block w-full text-left hover:text-white transition-colors duration-200 text-gray-300 hover:underline"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setPrivacyOpen(true)}
                      className="block w-full text-left hover:text-white transition-colors duration-200 text-gray-300 hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-xs text-gray-500 sm:text-center">
              © {date.getFullYear()} Weeb Store. 3 friends building anime merch dreams.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
