"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import MainContent from "@/components/MainContent"

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject)
    setSelectedTopic(null)
  }

  const handleTopicSelect = (subject: string, topic: string) => {
    setSelectedSubject(subject)
    setSelectedTopic(topic)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-64 border-r border-border">
        <Sidebar onSubjectSelect={handleSubjectSelect} onTopicSelect={handleTopicSelect} />
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <MainContent selectedSubject={selectedSubject} selectedTopic={selectedTopic} />
      </div>
    </div>
  )
}

