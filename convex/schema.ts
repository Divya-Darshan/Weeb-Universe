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
    customerAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      pincode: v.string()
    })),
    
    // Razorpay Payment
    razorpayOrderId: v.string(),      // order_xxx
    razorpayPaymentId: v.string(),    // pay_xxx  
    razorpaySignature: v.string(),    // Signature
    paymentAmount: v.number(),        // 10000 (in paise)
    paymentCurrency: v.string(),      // "INR"
    paymentStatus: v.string(),        // "captured", "pending"
    paymentMethod: v.optional(v.union(
      v.literal("card"),
      v.literal("upi"),
      v.literal("netbanking"),
      v.literal("wallet"),
      v.literal("cod")
    )),
    
    // Products Ordered
    products: v.array(v.object({
      id: v.number(),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image_name_front: v.string()
    })),
    
    // Order Details - EXTENDED WORKFLOW (with backwards compatibility)
    totalAmount: v.number(),          // ₹100, ₹200
    orderStatus: v.union(
      v.literal("new_order"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("pending")             // LEGACY: Old workflow support
    ),
    createdAt: v.number(),            // Timestamp
    updatedAt: v.number(),            // Last updated timestamp
    
    // Tracking
    trackingId: v.optional(v.string()),
    shippedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    
    // Locked status (delivered orders immutable)
    isLocked: v.optional(v.boolean())
  })
  .index("by_customer_email", ["customerEmail"])
  .index("by_status", ["orderStatus"])
  .index("by_date", ["createdAt"]),

  // NEW: Audit Logs - immutable, append-only
  orderAuditLogs: defineTable({
    orderId: v.id("orders"),
    fromStatus: v.string(),
    toStatus: v.string(),
    changedBy: v.string(),            // User ID from Clerk
    changedByName: v.string(),        // User name for readability
    reason: v.optional(v.string()),
    timestamp: v.number(),
    action: v.string()                // "status_change", "note_added", etc
  })
  .index("by_order", ["orderId"])
  .index("by_changed_by", ["changedBy"])
  .index("by_timestamp", ["timestamp"]),

  // NEW: Internal Notes - vendors/admins can add notes
  orderNotes: defineTable({
    orderId: v.id("orders"),
    text: v.string(),
    createdBy: v.string(),            // User ID from Clerk
    createdByName: v.string(),
    timestamp: v.number(),
    isInternal: v.optional(v.boolean()) // Can be internal-only or customer-facing
  })
  .index("by_order", ["orderId"])
  .index("by_timestamp", ["timestamp"])
})

