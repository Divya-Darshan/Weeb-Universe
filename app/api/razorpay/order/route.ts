// app/api/razorpay/order/route.ts
import Razorpay from "razorpay"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()
    
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET // live secret key added

    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys missing")
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    })

    console.log("✅ Order created:", order.id)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error("❌ Razorpay error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
