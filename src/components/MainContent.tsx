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

export default function MainContent({ selectedSubject, selectedTopic }: MainContentProps) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      if (selectedTopic) {
        setLoading(true)
        try {
          const response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mainTopic: selectedTopic,
              contentType: "Text & Image Course",
              educationLevel: "university",
              language: "English",
              selectedLevel: "medium"
            }),
          })

          const data = await response.json()
          if (data.success) {
            setContent(data.content)
          }
        } catch (error) {
          console.error("Error fetching content:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchContent()
  }, [selectedTopic])

  if (!selectedSubject || !selectedTopic) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-center">
          Select a topic from the sidebar to view its content
        </h2>
      </div>
    )
  }

  if (loading) {
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
      
      {content && (
        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content.theory}</ReactMarkdown>
          </div>
          
          {content.videoQuery && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Related Video Content</h3>
              <Button
                onClick={() => window.open(
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(content.videoQuery)}`,
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
      )}
    </motion.div>
  )
}