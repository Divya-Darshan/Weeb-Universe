'use client'


import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Hero from './src/hero/Hero'
import Products from './src/products/Products'



export default function Home() {
  return (
    <>
    
 
      <Hero />
      <Products />
   


    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  return <div>Authenticated content: {messages?.length ?? 0}</div>
}