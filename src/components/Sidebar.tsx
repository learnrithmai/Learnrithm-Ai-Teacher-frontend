"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onSubjectSelect: (subject: string) => void
  onTopicSelect: (subject: string, topic: string) => void
}

const subjects = [
  {
    name: "Mathematics",
    topics: ["Algebra", "Geometry", "Calculus"],
  },
  {
    name: "Science",
    topics: ["Biology", "Chemistry", "Physics"],
  },
  {
    name: "Language Arts",
    topics: ["Grammar", "Literature", "Writing"],
  },
]

export default function Sidebar({ onSubjectSelect, onTopicSelect }: SidebarProps) {
  const [openSubject, setOpenSubject] = useState<string | null>(null)

  const handleSubjectClick = (subjectName: string) => {
    setOpenSubject(openSubject === subjectName ? null : subjectName)
    onSubjectSelect(subjectName)
  }

  return (
    <nav className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Sparkles className="mr-2" /> Subjects
      </h2>
      {subjects.map((subject) => (
        <div key={subject.name} className="mb-2">
          <Button
            variant="ghost"
            className="w-full justify-between mb-2"
            onClick={() => handleSubjectClick(subject.name)}
          >
            {subject.name}
            {openSubject === subject.name ? <ChevronDown className="ml-2" /> : <ChevronRight className="ml-2" />}
          </Button>
          {openSubject === subject.name && (
            <ul className="ml-4 space-y-2">
              {subject.topics.map((topic) => (
                <li key={topic}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onTopicSelect(subject.name, topic)}
                  >
                    {topic}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}

