"use client"

import { useState } from "react"

// Define types for our state
export interface PaymentMethod {
  type: "card" | "paypal"
  lastFour?: string
  expiryDate?: string
  brand?: string
}

export interface SubscriptionData {
  plan: string
  startDate: string
  endDate: string
  daysLeft: number
  percentLeft: number
  price: string
  billingCycle: "monthly" | "yearly"
  autoRenew: boolean
  paymentMethod: PaymentMethod
  features: string[]
  status: "active" | "trial" | "expired" | "none"
}

export function useSubscriptionState() {
  // Subscription data state
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    plan: "Pro Plan",
    startDate: "Oct 15, 2023",
    endDate: "Oct 15, 2024",
    daysLeft: 230,
    percentLeft: 63,
    price: "$99.99",
    billingCycle: "yearly",
    autoRenew: true,
    paymentMethod: {
      type: "card",
      lastFour: "4242",
      expiryDate: "09/26",
      brand: "Visa",
    },
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Team collaboration",
    ],
    status: "trial", // Set to "trial" to show the free trial component
  })

  const [autoRenew, setAutoRenew] = useState(subscriptionData.autoRenew)

  return {
    subscriptionData,
    setSubscriptionData,
    autoRenew,
    setAutoRenew,
  }
}

