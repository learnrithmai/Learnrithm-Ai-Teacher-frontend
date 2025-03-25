"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deleteReason: string
  setDeleteReason: (reason: string) => void
  onDelete: () => void
}

export default function DeleteReasonDialog({
  open,
  onOpenChange,
  deleteReason,
  setDeleteReason,
  onDelete,
}: DeleteReasonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Why are you leaving?</DialogTitle>
          <DialogDescription>
            We&apos;d appreciate knowing why you want to delete your account. This helps us improve our service.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Please tell us why you're deleting your account..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

