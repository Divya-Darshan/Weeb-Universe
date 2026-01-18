// components/products/Checkout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart/context'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Checkout() {
  const { items } = useCart()
  const [loading, setLoading] = useState(false)

  // Convex mutation
  const createOrder = useMutation(api.orders.create)

  // Form state
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('India')
  const [stateField, setStateField] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')

  // Delivery method state
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>(
    'standard'
  )

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const baseShipping = items.length > 0 ? 0 : 0
  const shipping =
    shippingMethod === 'standard' ? baseShipping : baseShipping + 99
  const taxes = subtotal / 12
  const total = subtotal + shipping + taxes

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  const handlePayment = async () => {
    if (!items.length || total === 0) return

    setLoading(true)
    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })

      if (!response.ok) throw new Error('Order creation failed')

      const order = await response.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: 'WeebUniverse',
        description: 'Anime Merch Order',
        order_id: order.id,
        amount: order.amount.toString(),
        currency: order.currency,
        handler: async function (response: any) {
          console.log('RAZORPAY HANDLER FIRED', response)

          try {
            const result = await createOrder({
              items: items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
              })),
              subtotal,
              shipping,
              taxes,
              total,
              name: `${firstName} ${lastName}`.trim(),
              email,
              phone,
              address: `${address}${apartment ? ', ' + apartment : ''}`,
              city,
              state: stateField,
              postalCode,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            console.log('CONVEX ORDER CREATED', result)
            alert('✅ SUCCESS! Payment ID: ' + response.razorpay_payment_id)
          } catch (err) {
            console.error('Order save failed', err)
            alert(
              '⚠️ Payment captured, but saving the order failed. Check console.'
            )
          }
        },
        prefill: {
          name: firstName || 'Test Customer',
          email: email || 'darshno@example.com',
          contact: phone || '9999998999',
        },
        theme: {
          color: '#4f46e5',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('❌ Payment failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        if (!form.reportValidity()) {
          return
        }
        handlePayment()
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
            {/* LEFT: Forms */}
            <section className="space-y-8">
              {/* Contact Info */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Contact information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      required={true}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      required={true}
                      type="nubmer"
                      size={10}
                      aria-valuemax={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Shipping information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      required={true}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      required={true}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company (optinal)
                    </label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      required={true}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apartment, suite, etc.
                    </label>
                    <input
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      required={true}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>India</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State / Province
                    </label>
                    <input
                      required={true}
                      value={stateField}
                      onChange={(e) => setStateField(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal code
                    </label>
                    <input
                      required={true}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Delivery method
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`flex flex-col items-start rounded-lg border p-4 text-left text-sm ${
                      shippingMethod === 'standard'
                        ? 'border-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                        : 'border-gray-200 bg-white hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    <span className="font-medium text-gray-900">Standard</span>
                    <span className="text-xs text-gray-500 mt-1">
                      4–10 business days
                    </span>
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      {formatPrice(baseShipping)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`flex flex-col items-start rounded-lg border p-4 text-left text-sm ${
                      shippingMethod === 'express'
                        ? 'border-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                        : 'border-gray-200 bg-white hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    <span className="font-medium text-gray-900">Express</span>
                    <span className="text-xs text-gray-500 mt-1">
                      2–5 business days
                    </span>
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      {formatPrice(baseShipping + 99)}
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* RIGHT: Order Summary */}
            <section className="space-y-4">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Order summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image + `?v=${Date.now()}`}
                          alt={item.name}
                          className="h-14 w-14 rounded-md object-cover "
                        />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Your cart is empty
                    </p>
                  )}
                </div>

                {/* Totals */}
                <dl className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd>{formatPrice(shipping)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Taxes</dt>
                    <dd>{formatPrice(taxes)} + GST</dd>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <dt>Total</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                </dl>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className={`w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    loading || items.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? 'Processing Payment...' : 'Confirm order'}
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </form>
  )
}
