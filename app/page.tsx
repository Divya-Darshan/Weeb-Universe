'use client'


import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Hero from './src/nav/demo/Hero'

import Demo from './src/nav/demo/Hero'

export default function Home() {
  return (
    <>
    
 
      <Hero />


    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  return <div>Authenticated content: {messages?.length ?? 0}</div>
}