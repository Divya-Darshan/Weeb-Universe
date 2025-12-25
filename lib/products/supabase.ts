//lib/products/supabase.ts

import { supabase } from '@/lib/supabaseClient'
import type { Product } from './master'

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  console.log('Supabase products data:', data)
  console.log('Supabase products error:', error)

  if (error) {
    console.error('fetchProducts error:', error)
    return []
  }

  return (data ?? []) as Product[]
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('fetchProductById error:', error)
    return null
  }

  return data as Product | null
}
