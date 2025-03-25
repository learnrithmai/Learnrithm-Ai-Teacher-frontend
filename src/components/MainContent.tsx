"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface MainContentProps {
  selectedSubject: string | null
  selectedTopic: string | null
}

interface TopicContent {
  theory: string;
  videoQuery?: string;
  imagePrompt?: string;
  type: string;
}

export default function MainContent({ selectedSubject, selectedTopic }: MainContentProps) {
  const [content, setContent] = useState<TopicContent | null>(null)

  useEffect(() => {
    if (selectedSubject && selectedTopic) {
      // Load content from localStorage
      const savedTopics = localStorage.getItem('generatedTopics')
      if (savedTopics) {
        const topics = JSON.parse(savedTopics)
        const topicContent = topics.find(
          (t: any) => t.mainTopic === selectedSubject && t.name === selectedTopic
        )
        if (topicContent) {
          setContent(topicContent.content)
        }
      }
    }
  }, [selectedSubject, selectedTopic])

  if (!selectedSubject || !selectedTopic) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-center">
          Select a topic from the sidebar to view its content
        </h2>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">{selectedTopic}</h1>
      
      <Card className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{content.theory}</ReactMarkdown>
        </div>
        
        {content.videoQuery && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Related Video Content</h3>
            <Button
              onClick={() => window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(content.videoQuery ?? '')}`,
                '_blank'
              )}
            >
              Watch on YouTube
            </Button>
          </div>
        )}

        {content.imagePrompt && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Visual Representation</h3>
            <p className="text-muted-foreground">{content.imagePrompt}</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}