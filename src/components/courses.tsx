"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Course {
  id: number
  title: string
  completed: boolean
  progress: number
}

const initialCourses: Course[] = [
  { id: 1, title: "Magic of Numbers", completed: true, progress: 100 },
  { id: 2, title: "Spelling Wizardry", completed: false, progress: 60 },
  { id: 3, title: "Science Adventures", completed: false, progress: 30 },
  { id: 4, title: "Art & Creativity", completed: false, progress: 0 },
]

export function Courses() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [courses, setCourses] = useState(initialCourses)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search your magical courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </motion.div>
      {filteredCourses.length === 0 && (
        <motion.p
          className="text-center text-xl text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          No magical courses found. Try another spell!
        </motion.p>
      )}
    </div>
  )
}

