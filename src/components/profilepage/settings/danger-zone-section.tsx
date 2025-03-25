"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"

interface DangerZoneSectionProps {
  onDeleteClick: () => void
}

export default function DangerZoneSection({ onDeleteClick }: DangerZoneSectionProps) {
  return (
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-lg text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" onClick={onDeleteClick}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  )
}

