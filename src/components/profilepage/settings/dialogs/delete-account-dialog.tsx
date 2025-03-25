"use client"

import { AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deleteConfirmText: string
  setDeleteConfirmText: (text: string) => void
  onDelete: () => void
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  deleteConfirmText,
  setDeleteConfirmText,
  onDelete,
}: DeleteAccountDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[500px] sm:w-auto p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be
              permanently removed.
            </p>
            <div className="space-y-2 mt-4">
              <Label htmlFor="delete-confirm">
                Type <span className="font-semibold">delete my account</span> to confirm:
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="border-red-200 focus:ring-red-500"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteConfirmText !== "delete my account"}
            className="bg-red-500 hover:bg-red-600"
            onClick={(e) => {
              e.preventDefault()
              onDelete()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

