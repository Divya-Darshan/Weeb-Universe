'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { NavigationMenuDemo } from './src/NavigationMenuDemo'

export default function Home() {
  return (
    <>
      <NavigationMenuDemo  />

        <Authenticated>
          <UserButton />
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>

    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  return <div>Authenticated content: {messages?.length ?? 0}</div>
}