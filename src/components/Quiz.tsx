"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { XCircle, Trophy, Frown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: string
}

interface QuizProps {
  subject: string
  topic: string
  questions: QuizQuestion[]
  onComplete: (score: number, userAnswers: UserAnswer[]) => void
}

interface UserAnswer {
  question: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [endTime, setEndTime] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    const currentQ = questions[currentQuestion]
    const correct = answer === currentQ.correctAnswer

    // Record the user answer
    setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selectedAnswer: answer,
        correctAnswer: currentQ.correctAnswer,
        isCorrect: correct,
      },
    ])

    if (correct) {
      setScore((prev) => prev + 1)
    }

    setTimeout(() => {
      setSelectedAnswer(null)
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        setEndTime(Date.now())
        setShowModal(true)
      }
    }, 1000)
  }

  // Calculate total time used
  const totalTime = endTime ? Math.floor((endTime - startTime) / 1000) : 0
  const percentage = (score / questions.length) * 100
  const passed = percentage >= 70

  const handleCloseModal = () => {
    setShowModal(false)
    onComplete(score, userAnswers) // Pass both score and user answers back
  }

  return (
    <div className="relative">
      <div className="max-w-2xl mx-auto p-6">
        {/* Progress bar */}
        <div className="w-full h-1 mb-6 bg-blue-100 dark:bg-blue-950/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 dark:bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="text-blue-600 dark:text-blue-400 font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="text-blue-600 dark:text-blue-400 font-medium">Score: {score}</div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-medium text-center mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 text-center border rounded-lg transition-all
                  ${
                    selectedAnswer === option
                      ? option === questions[currentQuestion].correctAnswer
                        ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                        : "bg-red-100 border-red-500 dark:bg-red-900/30"
                      : "hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20 dark:hover:border-blue-800"
                  }
                  ${!selectedAnswer ? "hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-950/20" : ""}
                `}
                whileHover={selectedAnswer ? {} : { scale: 1.02 }}
                whileTap={selectedAnswer ? {} : { scale: 0.98 }}
              >
                <span className="math">{option}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto relative">
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={handleCloseModal}
            >
              <XCircle className="h-5 w-5" />
            </Button>
            <div className="flex flex-col items-center">
              {passed ? (
                <Trophy className="h-12 w-12 text-yellow-500" />
              ) : (
                <Frown className="h-12 w-12 text-red-500" />
              )}
              <h2 className="text-2xl font-bold mt-4">Quiz Complete!</h2>
              <p className="mt-2">
                Your score: {score} / {questions.length} ({Math.floor(percentage)}%)
              </p>
              <p className="mt-2">Time taken: {totalTime} seconds</p>
            </div>
            {!passed && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Review Incorrect Answers:</h3>
                <ul className="list-disc pl-5">
                  {userAnswers
                    .filter((ans) => !ans.isCorrect)
                    .map((ans, idx) => (
                      <li key={idx} className="mb-1">
                        <strong>Q:</strong> {ans.question} <br />
                        <strong>Your answer:</strong> {ans.selectedAnswer} <br />
                        <strong>Correct answer:</strong> {ans.correctAnswer}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <Button onClick={handleCloseModal} className="mt-4">
              Close Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}