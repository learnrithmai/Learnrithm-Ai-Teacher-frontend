"use client"

import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LanguageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
}

export default function LanguageDialog({
  open,
  onOpenChange,
  selectedLanguage,
  setSelectedLanguage,
}: LanguageDialogProps) {
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Arabic",
    "Portuguese",
    "Italian",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Finnish",
    "Danish",
    "Polish",
    "Turkish",
    "Hindi",
    "Bengali",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Greek",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-auto p-4 sm:p-6 overflow-hidden max-h-[90vh]">
        <DialogHeader className="space-y-2">
          <DialogTitle>Select Language</DialogTitle>
          <DialogDescription>Choose your preferred language for the interface</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] sm:h-[300px] pr-4 -mr-4">
          <div className="py-4 space-y-2">
            {languages.map((language) => (
              <div
                key={language}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  selectedLanguage === language ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setSelectedLanguage(language)
                  onOpenChange(false)
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedLanguage(language)
                    onOpenChange(false)
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>{language}</span>
                </div>
                {selectedLanguage === language && <Check className="h-4 w-4 text-blue-600" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

