"use client"

import { CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { SubscriptionData } from "./use-subscription-state"

interface SubscriptionDetailsProps {
  subscriptionData: SubscriptionData
  autoRenew: boolean
  onAutoRenewToggle: (checked: boolean) => void
}

export default function SubscriptionDetails({
  subscriptionData,
  autoRenew,
  onAutoRenewToggle,
}: SubscriptionDetailsProps) {
  return (
    <>
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
            <InfoRow label="Start Date" value={subscriptionData.startDate} />
            <InfoRow label="End Date" value={subscriptionData.endDate} />
            <InfoRow label="Billing Cycle" value={subscriptionData.billingCycle === "monthly" ? "Monthly" : "Yearly"} />
            <InfoRow
              label="Price"
              value={`${subscriptionData.price}/${subscriptionData.billingCycle === "monthly" ? "month" : "year"}`}
            />
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
            <Switch id="auto-renew" checked={autoRenew} onCheckedChange={onAutoRenewToggle} />
          </div>
        </div>
      </CardContent>
    </>
  )
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

