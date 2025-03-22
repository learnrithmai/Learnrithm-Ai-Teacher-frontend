"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TwoFactorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TwoFactorDialog({ open, onOpenChange }: TwoFactorDialogProps) {
  const [activeTab, setActiveTab] = useState("app")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Two-factor Authentication</DialogTitle>
          <DialogDescription>Add an extra layer of security to your account</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <Tabs defaultValue="app" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app">Authenticator App</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>

            <TabsContent value="app" className="space-y-4 pt-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
                <div className="w-40 h-40 bg-white p-2 rounded-lg border mb-4">
                  {/* This would be a QR code in a real app */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Lock className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-center text-gray-500 mb-2">Scan this QR code with your authenticator app</p>
                <div className="flex items-center gap-2">
                  <Input value="ABCD-EFGH-IJKL-MNOP" readOnly className="text-center font-mono" />
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-copy"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Enter verification code</Label>
                <Input id="verification-code" placeholder="Enter 6-digit code" maxLength={6} />
              </div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input id="phone-number" placeholder="+1 (555) 123-4567" />
                <p className="text-xs text-gray-500">We&apos;ll send a verification code to this number</p>
              </div>

              <Button className="w-full">Send Verification Code</Button>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Enable 2FA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

