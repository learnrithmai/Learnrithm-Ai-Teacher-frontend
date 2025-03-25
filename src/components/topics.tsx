"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

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

interface CourseInfo {
  subject: string;
  difficulty: string;
  educationLevel: string;
  createdAt: string;
}

export default function SubjectsTopicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL or use defaults
  const subject = searchParams?.get('subject') || "Mathematics";
  const difficulty = searchParams?.get('difficulty') || "medium";
  const educationLevel = searchParams?.get('educationLevel') || "university";
  const subtopics = searchParams?.get('subtopics') || "";
  
  // Use refs for values that shouldn't cause rerenders
  const subtopicsListRef = useRef<string[]>([]);
  // Initialize on mount but don't update it on rerenders
  useEffect(() => {
    subtopicsListRef.current = subtopics.split(',').map(s => s.trim()).filter(Boolean);
  }, []); // Empty dependency - run once on mount
  
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [topics, setTopics] = useState<Topic[]>([]);
  
  // Use refs instead of state for values that should persist but not cause rerenders
  const retryCountRef = useRef(0);
  const fetchRequestSentRef = useRef(false);
  const isMountedRef = useRef(true);
  
  // Fetch topics only once on initial mount
  useEffect(() => {
    // Set isMounted flag for cleanup
    isMountedRef.current = true;
    
    // Only fetch if we haven't already
    if (fetchRequestSentRef.current) return;
    
    // Mark that we've sent a fetch request
    fetchRequestSentRef.current = true;
    
    const fetchTopics = async () => {
      // Check if component is still mounted
      if (!isMountedRef.current) return;
      
      try {
        // Validate subject
        if (!subject) {
          if (isMountedRef.current) {
            toast({
              title: "Missing Subject",
              description: "Please select a subject on the previous page.",
              variant: "destructive",
            });
            router.push("/create");
          }
          return;
        }
        
        console.log(`Fetching topics for ${subject} with subtopics: ${subtopicsListRef.current.join(', ')}`);
        
        const response = await fetch('/api/generate-topics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject,
            difficulty,
            educationLevel,
            subtopics: subtopicsListRef.current,
            count: 5
          }),
        });
        
        // Check if component is still mounted after fetch completes
        if (!isMountedRef.current) return;
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        if (data.success) {
          if (data.data && Array.isArray(data.data.topics) && data.data.topics.length > 0) {
            // Only update state if component is mounted
            if (isMountedRef.current) {
              setTopics(data.data.topics);
              setExpandedTopics([data.data.topics[0].name]);
              setError(null);
              console.log(`Successfully loaded ${data.data.topics.length} topics`);
              setLoading(false); // Set loading to false on success
            }
          } else {
            throw new Error("Invalid data structure returned from API");
          }
        } else {
          throw new Error(data.message || "Failed to generate topics");
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
        
        // Only update state if component is mounted
        if (isMountedRef.current) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          
          // Handle retry logic with ref counter
          if (retryCountRef.current < 2) {
            retryCountRef.current += 1;
            
            toast({
              title: "Retrying...",
              description: `Attempt ${retryCountRef.current}/3 to load topics`,
            });
            
            // Set a timeout for retry
            setTimeout(() => {
              // Check again if component is mounted before retrying
              if (isMountedRef.current) {
                fetchTopics(); // Retry the fetch
              }
            }, 2000);
          } else {
            // Set final error state after all retries fail
            setError(errorMessage);
            setLoading(false);
            
            toast({
              title: "Error",
              description: "Failed to load topics after multiple attempts. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    // Execute the fetch
    fetchTopics();
    
    // Cleanup function to prevent state updates on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array - run once on mount

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
    setProgress(0);
    const generatedContent: GeneratedContent[] = [];
    const totalTopics = selectedTopics.length;

    try {
      for (let i = 0; i < selectedTopics.length; i++) {
        const subtopic = selectedTopics[i];
        const topic = topics.find(t => t.subtopics.includes(subtopic));
        if (!topic) continue;

        try {
          const response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mainTopic: topic.name,
              subtopicTitle: subtopic,
              contentType: "Text & Image Course",
              educationLevel: educationLevel,
              subject: subject,
              relatedSubtopics: subtopicsListRef.current,
              difficulty: difficulty,
              language: "English"
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.success && data.content) {
            generatedContent.push({
              name: subtopic,
              mainTopic: topic.name,
              content: data.content as TopicContent
            });

            // Update progress
            const currentProgress = Math.round(((i + 1) / totalTopics) * 100);
            setProgress(currentProgress);

            toast({
              title: "Progress",
              description: `Generated content for ${subtopic} (${currentProgress}%)`,
            });
          }
        } catch (error) {
          console.error(`Error generating content for ${subtopic}:`, error);
          toast({
            title: "Warning",
            description: `Failed to generate content for ${subtopic}. Continuing with remaining topics...`,
            variant: "destructive",
          });
        }
      }

      if (generatedContent.length > 0) {
        // Store generated content and course info
        localStorage.setItem('generatedTopics', JSON.stringify(generatedContent));
        
        // Store course metadata
        const courseInfo: CourseInfo = {
          subject,
          difficulty,
          educationLevel,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('courseInfo', JSON.stringify(courseInfo));
        
        toast({
          title: "Success",
          description: `Successfully generated ${generatedContent.length} topics for ${subject}`,
        });
        router.push('/create/topics/courses');
      } else {
        throw new Error("No content was generated successfully");
      }
    } catch (error) {
      console.error("Error in content generation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  // Show error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Topics</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push("/create")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Generating Topics for {subject}</h2>
          <p className="text-muted-foreground mt-2">Difficulty: {difficulty} • Level: {educationLevel}</p>
          {subtopicsListRef.current.length > 0 && (
            <div className="mt-4 max-w-md mx-auto">
              <p className="text-sm font-medium">Focusing on:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {subtopicsListRef.current.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {retryCountRef.current > 0 ? `Retry attempt ${retryCountRef.current}/3...` : ""}
          </p>
        </div>
      </div>
    );
  }

  // Check if topics actually loaded
  if (!topics || topics.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">No Topics Generated</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't generate any topics for "{subject}". Please try again with different parameters.
          </p>
          <Button onClick={() => router.push("/create")}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Content loaded state
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          {subject} Topics
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Select topics you want to learn at {difficulty} difficulty level
        </p>
        
        {subtopicsListRef.current.length > 0 && (
          <div className="p-4 bg-muted rounded-lg mb-6">
            <p className="text-sm font-medium mb-2">Topics are based on your selected areas:</p>
            <div className="flex flex-wrap gap-2">
              {subtopicsListRef.current.map((item, index) => (
                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        
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

        {generating && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              Generating content... {progress}%
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/create")}>
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={generating || selectedTopics.length === 0}
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