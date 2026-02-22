// convex/razor/orders.ts
import { mutation, query } from "../_generated/server"
import { v } from "convex/values"

export const createOrder = mutation({
  args: {
    paymentId: v.string(),
    orderId: v.string(),
    customer: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      paymentMethod: v.string()
    }),
    items: v.array(v.object({
      id: v.number(),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image_name_front: v.string()
    })),
    subtotal: v.number(),
    shipping: v.number(),
    taxes: v.number(),
    grandTotal: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      status: "new" as const
    })
  }
})

// 🔥 NEW: List all orders
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders")
      .order("desc")
      .collect()
  }
})

// 🔥 NEW: Update order status
export const updateStatus = mutation({
  args: { 
    id: v.id("orders"),
    status: v.union(v.literal("new"), v.literal("processing"), v.literal("delivered"), v.literal("cancelled"))

  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status })
    return status
  }
})
