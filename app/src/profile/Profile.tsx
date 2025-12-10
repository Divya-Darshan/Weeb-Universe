'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function Profile() {
  return (
    <>
        
<div className="  p-4 w-max absolute top-[-1] right-0  ">
    <Authenticated>
<UserButton 
  appearance={{
    elements: {
      userButtonAvatarBox: " ring-4  ring-gray-400 rounded-full shadow-lg ",
    }
  }} 
/>

      {/* <Content />  Uncomment this line to show authenticated content/status */}
    </Authenticated >
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
        </div>

    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  // return <div>Authenticated content: {messages?.length ?? 0} Your profile is successfully loaded.</div>
}