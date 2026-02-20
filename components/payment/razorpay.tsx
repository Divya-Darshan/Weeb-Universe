// @/components/payment/razorpay.tsx
'use client'
import { useRazorpay } from 'react-razorpay'

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
      amount: amount,  // paise
      currency: 'INR',
      name: 'Weeb Store',
      description: `${cartItems.length} items`,
      order_id: '', // TODO: Generate order_id on server for security
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
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          ₹{(amount/100).toLocaleString('en-IN')}
        </div>
        <div className="text-sm text-gray-500">Final Amount</div>
      </div>
      
      {/* ONE BUTTON - Does EVERYTHING */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Pay Now'}
      </button>
    </div>
  )
}
