// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 🔥 Direct Supabase connection only
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const imageKitUrl = 'https://ik.imagekit.io/weeb/'

export const supabase = createClient(supabaseUrl, supabaseKey)

// lib/supabase.ts
export async function getProducts(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { data: data || [], error }
}

// 🏷️ Get Products by Category
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')  // ✅ Fixed: products table
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// 📦 Get Single Product
export async function getProduct(id: number) {
  const { data, error } = await supabase
    .from('products')  // ✅ Fixed: products table
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

// 🔍 Search Products
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')  // ✅ Fixed: products table
    .select('*')
    .textSearch('name', query, { type: 'plain' })  // ✅ Better search
  return { data: data || [], error }
}

// 🏷️ Get Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('products')  // ✅ Fixed: products table
    .select('category')
    .not('category', 'is', null)
  return { 
    data: Array.from(new Set((data || []).map((item: any) => item.category).filter(Boolean))), 
    error 
  }
}

// 📊 Get Featured Products (Top 8)
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')  // ✅ Fixed: products table
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)
  return { data: data || [], error }
}
