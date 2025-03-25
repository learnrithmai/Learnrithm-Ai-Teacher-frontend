"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, Download, CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FreeTrial from "./free-trial"


interface SubscriptionData {
  plan: string
  startDate: string
  endDate: string
  daysLeft: number
  percentLeft: number
  price: string
  billingCycle: "monthly" | "yearly"
  autoRenew: boolean
  paymentMethod: {
    type: "card" | "paypal"
    lastFour?: string
    expiryDate?: string
    brand?: string
  }
  features: string[]
  status: "active" | "trial" | "expired" | "none"
}

export default function SubscriptionComponent() {
  // This could be fetched from an API or passed as props
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

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [invoicesDialogOpen, setInvoicesDialogOpen] = useState(false)
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false)
  const [autoRenew, setAutoRenew] = useState(subscriptionData.autoRenew)
  const [selectedPlan, setSelectedPlan] = useState("enterprise")
  const { toast } = useToast()

  // Update subscription data when autoRenew changes
  useEffect(() => {
    setSubscriptionData((prev) => ({
      ...prev,
      autoRenew,
    }))
  }, [autoRenew])

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

      {/* Upgrade Plan Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>Choose a plan that best fits your needs.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-select">Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan-select">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pro" disabled>
                    Pro Plan (Current)
                  </SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                  <SelectItem value="custom">Custom Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-600">Enterprise</Badge>
                  <h3 className="font-medium">Enterprise Plan</h3>
                </div>
                <span className="font-bold">$199.99/year</span>
              </div>

              <Separator />

              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Advanced security features</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom training sessions</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpgradePlan}>Upgrade Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoices Dialog */}
      <Dialog open={invoicesDialogOpen} onOpenChange={setInvoicesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Billing History</DialogTitle>
            <DialogDescription>View and download your past invoices.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="h-8 text-blue-600">
                          <Download className="h-4 w-4 mr-1" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoicesDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog open={paymentMethodDialogOpen} onOpenChange={setPaymentMethodDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Method</DialogTitle>
            <DialogDescription>View and update your payment method.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {subscriptionData.paymentMethod.brand} •••• {subscriptionData.paymentMethod.lastFour}
                    </p>
                    <p className="text-sm text-gray-500">Expires {subscriptionData.paymentMethod.expiryDate}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Update Coming Soon</p>
                  <p className="text-sm text-amber-700 mt-1">
                    The ability to update your payment method will be available in the next release.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentMethodDialogOpen(false)}>
              Close
            </Button>
            <Button disabled>Update Payment Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your subscription details and status</CardDescription>
              </div>
              <Badge className="bg-[#1877F2]">{subscriptionData.plan}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Start Date</span>
                  <span className="font-medium">{subscriptionData.startDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">End Date</span>
                  <span className="font-medium">{subscriptionData.endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Billing Cycle</span>
                  <span className="font-medium capitalize">{subscriptionData.billingCycle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">
                    {subscriptionData.price}/{subscriptionData.billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time Remaining</span>
                  <span className="font-medium text-[#1877F2]">{subscriptionData.daysLeft} days left</span>
                </div>
                <Progress value={subscriptionData.percentLeft} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-renew" className="text-sm font-medium">
                    Auto-renew Subscription
                  </Label>
                  <p className="text-xs text-gray-500">
                    {autoRenew
                      ? "Your subscription will automatically renew on the end date"
                      : "Your subscription will expire on the end date"}
                  </p>
                </div>
                <Switch id="auto-renew" checked={autoRenew} onCheckedChange={handleAutoRenewToggle} />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Included Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subscriptionData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Payment Method</h3>
                  <p className="text-sm text-gray-500">
                    {subscriptionData.paymentMethod.brand} •••• {subscriptionData.paymentMethod.lastFour}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPaymentMethodDialogOpen(true)}>
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Billing History</h3>
                  <p className="text-sm text-gray-500">View and download past invoices</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setInvoicesDialogOpen(true)}>
                  View Invoices
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 border-t rounded-b-lg">
            <div className="flex-1">
              <h4 className="font-medium mb-1">Want to upgrade?</h4>
              <p className="text-sm text-gray-500 mb-3">Get access to more features with our Enterprise plan</p>
              <Button variant="default" className="w-full sm:w-auto" onClick={() => setUpgradeDialogOpen(true)}>
                Upgrade Plan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0 self-end sm:self-center">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh subscription data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

