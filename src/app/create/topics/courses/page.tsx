"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
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
    <div className="flex h-screen bg-background text-foreground">
      {/* Hamburger menu for mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0`}
      >
        <Sidebar onSubjectSelect={handleSubjectSelect} onTopicSelect={handleTopicSelect} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <MainContent selectedSubject={selectedSubject} selectedTopic={selectedTopic} />
      </div>
    </div>
  )
}

