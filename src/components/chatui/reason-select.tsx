"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const reasons = [
  {
    value: "general",
    label: "General Conversation",
  },
  {
    value: "academic",
    label: "Academic Writing",
  },
  {
    value: "creative",
    label: "Creative Writing",
  },
  {
    value: "programming",
    label: "Programming Help",
  },
  {
    value: "math",
    label: "Mathematics",
  },
  {
    value: "science",
    label: "Science",
  },
  {
    value: "research",
    label: "Research",
  },
  {
    value: "analysis",
    label: "Analysis",
  },
]

export function ReasonSelect() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? reasons.find((reason) => reason.value === value)?.label : "Select purpose..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search purpose..." />
          <CommandList>
            <CommandEmpty>No purpose found.</CommandEmpty>
            <CommandGroup>
              {reasons.map((reason) => (
                <CommandItem
                  key={reason.value}
                  value={reason.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === reason.value ? "opacity-100" : "opacity-0")} />
                  {reason.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

