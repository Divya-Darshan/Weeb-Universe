// lib/cart/context.tsx
'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import type { Product } from '@/lib/products/master'

export type CartItem = Product & { quantity: number }

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (id: string) => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'weebuniverse_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        setItems(parsed)
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage', error)
    }
  }, [items])

  function addToCart(product: Product, quantity: number = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return ctx
}
