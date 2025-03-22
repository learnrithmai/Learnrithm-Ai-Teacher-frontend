"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BillingNotificationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  billingEmail: string
  setBillingEmail: (email: string) => void
  onSave: () => void
}

export default function BillingNotificationsDialog({
  open,
  onOpenChange,
  billingEmail,
  setBillingEmail,
  onSave,
}: BillingNotificationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Billing Notifications</DialogTitle>
          <DialogDescription>Enter your email address to receive billing notifications</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="billing-email">Email Address</Label>
            <Input
              id="billing-email"
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Notification Preferences</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="notify-renewal" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="notify-renewal" className="text-sm font-normal">
                  Subscription Renewals
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="notify-payment" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="notify-payment" className="text-sm font-normal">
                  Payment Processing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="notify-expiration" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="notify-expiration" className="text-sm font-normal">
                  Subscription Expiration
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="notify-price" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="notify-price" className="text-sm font-normal">
                  Price Changes
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={onSave}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

