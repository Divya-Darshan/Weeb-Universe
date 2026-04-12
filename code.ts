//  @/coupon.ts
export const coupons = [
  {
    code: "ARTYAM50",
    label: "₹50 Off",
    type: "flat",
    value: 50,
    description: "Get ₹50 discount on your order",
  },
  {
    code: "SAVE10",
    label: "10% Off",
    type: "percent",
    value: 10,
    description: "Get 10% off your subtotal",
  },
  {
    code: "WELCOME",
    label: "20% Off",
    type: "percent",
    value: 100,
    description: "Welcome discount for new users",
  },
] as const
