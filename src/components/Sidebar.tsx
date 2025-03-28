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
    <div className="w-64 h-full bg-background border-r flex flex-col overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg break-words">Course Contents</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-4">
          {Object.entries(groupedTopics).map(([mainTopic, topics]) => (
            <div key={mainTopic} className="space-y-2">
              {/* Replace Button with div for better text wrapping control */}
              <div 
                className="rounded-md px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => toggleTopic(mainTopic)}
              >
                <div className="flex items-start w-full">
                  <div className="flex-shrink-0 mt-1 mr-2">
                    <Book className="w-4 h-4" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-sm whitespace-normal break-words">{mainTopic}</p>
                  </div>
                  <div className="flex-shrink-0 ml-2 mt-1">
                    {expandedTopics.includes(mainTopic) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {expandedTopics.includes(mainTopic) && (
                <div className="ml-4 space-y-1">
                  {topics.map((topic) => (
                    <div
                      key={topic.name}
                      className="rounded-md px-3 py-1.5 hover:bg-accent cursor-pointer"
                      onClick={() => onTopicSelect(mainTopic, topic.name)}
                    >
                      <p className="text-sm whitespace-normal break-words">{topic.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}