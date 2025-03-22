"use client"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface AccountSectionProps {
  selectedLanguage: string
  onLanguageClick: () => void
  onThemeClick: () => void
  onDataExportClick: () => void
  onPrivacyClick: () => void
}

export default function AccountSection({
  selectedLanguage,
  onLanguageClick,
  onThemeClick,
  onDataExportClick,
  onPrivacyClick,
}: AccountSectionProps) {
  return (
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-4">Account</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">Language</p>
                <p className="text-sm text-gray-500">Select your preferred language</p>
              </div>
              <Button variant="outline" onClick={onLanguageClick}>
                {selectedLanguage}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">Theme Settings</p>
                <p className="text-sm text-gray-500">Customize the appearance of the application</p>
              </div>
              <Button variant="outline" onClick={onThemeClick}>
                Customize
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Download a copy of your account data</p>
              </div>
              <Button variant="outline" onClick={onDataExportClick}>
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-gray-900">Privacy Settings</p>
                <p className="text-sm text-gray-500">Manage how your data is used</p>
              </div>
              <Button variant="outline" onClick={onPrivacyClick}>
                Configure
              </Button>
            </div>
          </div>
        </div>

        <Separator />
      </div>
    </CardContent>
  )
}

