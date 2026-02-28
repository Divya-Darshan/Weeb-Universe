import { createClient } from '@supabase/supabase-js'

// 🔥 Environment variables only
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const imageKitUrl = 'https://ik.imagekit.io/weeb/'

export const supabase = createClient(supabaseUrl, supabaseKey)

// 🛒 Get ALL Products (orders table via Jiobase proxy)
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
    .from('orders')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// 📦 Get Single Product
export async function getProduct(id: number) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

// 🔍 Search Products
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .ilike('name', `%${query}%`)
    .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
  return { data: data || [], error }
}

// 🏷️ Get Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('orders')
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
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)
  return { data: data || [], error }
}

// Test Jiobase proxy
fetch('https://products.jiobase.com/rest/v1/orders?select=*', {
  headers: {'apikey': 'sb_publishable_tEUCvPyKtS5j6eSuj7SIOg_t1cakOmP'}
}).then(r=>r.json()).then(console.log)
