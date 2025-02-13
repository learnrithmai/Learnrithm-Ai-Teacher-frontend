"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import MainContent from "@/components/MainContent"

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject)
    setSelectedTopic(null)
    setIsSidebarOpen(false)
  }

  const handleTopicSelect = (subject: string, topic: string) => {
    setSelectedSubject(subject)
    setSelectedTopic(topic)
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between p-4 shadow bg-background z-50">
        <div className="flex items-center">
          {/* Hamburger menu for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          {/* Logo and Text */}
          <div className="flex items-center ml-2">
            <Image
              src="/images/Logomark.png"
              alt="Learnrithm AI Logo"
              width={32}
              height={32}
            />
            <span className="ml-2 font-semibold text-lg">Learnrithm AI</span>
          </div>
        </div>
        {/* Optionally add more nav items here */}
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30 md:z-0`}
        >
          <Sidebar onSubjectSelect={handleSubjectSelect} onTopicSelect={handleTopicSelect} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <MainContent selectedSubject={selectedSubject} selectedTopic={selectedTopic} />
        </div>
      </div>
    </div>
  )
}