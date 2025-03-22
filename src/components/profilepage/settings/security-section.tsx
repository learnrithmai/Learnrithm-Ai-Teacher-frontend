"use client"

import { CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SecuritySectionProps {
  onTwoFactorClick: () => void
}

export default function SecuritySection({ onTwoFactorClick }: SecuritySectionProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your security and account preferences</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium text-gray-900">Two-factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" onClick={onTwoFactorClick}>
                  Enable
                </Button>
              </div>
            </div>
          </div>

          <Separator />
        </div>
      </CardContent>
    </>
  )
}

