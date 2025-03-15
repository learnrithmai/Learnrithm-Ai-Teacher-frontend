"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/chatui/sidebar-provider"
import { ChatSidebar } from "@/components/chatui/chat-sidebar"
import { ChatMessages } from "@/components/chatui/chat-messages"
import { ChatInput } from "@/components/chatui/chat-input"

export function ChatLayout() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const [showWelcome, setShowWelcome] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(false)

  // Wrap toggle function in useCallback to prevent infinite render loops
  const handleToggleDarkMode = React.useCallback((value: boolean) => {
    setDarkMode(value);
  }, []);

  // Use memoized callback for sidebar toggle to maintain stable function references
  const handleToggleSidebar = React.useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [setSidebarOpen, sidebarOpen]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <GraduationCap className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-primary">Learnrithm Ai</h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Pass the required props with memoized callback */}
      <ChatSidebar darkMode={darkMode} setDarkMode={handleToggleDarkMode} />

      {/* Toggle Sidebar Button */}
      <motion.div
        className="hidden md:block absolute z-20"
        initial={false}
        animate={{ left: sidebarOpen ? "300px" : "0px" }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" size="icon" className="mt-4 ml-4" onClick={handleToggleSidebar}>
          {sidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen bg-background/95 backdrop-blur-sm">
        {/* Header */}
        <motion.header
          className="h-16 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <GraduationCap className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="font-semibold">Learnrithm AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Settings className="h-5 w-5" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        {/* Messages */}
        <ChatMessages />

        {/* Input */}
        <div className="border-t bg-background/95 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto py-4">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  )
}