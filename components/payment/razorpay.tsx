// @/components/payment/razorpay.tsx - ONLY auth check added
'use client'
import { useRazorpay } from 'react-razorpay'
import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'

export default function Razorpay({ 
  amount, 
  customer, 
  cartItems, 
  onSuccess 
}: { 
  amount: number, 
  customer: any, 
  cartItems: any[], 
  onSuccess: (data: any) => void 
}) {
  const { error, isLoading, Razorpay } = useRazorpay()

  const handlePayment = () => {
    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: amount,
      currency: 'INR',
      name: 'Weeb Store',
      description: `${cartItems.length} items`,
      order_id: '',
      prefill: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        contact: customer.phone
      },
      theme: { color: '#7c3aed' },
      handler: onSuccess,
      modal: {
        ondismiss: () => alert('❌ Payment cancelled')
      }
    }

    const razorpayInstance = new Razorpay(options)
    razorpayInstance.open()
  }

  if (error) {
    return <div>Error loading Razorpay: {error}</div>
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          ₹{(amount/100).toLocaleString('en-IN')}
        </div>
        <div className="text-sm text-gray-500">Final Amount</div>
      </div>
      
      <Authenticated>
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 active:scale-95 touch-none"
        >
          {isLoading ? 'Loading...' : 'Pay Now'}
        </button>
      </Authenticated>
      
      <Unauthenticated>
        <SignInButton mode="modal">
          <button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 touch-none">
            Pay Now
          </button>
        </SignInButton>
      </Unauthenticated>
    </div>
  )
}
