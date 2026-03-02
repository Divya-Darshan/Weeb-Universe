'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import OrdersDashboard from '@/components/admin/dashboard'

export default function AdminPage() {
  const { user, isLoaded } = useUser()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    // Get admin email from environment variable
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

    if (!adminEmail) {
      console.error('NEXT_PUBLIC_ADMIN_EMAIL environment variable not set')
      setLoading(false)
      return
    }

    if (user && user.emailAddresses && user.emailAddresses.length > 0) {
      const userEmail = user.emailAddresses[0].emailAddress
      if (userEmail === adminEmail) {
        setAuthorized(true)
      }
    }

    setLoading(false)
  }, [user, isLoaded])

  if (loading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a
            href="/sign-in"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">❌ Unauthorized</h1>
          <p className="text-gray-600 mb-2">You do not have access to this dashboard.</p>
          <p className="text-sm text-gray-500 mb-6">Contact the administrator if you think this is an error.</p>
          <a
            href="/"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return <OrdersDashboard />
}
