"use client"

import * as React from "react"

interface SidebarContextValue {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const value = React.useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
    }),
    [sidebarOpen],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

