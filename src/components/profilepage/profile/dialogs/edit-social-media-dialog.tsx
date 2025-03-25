"use client"

import React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Linkedin, Instagram, Facebook, Twitter } from "lucide-react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { SocialMedia } from "../use-profile-state"

// Define the form schema with Zod
const socialMediaSchema = z.object({
  linkedin: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  x: z.string(),
})

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>

interface EditSocialMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  socialMedia: SocialMedia
  setSocialMedia: (info: SocialMedia) => void
  setOriginalSocialMedia: (info: SocialMedia) => void
  formChanged: boolean
}

export default function EditSocialMediaDialog({
  open,
  onOpenChange,
  socialMedia,
  setSocialMedia,
  setOriginalSocialMedia,
  formChanged,
}: EditSocialMediaDialogProps) {
  const { toast } = useToast()

  // Initialize React Hook Form
  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      linkedin: socialMedia.linkedin,
      instagram: socialMedia.instagram,
      facebook: socialMedia.facebook,
      x: socialMedia.x,
    },
  })

  // Update form values when socialMedia changes
  React.useEffect(() => {
    form.reset({
      linkedin: socialMedia.linkedin,
      instagram: socialMedia.instagram,
      facebook: socialMedia.facebook,
      x: socialMedia.x,
    })
  }, [socialMedia, form])

  const onSubmit = async (data: SocialMediaFormValues) => {
    try {
      // In a real app, this would be an API call
      console.log("Social media update data:", data)

      // Update the original state to match the current state
      setOriginalSocialMedia({ ...data })
      setSocialMedia({ ...data })
      onOpenChange(false)

      toast({
        title: "Social Media Updated",
        description: "Your social media links have been updated successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update social media",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Social Media</DialogTitle>
          <DialogDescription>Update your social media profiles.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-[#0077B5]" /> LinkedIn
                    </FormLabel>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                        linkedin.com/in/
                      </span>
                      <FormControl>
                        <Input {...field} className="rounded-l-none" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-[#E1306C]" /> Instagram
                    </FormLabel>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                        instagram.com/
                      </span>
                      <FormControl>
                        <Input {...field} className="rounded-l-none" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                    </FormLabel>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                        facebook.com/
                      </span>
                      <FormControl>
                        <Input {...field} className="rounded-l-none" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-[#1DA1F2]" /> X (Twitter)
                    </FormLabel>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 text-gray-500 border border-r-0 rounded-l-md text-sm">
                        x.com/
                      </span>
                      <FormControl>
                        <Input {...field} className="rounded-l-none" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formChanged}>
                {formChanged ? "Submit Changes" : "No Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

