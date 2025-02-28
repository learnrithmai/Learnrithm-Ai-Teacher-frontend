"use client"

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface SubscriptionData {
  plan: string
  startDate: string
  endDate: string
  daysLeft: number
  percentLeft: number
}

export default function SubscriptionComponent() {
  // This could be fetched from an API or passed as props
  const subscriptionData: SubscriptionData = {
    plan: "Pro Plan",
    startDate: "Oct 15, 2023",
    endDate: "Oct 15, 2024",
    daysLeft: 230,
    percentLeft: 63,
  }

  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time Remaining</span>
                  <span className="font-medium text-[#1877F2]">{subscriptionData.daysLeft} days left</span>
                </div>
                <Progress value={subscriptionData.percentLeft} className="h-2" />
              </div>
            </div>

            <div className="grid gap-4">
              <Separator />
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium mb-2">Want to upgrade?</h4>
                <p className="text-sm text-gray-500">Get access to more features with our Enterprise plan</p>
                <Button variant="outline">View Plans</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}