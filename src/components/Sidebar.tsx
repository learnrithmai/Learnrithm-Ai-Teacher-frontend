"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Book } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onSubjectSelect: (subject: string) => void
  onTopicSelect: (subject: string, topic: string) => void
}

interface GeneratedContent {
  name: string;
  mainTopic: string;
  content: {
    theory: string;
    videoQuery?: string;
    imagePrompt?: string;
    type: string;
  };
}

export default function Sidebar({ onTopicSelect }: SidebarProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topics, setTopics] = useState<GeneratedContent[]>([])
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])
  const [groupedTopics, setGroupedTopics] = useState<Record<string, GeneratedContent[]>>({})

  useEffect(() => {
    // Load generated topics from localStorage
    const savedTopics = localStorage.getItem('generatedTopics')
    if (savedTopics) {
      const parsedTopics: GeneratedContent[] = JSON.parse(savedTopics)
      setTopics(parsedTopics)

      // Group topics by mainTopic
      const grouped = parsedTopics.reduce((acc, topic) => {
        if (!acc[topic.mainTopic]) {
          acc[topic.mainTopic] = [];
        }
        acc[topic.mainTopic].push(topic);
        return acc;
      }, {} as Record<string, GeneratedContent[]>);

      setGroupedTopics(grouped);

      // Auto-expand first topic if exists
      if (Object.keys(grouped).length > 0) {
        setExpandedTopics([Object.keys(grouped)[0]])
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
        {Object.entries(groupedTopics).map(([mainTopic, topics]) => (
          <div key={mainTopic} className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => toggleTopic(mainTopic)}
            >
              <span className="flex items-center">
                <Book className="w-4 h-4 mr-2" />
                {mainTopic}
              </span>
              {expandedTopics.includes(mainTopic) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>

            {expandedTopics.includes(mainTopic) && (
              <div className="ml-4 space-y-1">
                {topics.map((topic) => (
                  <Button
                    key={topic.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onTopicSelect(mainTopic, topic.name)}
                  >
                    {topic.name}
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