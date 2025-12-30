// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import { CartProvider } from '@/lib/cart/context'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Weeb Universe',
  description: 'A platform where you can buy Best Anime Merchandise',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head > 
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
