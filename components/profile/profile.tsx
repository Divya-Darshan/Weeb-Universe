// components/profile/profile.tsx
'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <>
      <div className="z-[100]">
        <Authenticated>
          <UserButton afterSignOutUrl="/" />
        </Authenticated>
        <Unauthenticated>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Sign In
            </button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </>
  )
}
