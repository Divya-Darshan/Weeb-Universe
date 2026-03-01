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
    <div className="w-full space-y-3">
      <div className="text-center">
        <div className="text-lg sm:text-xl font-black text-gray-900 mb-1">
          ₹{(amount/100).toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-gray-500">Final Amount to Pay</div>
      </div>
      
      <Authenticated>
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 touch-none"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </Authenticated>
      
      <Unauthenticated>
        <SignInButton mode="modal">
          <button className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all active:scale-95 touch-none">
            Pay Now
          </button>
        </SignInButton>
      </Unauthenticated>
    </div>
  )
}
