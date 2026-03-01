'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function Home() {
  return (
    <>
      <div className="z-index:100">
        <Authenticated>
          <UserButton />
        </Authenticated>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
      </div>
    </>
  )
}

//main: base clerk and convex setup from main
//maintenance: yes it works!
function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
}