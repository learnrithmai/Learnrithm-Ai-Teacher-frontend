"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ThemeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTheme: string
  setSelectedTheme: (theme: string) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  themeChanged: boolean
  onSubmit: () => void
}

export default function ThemeDialog({
  open,
  onOpenChange,
  selectedTheme,
  setSelectedTheme,
  selectedColor,
  setSelectedColor,
  themeChanged,
  onSubmit,
}: ThemeDialogProps) {
  const colorOptions = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" },
    { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>Customize the appearance of the application</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedTheme === "light" ? "default" : "outline"}
                className="justify-start gap-2"
                onClick={() => setSelectedTheme("light")}
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={selectedTheme === "dark" ? "default" : "outline"}
                className="justify-start gap-2"
                onClick={() => setSelectedTheme("dark")}
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={selectedTheme === "system" ? "default" : "outline"}
                className="justify-start gap-2"
                onClick={() => setSelectedTheme("system")}
              >
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
                  className="lucide lucide-laptop"
                >
                  <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
                </svg>
                System
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  className={`h-10 ${selectedColor === color.value ? "ring-2 ring-offset-2" : ""}`}
                  onClick={() => setSelectedColor(color.value)}
                >
                  <span className={`w-5 h-5 rounded-full ${color.class} mr-2`}></span>
                  <span className="text-xs">{color.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!themeChanged}>
            {themeChanged ? "Save Changes" : "No Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

