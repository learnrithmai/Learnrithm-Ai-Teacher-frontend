"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Book, CheckCircle, Download, Play } from "lucide-react"

interface CourseCardProps {
  course: {
    id: number
    title: string
    completed: boolean
    progress: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
            <span className="truncate mr-2">{course.title}</span>
            {course.completed ? (
              <CheckCircle className="text-green-500 flex-shrink-0" />
            ) : (
              <Book className="text-blue-500 flex-shrink-0" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={course.progress} className="mb-2" />
          <p className="text-sm text-gray-500">{course.completed ? "Completed" : `${course.progress}% Complete`}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant={course.completed ? "outline" : "default"}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2"
            disabled={course.completed}
          >
            <span className="truncate">{course.completed ? "Completed" : "Resume Course"}</span>
            {course.completed ? (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Play className="h-4 w-4 flex-shrink-0" />
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-1/2 flex items-center justify-center gap-2"
            disabled={!course.completed}
          >
            <span className="truncate">Certificate</span>
            <Download className="h-4 w-4 flex-shrink-0" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

