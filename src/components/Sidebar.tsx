"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Book } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onSubjectSelect: (subject: string) => void
  onTopicSelect: (subject: string, topic: string) => void
}

export default function Sidebar({ onSubjectSelect, onTopicSelect }: SidebarProps) {
  const [topics, setTopics] = useState<any[]>([])
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])

  useEffect(() => {
    // Load generated topics from localStorage
    const savedTopics = localStorage.getItem('generatedTopics')
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics))
      // Auto-expand first topic
      const parsedTopics = JSON.parse(savedTopics)
      if (parsedTopics.length > 0) {
        setExpandedTopics([parsedTopics[0].name])
      }
    }
  }, [])

  const toggleTopic = (topicName: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    )
  }

  return (
    <div className="w-64 h-full bg-background border-r">
      <div className="p-4 space-y-4">
        {topics.map((topic) => (
          <div key={topic.name} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => toggleTopic(topic.name)}
            >
              <span className="flex items-center">
                <Book className="w-4 h-4 mr-2" />
                {topic.name}
              </span>
              {expandedTopics.includes(topic.name) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>

            {expandedTopics.includes(topic.name) && (
              <div className="ml-4 space-y-1">
                {topic.subtopics?.map((subtopic: string) => (
                  <Button
                    key={subtopic}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onTopicSelect(topic.name, subtopic)}
                  >
                    {subtopic}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}