'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from "@/components/ui/button"

export default function Profile() {
  return (
    <>
        
<div className="   ">
    <Authenticated> 
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "    ",
                  }
                }} 
              />
      {/* <Content />  Uncomment this line to show authenticated content/status */}
    </Authenticated>
                      
        <Unauthenticated>
              <SignInButton
                mode="modal"
                appearance={{
                  elements: { userButtonAvatarBox: "p-6 cursor-pointer" },
                }}
              >
                <Button variant="outline" className="cursor-pointer">
                  Sign in
                </Button>
              </SignInButton>
        </Unauthenticated>

</div>

    </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser)
  // return <div>Authenticated content: {messages?.length ?? 0} Your profile is successfully loaded.</div>
}