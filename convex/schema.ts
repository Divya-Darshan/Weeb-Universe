// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  orders: defineTable({
    // Who placed the order (Clerk user ID)
    userId: v.string(),

    // Customer info
    name: v.string(),
    email: v.string(),
    phone: v.string(),

    // Address
    address: v.string(),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),

    // Totals
    subtotal: v.number(),
    shipping: v.number(),
    taxes: v.number(),
    total: v.number(),

    // Items in the order
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),

    // Razorpay info
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),

    // Timestamps & status
    createdAt: v.number(), // Date.now()
    status: v.string(), // "new" | "processing" | "delivered"
  }),
})
