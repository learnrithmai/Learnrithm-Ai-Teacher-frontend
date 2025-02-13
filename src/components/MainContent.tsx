"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Play, Pause } from "lucide-react"
import Quiz from "./Quiz"

interface MainContentProps {
  selectedSubject: string | null
  selectedTopic: string | null
}

// Mock quiz data (unchanged)
const mockQuizData = [
  {
    question: "What is the derivative of x²?",
    options: ["x", "2x", "2x²", "x½"],
    correctAnswer: "2x",
  },
  {
    question: "What is the integral of 2x?",
    options: ["x²", "2x²", "x + C", "x²/2 + C"],
    correctAnswer: "x² + C",
  },
  {
    question: "What is the derivative of e^x?",
    options: ["e^x", "xe^x", "e^(x-1)", "1/e^x"],
    correctAnswer: "e^x",
  },
]

export default function MainContent({ selectedSubject, selectedTopic }: MainContentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setShowQuiz(true)
  }

  const handleQuizComplete = (score: number) => {
    setQuizScore(score)
    setQuizCompleted(true)
    setShowQuiz(false)
  }

  if (!selectedSubject) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Select a subject to begin your magical learning journey!
        </h2>
      </div>
    )
  }

  if (!selectedTopic) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {selectedSubject}
          </span>{" "}
          selected! Choose a topic to start learning.
        </h2>
      </div>
    )
  }

  if (showQuiz) {
    return (
      <Quiz subject={selectedSubject} topic={selectedTopic} questions={mockQuizData} onComplete={handleQuizComplete} />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 md:space-y-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          {selectedSubject}
        </span>
        : {selectedTopic}
      </h1>

      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Video Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted">
              <video ref={videoRef} className="w-full h-full object-cover" onEnded={handleVideoEnd}>
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button variant="secondary" size="icon" className="absolute bottom-4 right-4" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert">
              <p>
                This is where the detailed explanation of the {selectedTopic} topic within the {selectedSubject} subject
                would go. The content here would be tailored to engage young learners, using simple language and
                relatable examples.
              </p>
              <p>
                Interactive elements, such as quizzes or mini-games, could be embedded here to reinforce learning and
                make the experience more enjoyable for children.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download PDF Materials
            </Button>
          </CardContent>
        </Card>

        {quizCompleted ? (
          <Card className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Congratulations on completing the quiz!</p>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                Your score: {quizScore} / {mockQuizData.length}
              </p>
              <Button
                onClick={() => setQuizCompleted(false)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Retake Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Ready for a Challenge?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Test your knowledge of {selectedTopic} with a quick quiz!</p>
              <Button
                onClick={() => setShowQuiz(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

