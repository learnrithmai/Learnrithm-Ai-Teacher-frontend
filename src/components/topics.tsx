"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Topic {
  name: string;
  description: string;
  subtopics: string[];
}

interface TopicContent {
  theory: string;
  videoQuery?: string;
  imagePrompt?: string;
  type: string;
}

interface GeneratedContent {
  name: string;
  mainTopic: string;
  content: TopicContent;
}

export default function SubjectsTopicsPage() {
  const router = useRouter();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/generate-topics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: "Mathematics", // Get this from your app state/route params
            difficulty: "medium",
            count: 5
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setTopics(data.data.topics);
          // Auto-expand first topic
          if (data.data.topics.length > 0) {
            setExpandedTopics([data.data.topics[0].name]);
          }
        } else {
          toast({
            title: "Error",
            description: data.message || "Failed to generate topics",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast({
          title: "Error",
          description: "Failed to load topics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const toggleTopic = (topicName: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const toggleSubtopic = (subtopic: string) => {
    setSelectedTopics(prev =>
      prev.includes(subtopic)
        ? prev.filter(t => t !== subtopic)
        : [...prev, subtopic]
    );
  };

  const handleSubmit = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "No topics selected",
        description: "Please select at least one topic to continue.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const generatedContent: GeneratedContent[] = [];
      
      // Generate content for each selected topic
      for (const subtopic of selectedTopics) {
        const topic = topics.find(t => t.subtopics.includes(subtopic));
        if (!topic) continue;

        const response = await fetch('/api/generate-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mainTopic: topic.name,
            subtopicTitle: subtopic,
            contentType: "Text & Image Course",
            educationLevel: "university", // Get this from your app state
            language: "English",
            selectedLevel: "medium"
          }),
        });

        const data = await response.json();
        if (data.success) {
          generatedContent.push({
            name: subtopic,
            mainTopic: topic.name,
            content: data.content as TopicContent
          });
        }
      }

      // Store generated content in localStorage
      localStorage.setItem('generatedTopics', JSON.stringify(generatedContent));

      // Navigate to courses page
      router.push('/create/topics/courses');
      
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate course content",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Generating Topics...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Select Topics to Learn
        </h1>
        
        <div className="grid gap-6">
          <AnimatePresence>
            {topics.map((topic) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => toggleTopic(topic.name)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <Book className="w-6 h-6" />
                        <span>{topic.name}</span>
                      </span>
                      {expandedTopics.includes(topic.name) ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </CardTitle>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedTopics.includes(topic.name) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            {topic.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            {topic.subtopics.map((subtopic) => (
                              <div key={subtopic} className="flex items-center space-x-2">
                                <Checkbox
                                  id={subtopic}
                                  checked={selectedTopics.includes(subtopic)}
                                  onCheckedChange={() => toggleSubtopic(subtopic)}
                                />
                                <Label htmlFor={subtopic}>{subtopic}</Label>
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
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}