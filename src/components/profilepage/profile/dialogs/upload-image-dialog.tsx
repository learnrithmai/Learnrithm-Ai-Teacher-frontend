"use client"

import type React from "react"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UploadImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImageUpload: (imageUrl: string) => void
}

export default function UploadImageDialog({ open, onOpenChange, onImageUpload }: UploadImageDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      onImageUpload(imageUrl)
      onOpenChange(false)

      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been updated successfully",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Upload Profile Image</DialogTitle>
          <DialogDescription>
            Choose a new profile image to upload. The image should be square for best results.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center">
          <div
            className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to browse</p>
          </div>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfileImageUpload}
          />
          <p className="text-xs text-gray-500 mt-4">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

