// convex/razor/orders.ts
import { mutation } from "../_generated/server"
import { v } from "convex/values"

export const createOrder = mutation({
  args: {
    paymentId: v.string(),
    orderId: v.optional(v.string()),
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
      status: "confirmed"
    })
  }
})
