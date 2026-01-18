// convex/orders.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),
    subtotal: v.number(),
    shipping: v.number(),
    taxes: v.number(),
    total: v.number(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) {
      throw new Error('Not authenticated')
    }

    await ctx.db.insert('orders', {
      userId: user.subject,
      ...args,
      createdAt: Date.now(),
      status: 'new', // default stage
    })
  },
})

// List all orders
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('orders').order('desc').collect()
  },
})

// Move order to "processing"
export const markProcessing = mutation({
  args: { id: v.id('orders') },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: 'processing' })
  },
})

// Move order to "delivered"
export const markDelivered = mutation({
  args: { id: v.id('orders') },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: 'delivered' })
  },
})
