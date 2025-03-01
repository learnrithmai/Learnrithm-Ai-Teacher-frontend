"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const Command = ({ children, className, ...props }: CommandProps) => (
  <div className={cn("relative flex flex-col gap-2", className)} {...props}>
    {children}
  </div>
)

interface CommandInputProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

export const CommandInput = ({ placeholder, className, ...props }: CommandInputProps) => (
  <input
    type="text"
    placeholder={placeholder}
    className={cn("border rounded px-3 py-2 text-sm w-full", className)}
    {...props}
  />
)

interface CommandListProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode
}

export const CommandList = ({ children, className, ...props }: CommandListProps) => (
  <ul className={cn("border rounded p-2", className)} {...props}>
    {children}
  </ul>
)

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const CommandGroup = ({ children, className, ...props }: CommandGroupProps) => (
  <div className={cn("my-2", className)} {...props}>
    {children}
  </div>
)

interface CommandItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: string
  onSelect: (value: string) => void
  children?: React.ReactNode
}

export const CommandItem = ({ value, onSelect, children, className, ...props }: CommandItemProps) => (
  <li
    className={cn("cursor-pointer p-2 hover:bg-accent/50 rounded", className)}
    onClick={() => onSelect(value)}
    {...props}
  >
    {children}
  </li>
)

export const CommandEmpty = ({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string; props?: any }) => (
  <li className={cn("p-2 text-center text-muted-foreground", className)} {...props}>
    {children}
  </li>
)

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

export const Popover = ({ open, onOpenChange, children, className, ...props }: PopoverProps) => (
  <div
    className={cn(
      "absolute z-10 bg-white shadow-lg rounded-lg border border-gray-200",
      open ? "opacity-100 visible" : "opacity-0 invisible",
      className,
    )}
    style={{ transition: "opacity 0.2s ease-in-out" }}
    {...props}
  >
    {children}
  </div>
)

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const PopoverContent = ({ children, className, ...props }: PopoverContentProps) => (
  <div className={cn("p-4", className)} {...props}>
    {children}
  </div>
)

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export const PopoverTrigger = ({ children, className, ...props }: PopoverTriggerProps) => (
  <button className={cn("relative", className)} {...props}>
    {children}
  </button>
)

