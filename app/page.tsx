'use client'


import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { NavigationMenu } from './src/nav/NavigationMenu'
import Demo from './src/nav/demo/demo'

export default function Home() {
  return (
    <>
    
      {/* <NavigationMenu /> */}
      <Demo />


    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  return <div>Authenticated content: {messages?.length ?? 0}</div>
}