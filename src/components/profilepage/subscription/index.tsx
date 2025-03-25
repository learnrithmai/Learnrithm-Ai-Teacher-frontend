"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import SubscriptionDetails from "./subscription-details"
import FeaturesList from "./features-list"
import PaymentSection from "./payment-section"
import UpgradePlanDialog from "./dialogs/upgrade-plan-dialog"
import InvoicesDialog from "./dialogs/invoices-dialog"
import PaymentMethodDialog from "./dialogs/payment-method-dialog"
import { useSubscriptionState } from "./use-subscription-state"
import FreeTrial from "../free-trial"

export default function SubscriptionComponent() {
  const { subscriptionData, setSubscriptionData, autoRenew, setAutoRenew } = useSubscriptionState()

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [invoicesDialogOpen, setInvoicesDialogOpen] = useState(false)
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("enterprise")
  const { toast } = useToast()

  // Update subscription data when autoRenew changes
  useEffect(() => {
    setSubscriptionData((prev) => ({
      ...prev,
      autoRenew,
    }))
  }, [autoRenew, setSubscriptionData])

  const handleAutoRenewToggle = (checked: boolean) => {
    setAutoRenew(checked)
    toast({
      title: checked ? "Auto-renewal enabled" : "Auto-renewal disabled",
      description: checked
        ? "Your subscription will automatically renew on the end date."
        : "Your subscription will expire on the end date.",
    })
  }

  const handleUpgradePlan = () => {
    setUpgradeDialogOpen(false)
    toast({
      title: "Plan upgrade initiated",
      description: "You'll be upgraded to the Enterprise plan at the end of your current billing cycle.",
    })
  }

  const handleTrialUpgrade = () => {
    setSubscriptionData((prev) => ({
      ...prev,
      status: "active",
    }))

    toast({
      title: "Welcome to Pro!",
      description: "You've successfully upgraded to the Pro plan. Enjoy all the premium features!",
    })
  }

  // Sample invoice data
  const invoices = [
    { id: "INV-2024-001", date: "Oct 15, 2023", amount: "$99.99", status: "Paid" },
    { id: "INV-2023-012", date: "Oct 15, 2022", amount: "$89.99", status: "Paid" },
    { id: "INV-2022-008", date: "Oct 15, 2021", amount: "$79.99", status: "Paid" },
  ]

  return (
    <div className="grid gap-6">
      {/* Dialogs */}
      <UpgradePlanDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        onUpgrade={handleUpgradePlan}
      />

      <InvoicesDialog open={invoicesDialogOpen} onOpenChange={setInvoicesDialogOpen} invoices={invoices} />

      <PaymentMethodDialog
        open={paymentMethodDialogOpen}
        onOpenChange={setPaymentMethodDialogOpen}
        paymentMethod={subscriptionData.paymentMethod}
      />

      {/* Show Free Trial component if status is "trial" */}
      {subscriptionData.status === "trial" && (
        <FreeTrial
          startDate="Mar 15, 2025"
          endDate="Apr 14, 2025"
          daysLeft={24}
          percentLeft={80}
          features={[
            "All Pro features",
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
            "Team collaboration",
          ]}
          onUpgrade={handleTrialUpgrade}
        />
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          {/* Subscription Details Section */}
          <SubscriptionDetails
            subscriptionData={subscriptionData}
            autoRenew={autoRenew}
            onAutoRenewToggle={handleAutoRenewToggle}
          />

          {/* Features List Section */}
          <FeaturesList features={subscriptionData.features} />

          {/* Payment Section */}
          <PaymentSection
            paymentMethod={subscriptionData.paymentMethod}
            onManagePaymentClick={() => setPaymentMethodDialogOpen(true)}
            onViewInvoicesClick={() => setInvoicesDialogOpen(true)}
            onUpgradeClick={() => setUpgradeDialogOpen(true)}
          />
        </Card>
      </motion.div>
    </div>
  )
}

