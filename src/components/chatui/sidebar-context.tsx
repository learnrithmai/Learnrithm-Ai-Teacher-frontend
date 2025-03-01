"use client"

import * as React from "react"

interface SidebarContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  return <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</SidebarContext.Provider>
}

