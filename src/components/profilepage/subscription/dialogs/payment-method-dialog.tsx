"use client"

import { CreditCard, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { PaymentMethod } from "../use-subscription-state"

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentMethod: PaymentMethod
}

export default function PaymentMethodDialog({ open, onOpenChange, paymentMethod }: PaymentMethodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6">
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
                    {paymentMethod.brand} •••• {paymentMethod.lastFour}
                  </p>
                  <p className="text-sm text-gray-500">Expires {paymentMethod.expiryDate}</p>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button disabled>Update Payment Method</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

