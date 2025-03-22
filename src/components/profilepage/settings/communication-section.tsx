"use client"

import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CommunicationSectionProps {
  bellShake: boolean
  onBillingClick: () => void
  onBellClick: () => void
}

export default function CommunicationSection({ bellShake, onBillingClick, onBellClick }: CommunicationSectionProps) {
  return (
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-4">Communication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">Billing Notifications</p>
                <p className="text-sm text-gray-500">Get notified about subscription and billing updates</p>
              </div>
              <Button variant="outline" onClick={onBillingClick}>
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">Subscription Reminders</p>
                <p className="text-sm text-gray-500">Receive reminders before subscription renewal</p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={onBellClick}
                aria-label="Configure subscription reminders"
              >
                <motion.div
                  animate={{ rotate: bellShake ? [0, -15, 15, -15, 15, -15, 15, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bell className="h-4 w-4" />
                </motion.div>
                Configure
              </Button>
            </div>
          </div>
        </div>

        <Separator />
      </div>
    </CardContent>
  )
}

