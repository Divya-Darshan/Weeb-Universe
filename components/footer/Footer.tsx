// src/components/Footer.tsx

import { FaFacebookF, FaInstagram, FaXTwitter, FaGithub, FaYoutube } from 'react-icons/fa6'

const navigation = {
  solutions: ['Marketing', 'Analytics', 'Automation', 'Commerce', 'Insights'],
  support: ['Submit ticket', 'Documentation', 'Guides'],
  company: ['About', 'Blog', 'Jobs', 'Press'],
  legal: ['Terms of service', 'Privacy policy', 'License'],
}

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* top section */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* left block */}
          <div className="space-y-6">
            {/* logo */}
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500">
              {/* simple Tailwind-like logo mark */}
              <span className="text-2xl font-bold text-white">~</span>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-gray-300">
              Making the world a better place through constructing elegant hierarchies.
            </p>

            {/* social icons */}
            <div className="flex items-center gap-4 text-gray-400">
              <button className="rounded-full p-2 hover:text-white hover:bg-white/5 transition">
                <FaFacebookF className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:text-white hover:bg-white/5 transition">
                <FaInstagram className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:text-white hover:bg-white/5 transition">
                <FaXTwitter className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:text-white hover:bg-white/5 transition">
                <FaGithub className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:text-white hover:bg-white/5 transition">
                <FaYoutube className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* right columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Solutions</h3>
              <ul className="space-y-2 text-sm">
                {navigation.solutions.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Support</h3>
              <ul className="space-y-2 text-sm">
                {navigation.support.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                {navigation.company.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                {navigation.legal.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500">
            © 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
