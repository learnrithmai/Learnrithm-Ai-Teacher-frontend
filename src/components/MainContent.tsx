"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // Import KaTeX CSS
import { Card } from "@/components/ui/card"
import { Loader2, BookCheck, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Quiz from "@/components/Quiz" // Import your Quiz component

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

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface UserAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
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
  
  // Quiz state
  const [quizActive, setQuizActive] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [questionCount, setQuestionCount] = useState("5")
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])

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
              (t: { mainTopic: string; name: string; content: TopicContent }) => 
                t.mainTopic === selectedSubject && t.name === selectedTopic
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

  // Generate quiz questions
  const generateQuiz = async () => {
    if (!selectedSubject || !selectedTopic || !content || !courseInfo) return
    
    setQuizLoading(true)
    setQuizScore(null)
    setUserAnswers([])
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic,
          content: content.theory,
          questionCount: parseInt(questionCount),
          difficulty: courseInfo.difficulty,
          educationLevel: courseInfo.educationLevel
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate quiz questions')
      }
      
      const data = await response.json()
      if (data.success && data.data.questions) {
        setQuizQuestions(data.data.questions)
        setQuizActive(true)
      } else {
        throw new Error('Invalid quiz data received')
      }
    } catch (error) {
      console.error('Error generating quiz:', error)
    } finally {
      setQuizLoading(false)
    }
  }

  // Handle quiz completion with user answers
  const handleQuizComplete = (score: number, answers: UserAnswer[]) => {
    console.log(`Quiz completed with score: ${score}`)
    setQuizScore(score)
    setUserAnswers(answers)
  }

  // Handle retrying quiz - generate new questions
  const handleRetryQuiz = () => {
    generateQuiz()
  }

  // Handle returning to course content
  const handleReturnToCourse = () => {
    setQuizActive(false)
    setQuizScore(null)
    setUserAnswers([])
  }

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

  // Show quiz if active
  if (quizActive) {
    const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);
    const percentage = quizScore !== null ? Math.round((quizScore / quizQuestions.length) * 100) : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReturnToCourse}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Course
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedSubject} • {selectedTopic}
          </div>
        </div>
        
        {quizScore !== null ? (
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">Quiz Results: {selectedTopic}</h1>
                <div className="mt-4 text-lg">
                  <div className={cn(
                    "font-bold text-3xl",
                    percentage >= 70 ? "text-green-500" : "text-red-500"
                  )}>
                    {percentage}%
                  </div>
                  <p className="mt-2">
                    You scored {quizScore} out of {quizQuestions.length} questions
                  </p>
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <Button onClick={handleRetryQuiz} variant="outline">
                    Try New Questions
                  </Button>
                  <Button onClick={handleReturnToCourse}>
                    Return to Course
                  </Button>
                </div>
              </div>
            </Card>
            
            {incorrectAnswers.length > 0 && (
              <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Review Incorrect Answers</h2>
                <div className="space-y-6">
                  {incorrectAnswers.map((answer, index) => (
                    <div 
                      key={index} 
                      className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-800"
                    >
                      <p className="font-medium mb-2">{answer.question}</p>
                      
                      <div className="flex items-center gap-2 mb-1 text-red-600 dark:text-red-400">
                        <XCircle className="h-4 w-4" />
                        <p>Your answer: {answer.selectedAnswer}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <p>Correct answer: {answer.correctAnswer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="p-6 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Quiz: {selectedTopic}</h1>
              <p className="text-muted-foreground">
                Test your knowledge of this topic
              </p>
            </div>
            
            <Quiz
              subject={selectedSubject}
              topic={selectedTopic}
              questions={quizQuestions}
              onComplete={handleQuizComplete}
            />
          </Card>
        )}
      </motion.div>
    );
  }

  // Default content view
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
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select value={questionCount} onValueChange={setQuestionCount}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Quiz questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={generateQuiz} 
            disabled={quizLoading}
            className="flex gap-2"
          >
            {quizLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookCheck className="h-4 w-4" />}
            Quiz Me
          </Button>
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content.theory}
          </ReactMarkdown>
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