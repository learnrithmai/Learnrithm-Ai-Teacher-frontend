"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PrivacyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emailNotifications: boolean
  setEmailNotifications: (value: boolean) => void
  pushNotifications: boolean
  setPushNotifications: (value: boolean) => void
  marketingEmails: boolean
  setMarketingEmails: (value: boolean) => void
}

export default function PrivacyDialog({
  open,
  onOpenChange,
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  marketingEmails,
  setMarketingEmails,
}: PrivacyDialogProps) {
  const { toast } = useToast()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Privacy Settings</DialogTitle>
          <DialogDescription>Control how your information is used and shared</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Data Usage</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics" className="text-sm">
                  Analytics
                </Label>
                <p className="text-xs text-gray-500">Allow us to collect anonymous usage data to improve our service</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="personalization" className="text-sm">
                  Personalization
                </Label>
                <p className="text-xs text-gray-500">Allow us to personalize your experience based on your activity</p>
              </div>
              <Switch id="personalization" defaultChecked />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Communication Preferences</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-sm">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-500">Receive important updates about your account</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-sm">
                  Push Notifications
                </Label>
                <p className="text-xs text-gray-500">Receive notifications on your device</p>
              </div>
              <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails" className="text-sm">
                  Marketing Emails
                </Label>
                <p className="text-xs text-gray-500">Receive promotional offers and updates</p>
              </div>
              <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              toast({
                title: "Privacy Settings Updated",
                description: "Your privacy preferences have been saved.",
              })
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

