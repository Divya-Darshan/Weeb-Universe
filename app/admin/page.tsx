// app/admin/page.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

const ADMIN_EMAIL = 'weebuniverse2025@gmail.com'

type Order = {
  _id: Id<'orders'>
  _creationTime: number
  userId: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  subtotal: number
  shipping: number
  taxes: number
  total: number
  items: { id: string; name: string; price: number; quantity: number; image: string }[]
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  createdAt?: number
  status?: 'new' | 'processing' | 'delivered'
}

export default function AdminPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <div className="p-8 text-white">Loading user…</div>

  const email = user?.primaryEmailAddress?.emailAddress

  if (!email) {
    return <div className="p-8 text-white">You must be signed in.</div>
  }

  if (email !== ADMIN_EMAIL) {
    return <div className="p-8 text-white">Not authorized.</div>
  }

  const orders = useQuery(api.orders.list, {}) as Order[] | undefined

  const markProcessing = useMutation(api.orders.markProcessing)
  const markDelivered = useMutation(api.orders.markDelivered)

  if (orders === undefined) {
    return <div className="p-8 text-white">Loading orders…</div>
  }

  const newOrders = orders.filter((o) => (o.status ?? 'new') === 'new')
  const processingOrders = orders.filter((o) => o.status === 'processing')
  const deliveredOrders = orders.filter((o) => o.status === 'delivered')

  const totalOrders = orders.length
  const todaysRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Top stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Orders" value={totalOrders} />
          <StatCard label="New Orders" value={newOrders.length} />
          {/* <StatCard label="Today’s Revenue" value={`₹${todaysRevenue}`} /> */}
        </div>

        {/* Kanban columns */}
        <div className="grid gap-4 md:grid-cols-3">
          <Column
            title="New"
            description="Newly placed orders"
            color="border-emerald-500/40 bg-emerald-500/5"
          >
            {newOrders.length === 0 ? (
              <EmptyState text="No new orders" />
            ) : (
              newOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  primaryActionLabel="Mark Processing"
                  onPrimaryAction={() => markProcessing({ id: order._id })}
                  status="new"
                />
              ))
            )}
          </Column>

          <Column
            title="Processing"
            description="Being prepared / packed"
            color="border-yellow-500/40 bg-yellow-500/5"
          >
            {processingOrders.length === 0 ? (
              <EmptyState text="Nothing in processing" />
            ) : (
              processingOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  primaryActionLabel="Mark Delivered"
                  onPrimaryAction={() => markDelivered({ id: order._id })}
                  status="processing"
                />
              ))
            )}
          </Column>

          <Column
            title="Delivered"
            description="Completed orders (history)"
            color="border-blue-500/40 bg-blue-500/5"
          >
            {deliveredOrders.length === 0 ? (
              <EmptyState text="No delivered orders yet" />
            ) : (
              deliveredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  status="delivered"
                />
              ))
            )}
          </Column>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function Column({
  title,
  description,
  color,
  children,
}: {
  title: string
  description: string
  color: string
  children: React.ReactNode
}) {
  return (
    <section
      className={`flex flex-col rounded-2xl border ${color} p-4 min-h-[260px]`}
    >
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </header>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-4 text-center text-xs text-slate-500">
      {text}
    </div>
  )
}

function OrderCard({
  order,
  primaryActionLabel,
  onPrimaryAction,
  status,
}: {
  order: Order
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  status: 'new' | 'processing' | 'delivered'
}) {
  const created = order.createdAt ?? order._creationTime ?? Date.now()

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-4 shadow-md">
      <div className="flex flex-col gap-3">
        {/* Top row: status + time */}
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={status} />
          <span className="text-[11px] text-slate-400">
            {new Date(created).toLocaleString()}
          </span>
        </div>

        {/* Summary row */}
        <div className="flex items-center justify-between text-left w-full mt-1">
          <div>
            <h3 className="text-sm font-semibold">
              {order.name}{' '}
              <span className="text-slate-400 text-xs">
                · ₹{order.total}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {order.email} · {order.phone}
            </p>
          </div>
        </div>

        {/* Items summary */}
        <p className="text-xs text-slate-300">
          {order.items?.map((it) => `${it.quantity}× ${it.name}`).join(', ')}
        </p>

        {/* Always-visible details */}
        <div className="mt-2 rounded-lg bg-slate-900/40 border border-slate-700/60 p-3 text-xs space-y-2">
          <div>
            <p className="text-slate-400">Shipping address</p>
            <p className="text-slate-200">
              {order.name}
              <br />
              {order.address}
              <br />
              {order.city}, {order.state} – {order.postalCode}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* <div>
              <p className="text-slate-400">Subtotal</p>
              <p className="text-slate-200">₹{order.subtotal}</p>
            </div> */}
            <div>
              <p className="text-slate-400">Shipping</p>
              <p className="text-slate-200">₹{order.shipping}</p>
            </div>
            {/* <div>
              <p className="text-slate-400">Taxes</p>
              <p className="text-slate-200">₹{order.taxes}</p>
            </div> */}
            {/* <div>
              <p className="text-slate-400">Total</p>
              <p className="text-slate-200 font-semibold">
                ₹{order.total}
              </p>
            </div> */}
          </div>

          <div>
            <p className="text-slate-400">Razorpay</p>
            <p className="text-slate-200 break-all">
              Order ID: {order.razorpayOrderId}
              <br />
              Payment ID: {order.razorpayPaymentId}
            </p>
          </div>
        </div>

        {/* Action button */}
        {primaryActionLabel && onPrimaryAction && (
          <div className="pt-1">
            <button
              onClick={onPrimaryAction}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500 transition"
            >
              {primaryActionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({
  status,
}: {
  status: 'new' | 'processing' | 'delivered'
}) {
  const map: Record<string, string> = {
    new: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    processing: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
    delivered: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  }

  const labelMap: Record<string, string> = {
    new: 'New',
    processing: 'Processing',
    delivered: 'Delivered',
  }

  const classes = map[status] ?? map.new
  const label = labelMap[status] ?? 'New'

  return (
    <span
      className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold ${classes}`}
    >
      {label}
    </span>
  )
}
