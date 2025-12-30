// app/api/razorpay/order/route.ts
import Razorpay from "razorpay"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()
    
    const razorpay = new Razorpay({
      key_id: "242j0LsVrThlsWSqcJIJMrlR",     // ✅ SECRET
      key_secret: "242j0LsVrThlsWSqcJIJMrlR",   // ✅ SECRET
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    })

    console.log("✅ REAL ORDER:", order.id)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error("❌ Razorpay:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
