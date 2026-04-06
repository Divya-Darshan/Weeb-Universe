// src/components/Footer.tsx - COMPLETE CODE (Pure Tailwind, NO packages)
'use client'

import { useState } from 'react'
import { FaInstagram } from 'react-icons/fa6'

const navigation = {
  support: ['+91 9092659556', 'weebstore.com', 'Instagram'], 
  company: ['About', 'Instagram', 'weebstore.com'],  
  legal: ['Terms of Service', 'Privacy Policy'  ],
}

const TERMS_CONTENT = [
  `All sales of custom-designed anime merchandise, including but not limited to apparel, figures, posters, and related collectibles, are final upon dispatch from our fulfillment center and are expressly understood to be non-refundable under any circumstances including but not limited to change of mind, incorrect size selection, or dissatisfaction with product quality post-receipt.`,
  
  `Delivery timelines for orders placed through Weeb Store are estimated at 7-10 business days from date of confirmed payment processing and order fulfillment commencement, covering all major metropolitan areas and urban centers across the Republic of India via partnered courier services including but not limited to standard ground shipping methods, with potential variances due to regional distribution logistics, public holidays, or unforeseen carrier delays.`,
  
  `For any order-related inquiries, discrepancies, shipping concerns, or customer service matters, customers are required to contact our support team via the registered mobile number +91 9092659556 during standard business hours (10 AM - 7 PM IST, Monday through Saturday) providing complete order reference details including but not limited to Order ID, date of purchase, and registered delivery address for verification and resolution.`,

  `Weeb Store represents an independent initiative operated by three individuals collaboratively developing an anime merchandise platform. By engaging with our services, customers acknowledge and accept these operational terms as presented.`
]


const PRIVACY_CONTENT = [
  `Weeb Store, in the course of facilitating customer transactions for anime merchandise including but not limited to apparel, collectibles, and related products through its e-commerce platform, collects and processes certain personal data comprising electronic mail addresses and mobile telephone numbers strictly for the purpose of order fulfillment, shipment coordination, and transactional communication as required under applicable e-commerce operational protocols.`,

  `All payment processing transactions conducted through the Weeb Store platform are exclusively handled by Razorpay Payment Gateway Services Pvt. Ltd., a Reserve Bank of India licensed entity, operating under PCI-DSS Level 1 compliance standards, wherein Weeb Store maintains no access to, storage of, or visibility into customer payment instrument details including but not limited to credit/debit card numbers, CVV codes, or banking credentials at any stage of the transaction lifecycle.`,

  `Customers exercising rights under applicable data protection regulations including but not limited to Information Technology Act, 2000 as amended and associated rules may submit formal requests for access, rectification, or erasure of their personal data maintained by Weeb Store by directing electronic correspondence to hello@weebstore.com containing complete identification details, order reference numbers where applicable, and specific nature of data subject request for processing within statutory timelines.`,

  `Weeb Store does not engage in the sale, transfer, disclosure, or commercial exploitation of customer personal data to any third party entities, marketing networks, data aggregation services, or commercial partners under any circumstances beyond what is contractually required for order fulfillment and service delivery through authorized payment processors and logistics partners.`,

  `This Privacy Notice was last amended and published during March 2026 and reflects current data handling practices of Weeb Store operating as an unregistered partnership of three individuals based in Tamil Nadu, India engaged in anime merchandise retail activities.`
]




function getLinkHref(item: string): string {
  if (item === "Instagram") {
    return "https://www.instagram.com/weeb._universe"
  }
  if (/^[\d\s+()-]+$/.test(item)) {
    return `tel:${item.replace(/\s/g, '')}`
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
      <footer id='About' className="bg-[#020617] text-gray-400">
        <div id='Contacts' className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
                <a href="https://www.instagram.com/weeb._universe" className="group rounded-full p-2 hover:text-white hover:bg-white/10 transition-all duration-200">
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
              © {date.getFullYear()} Weeb Store building anime merch dreams.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
