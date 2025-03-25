"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteConfirmationDialog({ open, onOpenChange }: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Account Deletion Request Received</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p>
            Your account deletion request has been received and will be processed. Your account and data will be cleared
            from our database in 30 days.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Important Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  Please note that all active subscriptions will be lost and not refunded. You will lose access to all
                  premium features immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

