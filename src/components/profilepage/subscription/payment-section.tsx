"use client"

import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { PaymentMethod } from "./use-subscription-state"

interface PaymentSectionProps {
  paymentMethod: PaymentMethod
  onManagePaymentClick: () => void
  onViewInvoicesClick: () => void
  onUpgradeClick: () => void
}

export default function PaymentSection({
  paymentMethod,
  onManagePaymentClick,
  onViewInvoicesClick,
  onUpgradeClick,
}: PaymentSectionProps) {
  return (
    <>
      <CardContent className="space-y-6">
        <Separator />

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Method</h3>
              <p className="text-sm text-gray-500">
                {paymentMethod.brand} •••• {paymentMethod.lastFour}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onManagePaymentClick}>
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Billing History</h3>
              <p className="text-sm text-gray-500">View and download past invoices</p>
            </div>
            <Button variant="outline" size="sm" onClick={onViewInvoicesClick}>
              View Invoices
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 bg-gray-50 border-t rounded-b-lg">
        <div className="flex-1">
          <h4 className="font-medium mb-1">Want to upgrade?</h4>
          <p className="text-sm text-gray-500 mb-3">Get access to more features with our Enterprise plan</p>
          <Button variant="default" className="w-full sm:w-auto" onClick={onUpgradeClick}>
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
    </>
  )
}

