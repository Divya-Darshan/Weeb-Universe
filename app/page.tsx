'use client'


import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { NavigationMenuDemo } from './src/nav/NavigationMenuDemo'
import Profile from './src/profile/Profile'

export default function Home() {
  return (
    <>
      <NavigationMenuDemo  />
      <Profile /> 


    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  return <div>Authenticated content: {messages?.length ?? 0}</div>
}