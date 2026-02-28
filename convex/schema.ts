import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    body: v.string(),
    createdAt: v.number()
  })
  .index("by_author", ["author"]),

  orders: defineTable({
    // Customer Info
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    
    // Razorpay Payment
    razorpayOrderId: v.string(),      // order_xxx
    razorpayPaymentId: v.string(),    // pay_xxx  
    razorpaySignature: v.string(),    // Signature
    paymentAmount: v.number(),        // 10000 (in paise)
    paymentCurrency: v.string(),      // "INR"
    paymentStatus: v.string(),        // "captured"
    
    // Products Ordered
    products: v.array(v.object({
      id: v.number(),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image_name_front: v.string()
    })),
    
    // Order Details
    totalAmount: v.number(),          // ₹100, ₹200
    orderStatus: v.string(),          // "pending", "confirmed", "shipped"
    createdAt: v.number(),            // Timestamp
    
    // Tracking (future)
    trackingId: v.optional(v.string()),
    shippedAt: v.optional(v.number())
  })
  .index("by_customer_email", ["customerEmail"])
  .index("by_status", ["orderStatus"])
  .index("by_date", ["createdAt"])
})
