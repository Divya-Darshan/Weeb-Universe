'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Button } from "@/components/ui/button"

export default function Profile() {
  return (
    <>
        
<div className="  p-4 pt-2.5 w-max absolute top-[-0.1]  right-4  ">
    <Authenticated> 
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: " ring-2  ring-emerald-500  rounded-full shadow-lg ",
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