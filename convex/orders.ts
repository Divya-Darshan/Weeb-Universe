import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// ALLOWED STATE TRANSITIONS - source of truth (with backwards compatibility)
const STATE_TRANSITIONS = {
  // NEW: Extended workflow
  new_order: ["confirmed", "pending"],  // Also allow old "pending" for backwards compatibility
  confirmed: ["processing", "delivered"],
  processing: ["shipped", "delivered"],
  shipped: ["delivered"],
  delivered: [], // Locked - no transitions
  // LEGACY: Old workflow support
  pending: ["delivered"]
}

const VALID_STATUSES = ["new_order", "confirmed", "processing", "shipped", "delivered", "pending"] as const

type OrderStatus = typeof VALID_STATUSES[number]

// Helper to validate state transition
const isValidTransition = (fromStatus: string, toStatus: string, userRole: string): boolean => {
  const allowedNext: string[] = STATE_TRANSITIONS[fromStatus as keyof typeof STATE_TRANSITIONS] || []
  
  // Admin can override some rules (optional - adjust as needed)
  if (userRole === "admin" && fromStatus !== "delivered") {
    return true
  }
  
  return allowedNext.includes(toStatus)
}

// Helper to check if order is locked
const isOrderLocked = (order: any): boolean => {
  return order.orderStatus === "delivered" || order.isLocked
}

// ============= QUERIES =============

export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("orders")
      .order("desc")
      .collect()
    
    // Enrich with urgency info
    return orders.map((order) => ({
      ...order,
      urgency: calculateUrgency(order)
    }))
  }
})

export const getOrdersByStatus = query({
  args: {
    status: v.union(
      v.literal("new_order"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("pending")
    )
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("orderStatus"), args.status))
      .order("desc")
      .collect()
    
    return orders.map((order) => ({
      ...order,
      urgency: calculateUrgency(order)
    }))
  }
})

// Query to get order with audit logs and notes
export const getOrderDetail = query({
  args: {
    orderId: v.id("orders")
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    // Fetch audit logs
    const auditLogs = await ctx.db
      .query("orderAuditLogs")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .order("desc")
      .collect()

    // Fetch internal notes
    const notes = await ctx.db
      .query("orderNotes")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .order("desc")
      .collect()

    return {
      ...order,
      auditLogs,
      notes,
      urgency: calculateUrgency(order)
    }
  }
})

// ============= MUTATIONS =============

// Create order (existing, but enhanced)
export const createOrder = mutation({
  args: {
    paymentId: v.string(),
    orderId: v.string(),
    customer: v.object({
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      phone: v.string(),
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      pincode: v.optional(v.string()),
      state: v.optional(v.string())
    }),
    items: v.array(v.object({
      id: v.number(),
      name: v.string(),
      price: v.number(),
      image_name_front: v.string(),
      quantity: v.number()
    })),
    subtotal: v.number(),
    shipping: v.number(),
    taxes: v.number(),
    grandTotal: v.number()
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const order = {
      razorpayOrderId: args.orderId,
      razorpayPaymentId: args.paymentId,
      razorpaySignature: "",
      paymentAmount: args.grandTotal * 100,
      paymentCurrency: "INR",
      paymentStatus: "captured",
      paymentMethod: "card" as const,
      
      customerName: `${args.customer.firstName} ${args.customer.lastName}`.trim(),
      customerEmail: args.customer.email,
      customerPhone: args.customer.phone,
      customerAddress: args.customer.address ? {
        street: args.customer.address,
        city: args.customer.city || "",
        state: args.customer.state || "",
        pincode: args.customer.pincode || ""
      } : undefined,
      
      products: args.items,
      totalAmount: args.grandTotal,
      orderStatus: "new_order" as const,
      createdAt: now,
      updatedAt: now,
      isLocked: false
    }
    return await ctx.db.insert("orders", order)
  }
})

// NEW: Update order status with validation and audit trail
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    newStatus: v.union(
      v.literal("new_order"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("pending")
    ),
    userId: v.string(),
    userName: v.string(),
    userRole: v.union(v.literal("admin"), v.literal("vendor"), v.literal("viewer"))
  },
  handler: async (ctx, args) => {
    // Validation 1: Check permissions
    if (args.userRole === "viewer") {
      throw new Error("Viewers cannot update order status")
    }

    // Validation 2: Get order and check existence
    const order = await ctx.db.get(args.orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    // Validation 3: Check if order is locked
    if (isOrderLocked(order)) {
      if (args.userRole !== "admin") {
        throw new Error("Delivered orders cannot be changed by vendors")
      }
      // Admin can reopen orders if needed
    }

    // Validation 4: Check state transition is valid
    if (!isValidTransition(order.orderStatus, args.newStatus, args.userRole)) {
      throw new Error(
        `Invalid transition: ${order.orderStatus} → ${args.newStatus}. ` +
        `Allowed: ${STATE_TRANSITIONS[order.orderStatus as keyof typeof STATE_TRANSITIONS]?.join(", ") || "none"}`
      )
    }

    const now = Date.now()

    // Update order status with proper typing
    const updatedOrder: any = {
      orderStatus: args.newStatus,
      updatedAt: now,
      isLocked: args.newStatus === "delivered"
    }

    // Add delivery timestamp if marking as delivered
    if (args.newStatus === "delivered") {
      updatedOrder.deliveredAt = now
    }

    // Add shipped timestamp if marking as shipped
    if (args.newStatus === "shipped") {
      updatedOrder.shippedAt = now
    }

    await ctx.db.patch(args.orderId, updatedOrder)

    // Create audit log entry (immutable record)
    await ctx.db.insert("orderAuditLogs", {
      orderId: args.orderId,
      fromStatus: order.orderStatus,
      toStatus: args.newStatus,
      changedBy: args.userId,
      changedByName: args.userName,
      timestamp: now,
      action: "status_change"
    })

    return await ctx.db.get(args.orderId)
  }
})

// NEW: Bulk update orders with validation
export const bulkUpdateOrderStatus = mutation({
  args: {
    orderIds: v.array(v.id("orders")),
    newStatus: v.union(
      v.literal("new_order"),
      v.literal("confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("pending")
    ),
    userId: v.string(),
    userName: v.string(),
    userRole: v.union(v.literal("admin"), v.literal("vendor"), v.literal("viewer"))
  },
  handler: async (ctx, args) => {
    if (args.userRole === "viewer") {
      throw new Error("Viewers cannot update orders")
    }

    const now = Date.now()
    const results = {
      success: [] as string[],
      failed: [] as { orderId: string; error: string }[]
    }

    for (const orderId of args.orderIds) {
      try {
        const order = await ctx.db.get(orderId)
        if (!order) {
          results.failed.push({ orderId: orderId.toString(), error: "Order not found" })
          continue
        }

        // Check if locked and user is not admin
        if (isOrderLocked(order) && args.userRole !== "admin") {
          results.failed.push({ 
            orderId: orderId.toString(), 
            error: "Order is locked (delivered)" 
          })
          continue
        }

        // Validate transition
        if (!isValidTransition(order.orderStatus, args.newStatus, args.userRole)) {
          results.failed.push({ 
            orderId: orderId.toString(), 
            error: `Invalid transition: ${order.orderStatus} → ${args.newStatus}` 
          })
          continue
        }

        // Update order
        await ctx.db.patch(orderId, {
          orderStatus: args.newStatus,
          updatedAt: now,
          isLocked: args.newStatus === "delivered",
          ...(args.newStatus === "delivered" && { deliveredAt: now }),
          ...(args.newStatus === "shipped" && { shippedAt: now })
        })

        // Create audit log
        await ctx.db.insert("orderAuditLogs", {
          orderId: orderId,
          fromStatus: order.orderStatus,
          toStatus: args.newStatus,
          changedBy: args.userId,
          changedByName: args.userName,
          timestamp: now,
          action: "bulk_status_change"
        })

        results.success.push(orderId.toString())
      } catch (error) {
        results.failed.push({ 
          orderId: orderId.toString(), 
          error: error instanceof Error ? error.message : "Unknown error" 
        })
      }
    }

    return results
  }
})

// NEW: Add internal note to order
export const addOrderNote = mutation({
  args: {
    orderId: v.id("orders"),
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
    isInternal: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    const noteId = await ctx.db.insert("orderNotes", {
      orderId: args.orderId,
      text: args.text,
      createdBy: args.userId,
      createdByName: args.userName,
      timestamp: Date.now(),
      isInternal: args.isInternal ?? true
    })

    // Also create audit log for note addition
    await ctx.db.insert("orderAuditLogs", {
      orderId: args.orderId,
      fromStatus: order.orderStatus,
      toStatus: order.orderStatus,
      changedBy: args.userId,
      changedByName: args.userName,
      reason: args.text,
      timestamp: Date.now(),
      action: "note_added"
    })

    return noteId
  }
})

// ============= HELPERS =============

function calculateUrgency(order: any): "normal" | "urgent" | "delayed" {
  const now = Date.now()
  const hoursSinceCreation = (now - order.createdAt) / (1000 * 60 * 60)

  if (order.orderStatus === "new_order" && hoursSinceCreation > 24) {
    return "urgent"
  }

  if (order.orderStatus === "confirmed" && hoursSinceCreation > 48) {
    return "delayed"
  }

  if (order.orderStatus === "processing" && hoursSinceCreation > 72) {
    return "delayed"
  }

  return "normal"
}

// Query for orders needing attention
export const getUrgentOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.or(
        q.eq(q.field("orderStatus"), "new_order"),
        q.eq(q.field("orderStatus"), "confirmed"),
        q.eq(q.field("orderStatus"), "processing")
      ))
      .collect()

    return orders
      .map((order) => ({
        ...order,
        urgency: calculateUrgency(order)
      }))
      .filter((order) => order.urgency !== "normal")
      .sort((a, b) => (a.createdAt - b.createdAt)) // Oldest first
  }
})

