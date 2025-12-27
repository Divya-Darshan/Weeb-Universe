// components/products/Checkout.tsx
'use client'

import { useCart } from '@/lib/cart/context'

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Checkout() {
  const { items } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = items.length > 0 ? 99 : 0 // adjust as you like
  const taxes = Math.round(subtotal * 0.18)  // example 18% GST
  const total = subtotal + shipping + taxes

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
          {/* LEFT: form */}
          <section className="space-y-8">
            {/* Contact information */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Contact information
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Shipping information */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Shipping information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Apartment, suite, etc.
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    defaultValue="India"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State / Province
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal code
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery method */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Delivery method
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex flex-col items-start rounded-lg border border-indigo-600 bg-indigo-50 p-4 text-left text-sm"
                >
                  <span className="font-medium text-gray-900">Standard</span>
                  <span className="text-xs text-gray-500">
                    4–10 business days
                  </span>
                  <span className="mt-2 text-sm text-gray-900">
                    {formatPrice(shipping)}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-4 text-left text-sm hover:border-indigo-500"
                >
                  <span className="font-medium text-gray-900">Express</span>
                  <span className="text-xs text-gray-500">
                    2–5 business days
                  </span>
                  <span className="mt-2 text-sm text-gray-900">
                    {formatPrice(shipping + 99)}
                  </span>
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">Payment</h2>
              <div className="mt-4 space-y-4">
                <div className="flex gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="payment" defaultChecked />
                    <span>Credit card</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="payment" />
                    <span>UPI</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="payment" />
                    <span>Net banking</span>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Card number
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name on card
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CVC
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: order summary */}
          <section className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900">
                Order summary
              </h2>

              {/* Products list */}
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-md object-cover"
                      />
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-gray-900">
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
                  <p className="text-sm text-gray-500">
                    Your cart is empty.
                  </p>
                )}
              </div>

              {/* Totals */}
              <dl className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Shipping</dt>
                  <dd>{formatPrice(shipping)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Taxes</dt>
                  <dd>{formatPrice(taxes)}</dd>
                </div>
                <div className="mt-2 flex items-center justify-between text-base font-semibold text-gray-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Confirm order
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
