// app/sign-in/[[...sign-in]]/page.tsx
'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            card: 'shadow-lg border border-gray-200',
            headerTitle: 'text-xl font-bold',
          },
        }}
        // TS-safe: cast props to any so localization is accepted
        {...({
          localization: {
            signIn: {
              start: {
                title: 'Sign in to WeebUniverse',
              },
            },
          },
        } as any)}
        afterSignInUrl="/"
        redirectUrl="/"
      />
    </div>
  )
}
