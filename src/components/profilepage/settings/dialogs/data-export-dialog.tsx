"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface DataExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exportFormat: string
  setExportFormat: (format: string) => void
  exportInProgress: boolean
  onExport: () => void
}

export default function DataExportDialog({
  open,
  onOpenChange,
  exportFormat,
  setExportFormat,
  exportInProgress,
  onExport,
}: DataExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Export Your Data</DialogTitle>
          <DialogDescription>Download a copy of your personal data in your preferred format</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data to Export</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="export-profile" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="export-profile" className="text-sm font-normal">
                  Profile Information
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="export-activity" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="export-activity" className="text-sm font-normal">
                  Activity History
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="export-subscription" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="export-subscription" className="text-sm font-normal">
                  Subscription Data
                </Label>
              </div>
            </div>
          </div>

          {exportInProgress && (
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Preparing your data for export...</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onExport} disabled={exportInProgress}>
            {exportInProgress ? "Exporting..." : "Export Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

