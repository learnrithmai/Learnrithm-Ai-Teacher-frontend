"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface MainContentProps {
  selectedSubject: string | null
  selectedTopic: string | null
}

interface CourseInfo {
  subject: string;
  difficulty: string;
  educationLevel: string;
  createdAt: string;
}

interface TopicContent {
  theory: string;
  videoQuery?: string;
  imagePrompt?: string;
  type: string;
}

const CustomVideoPlayer = ({ videoId, title }: { videoId: string; title: string }) => {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&color=white&showinfo=0&iv_load_policy=3`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          border: 'none',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default function MainContent({ selectedSubject, selectedTopic }: MainContentProps) {
  const [content, setContent] = useState<TopicContent | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null)

  // Load course info from localStorage
  useEffect(() => {
    const courseInfoStr = localStorage.getItem('courseInfo');
    if (courseInfoStr) {
      try {
        const info = JSON.parse(courseInfoStr);
        setCourseInfo(info);
      } catch (error) {
        console.error('Error parsing course info:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (selectedSubject && selectedTopic) {
        setLoading(true)
        setVideoId(null) // Reset video when changing topics
        
        try {
          // Load content from localStorage
          const savedTopics = localStorage.getItem('generatedTopics')
          if (savedTopics) {
            const topics = JSON.parse(savedTopics)
            const topicContent = topics.find(
              (t: any) => t.mainTopic === selectedSubject && t.name === selectedTopic
            )
            
            if (topicContent) {
              setContent(topicContent.content)
              
              // Search for a relevant YouTube video with more specific query
              const searchQuery = `${selectedSubject} ${selectedTopic} educational lecture explanation`
              const response = await fetch(
                `/api/youtube?q=${encodeURIComponent(searchQuery)}`
              )
              
              if (!response.ok) {
                throw new Error('Failed to fetch video')
              }

              const data = await response.json()
              if (data.videoId) {
                setVideoId(data.videoId)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching content:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchContent()
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

  if (!content || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{selectedTopic}</h1>
        <div className="text-sm text-muted-foreground flex flex-col items-end">
          <span>{selectedSubject}</span>
          {courseInfo && (
            <span className="mt-1">
              {courseInfo.difficulty} • {courseInfo.educationLevel}
            </span>
          )}
        </div>
      </div>
      
      {videoId && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CustomVideoPlayer 
            videoId={videoId} 
            title={`${selectedTopic} - Educational Content`}
          />
        </Card>
      )}
      
      <Card className="p-6 shadow-lg">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{content.theory}</ReactMarkdown>
        </div>
        
        {content.imagePrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-muted/50 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-2">Visual Representation</h3>
            <p className="text-muted-foreground">{content.imagePrompt}</p>
          </motion.div>
        )}

        {courseInfo && (
          <div className="mt-8 pt-6 border-t flex justify-between text-sm text-muted-foreground">
            <div>
              Created: {new Date(courseInfo.createdAt).toLocaleDateString()}
            </div>
            <div>
              Level: {courseInfo.educationLevel}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}