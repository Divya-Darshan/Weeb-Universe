// lib/supabase.ts 
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const imageKitUrl = 'https://ik.imagekit.io/weeb/'  

export const supabase = createClient(supabaseUrl, supabaseKey)

// 🛒 Get ALL Products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// 🏷️ Get Products by Category
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
  return { data: data || [], error }
}

// 📦 Get Single Product
export async function getProduct(id: number) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}
