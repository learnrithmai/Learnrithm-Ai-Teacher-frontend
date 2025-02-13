"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const subjects = [
  {
    name: "Mathematics",
    topics: ["Algebra", "Geometry", "Calculus", "Statistics", "Trigonometry"],
  },
  {
    name: "Science",
    topics: ["Biology", "Chemistry", "Physics", "Earth Science", "Astronomy"],
  },
  {
    name: "English",
    topics: ["Literature", "Grammar", "Writing", "Vocabulary", "Comprehension"],
  },
  {
    name: "History",
    topics: ["World History", "American History", "European History", "Ancient Civilizations", "Modern History"],
  },
  {
    name: "Art",
    topics: ["Drawing", "Painting", "Sculpture", "Art History", "Digital Art"],
  },
];

export default function SubjectsTopicsPage() {
  const router = useRouter();
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((name) => name !== subjectName)
        : [...prev, subjectName],
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

const handleSubmit = () => {
  if (selectedTopics.length === 0) {
    toast({
      title: "No topics selected",
      description: "Please select at least one topic to continue.",
      variant: "destructive",
    });
    return;
  }
  console.log("Selected topics:", selectedTopics);
  toast({
    title: "Topics Submitted!",
    description: `You've selected ${selectedTopics.length} topics.`,
  });
  router.push("/create/topics/courses"); // Redirect line added here
};

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8"> Select what Matches what you want to learn</h1>
        <div className="grid gap-6">
          <AnimatePresence>
            {subjects.map((subject) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="cursor-pointer" onClick={() => toggleSubject(subject.name)}>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Book className="w-6 h-6" />
                        <span>{subject.name}</span>
                      </span>
                      {expandedSubjects.includes(subject.name) ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSubjects.includes(subject.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 gap-4">
                            {subject.topics.map((topic) => (
                              <div key={topic} className="flex items-center space-x-2">
                                <Checkbox
                                  id={topic}
                                  checked={selectedTopics.includes(topic)}
                                  onCheckedChange={() => toggleTopic(topic)}
                                />
                                <Label htmlFor={topic}>{topic}</Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/create")}>
            Return to Create Page
          </Button>
          <Button onClick={handleSubmit}>Submit Selected Topics</Button>
        </div>
      </div>
      <FloatingElements />
    </div>
  );
}

function FloatingElements() {
  return (
    <>
      <motion.div
        className="fixed top-10 left-10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <Book className="w-12 h-12 text-primary opacity-20" />
      </motion.div>
      <motion.div
        className="fixed bottom-10 right-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <Book className="w-16 h-16 text-primary opacity-20" />
      </motion.div>
    </>
  );
}