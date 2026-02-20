// convex/razor/schema.ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  orders: defineTable({
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
    grandTotal: v.number(),
    status: v.string()
  })
  .index("by_paymentId", ["paymentId"])
})
