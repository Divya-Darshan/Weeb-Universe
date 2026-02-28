import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
// Match your cart structure exactly
export const createOrder = mutation({
  args: {
    paymentId: v.string(),
    orderId: v.string(),
    customer: v.object({
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      pincode: v.string(),
      state: v.string()
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
    // Convert incoming arguments to the schema expected by the orders table.
    const order = {
      // Payment identifiers from Razorpay
      razorpayOrderId: args.orderId,
      razorpayPaymentId: args.paymentId,
      // No signature available on the client response; leave empty or capture later
      razorpaySignature: "",
      paymentAmount: args.grandTotal * 100, // store in paise
      paymentCurrency: "INR",
      paymentStatus: "captured",
      
      // Customer info shortcuts
      customerName: `${args.customer.firstName} ${args.customer.lastName}`.trim(),
      customerEmail: args.customer.email,
      customerPhone: args.customer.phone,
      
      // Products map directly
      products: args.items,
      
      // totals
      totalAmount: args.grandTotal,
      orderStatus: "confirmed",
      createdAt: Date.now()
    }
    return await ctx.db.insert("orders", order)
  }
})
