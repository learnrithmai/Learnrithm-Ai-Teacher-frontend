"use client"

import React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import type { PersonalInfo } from "../use-profile-state"

// Define the form schema with Zod
const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  birthDate: z.string(),
  country: z.string(),
  institution: z.string(),
  phoneNumber: z.string(),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface EditPersonalInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  personalInfo: PersonalInfo
  setPersonalInfo: (info: PersonalInfo) => void
  setOriginalPersonalInfo: (info: PersonalInfo) => void
  formChanged: boolean
}

export default function EditPersonalInfoDialog({
  open,
  onOpenChange,
  personalInfo,
  setPersonalInfo,
  setOriginalPersonalInfo,
  formChanged,
}: EditPersonalInfoDialogProps) {
  const { toast } = useToast()

  // Initialize React Hook Form
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: personalInfo.name,
      email: personalInfo.email,
      birthDate: personalInfo.birthDate,
      country: personalInfo.country,
      institution: personalInfo.institution,
      phoneNumber: personalInfo.phoneNumber,
    },
  })

  // Update form values when personalInfo changes
  React.useEffect(() => {
    form.reset({
      name: personalInfo.name,
      email: personalInfo.email,
      birthDate: personalInfo.birthDate,
      country: personalInfo.country,
      institution: personalInfo.institution,
      phoneNumber: personalInfo.phoneNumber,
    })
  }, [personalInfo, form])

  const onSubmit = async (data: PersonalInfoFormValues) => {
    try {
      // In a real app, this would be an API call
      console.log("Personal info update data:", data)

      // Update the original state to match the current state
      setOriginalPersonalInfo({ ...data } as PersonalInfo)
      setPersonalInfo({ ...data } as PersonalInfo)
      onOpenChange(false)

      toast({
        title: "Personal Information Updated",
        description: "Your personal information has been updated successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update personal information",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Personal Information</DialogTitle>
          <DialogDescription>Update your personal details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled className="bg-gray-100 cursor-not-allowed" />
                    </FormControl>
                    <FormDescription className="text-xs">Email cannot be changed</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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

