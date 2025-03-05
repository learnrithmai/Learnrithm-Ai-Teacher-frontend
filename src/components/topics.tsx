"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronDown, ChevronUp, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// Constants for API endpoint
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TopicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [jsonData, setJsonData] = useState<any>(null);
  const [mainTopic, setMainTopic] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [level, setLevel] = useState<string>("easy");
  
  // Extract data from query string
  useEffect(() => {
    try {
      const urlData = searchParams.get("data");
      if (urlData) {
        const parsedData = JSON.parse(decodeURIComponent(urlData));
        setJsonData(parsedData.jsonData);
        setMainTopic(parsedData.mainTopic);
        setType(parsedData.type);
        setLanguage(parsedData.language);
      } else {
        router.push("/create");
      }
    } catch (error) {
      console.error("Error parsing URL data:", error);
      toast({
        title: "Error",
        description: "Failed to load course data. Please try again.",
        variant: "destructive",
      });
      router.push("/create");
    }
  }, [searchParams, router]);

  const toggleTopic = (topicTitle: string) => {
    setExpandedTopics((prev) => 
      prev.includes(topicTitle)
        ? prev.filter((title) => title !== topicTitle)
        : [...prev, topicTitle]
    );
  };
  
  const goBackToCreate = () => {
    router.push("/create");
  };

  // Function to generate course content
  const generateCourse = async () => {
    if (!jsonData || !mainTopic) {
      toast({
        title: "Error",
        description: "Course data is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const firstTopic = jsonData[mainTopic.toLowerCase()][0];
      const firstSubtopic = firstTopic.subtopics[0];
      
      if (type === "video & text course") {
        await handleVideoTextCourse(firstSubtopic.title);
      } else {
        await handleTextImageCourse(firstSubtopic.title);
      }
    } catch (error) {
      console.error("Error generating course:", error);
      setProcessing(false);
      toast({
        title: "Error",
        description: "Failed to generate course content. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handler for video & text course
  const handleVideoTextCourse = async (subtopicTitle: string) => {
    const query = `${subtopicTitle} ${mainTopic} in ${language}`;
    try {
      // Fetch YouTube video
      const videoResponse = await axios.post(`${SERVER_URL}/api/yt`, { prompt: query });
      const videoUrl = (videoResponse.data as { url: string }).url;
      
      // Get transcript
      const transcriptResponse = await axios.post(`${SERVER_URL}/api/transcript`, { prompt: videoUrl });
      let theory = "";
      
      try {
        const transcript = JSON.parse(transcriptResponse.data as string);
        const allText = transcript.map((item: any) => item.text);
        const concatenatedText = allText.join(' ');
        
        // Generate summary from transcript
        const prompt = `Teach me this theory as if you were explaining it to a student, considering educational standards. Explain "${concatenatedText}" using language and examples appropriate for this educational level. Please provide the explanation in ${language} to ensure better comprehension all in ${concatenatedText}.`;
        
        const summaryResponse = await axios.post(`${SERVER_URL}/api/generate`, { prompt });
        theory = (summaryResponse.data as { text: string }).text;
      } catch (error) {
        // Fallback if transcript fails
        const prompt = `Teach me about the subtopic "${subtopicTitle}" within the main topic "${mainTopic}" as if you were a professional teacher explaining it. Provide clear examples and ensure the content is validated by educational websites. Please avoid providing additional resources or images, and use ${language} to enhance understanding.`;
        
        const summaryResponse = await axios.post(`${SERVER_URL}/api/generate`, { prompt });
        theory = (summaryResponse.data as { text: string }).text;
      }
      
      // Update the first subtopic with content
      const updatedJsonData = {...jsonData};
      updatedJsonData[mainTopic.toLowerCase()][0].subtopics[0].theory = theory;
      updatedJsonData[mainTopic.toLowerCase()][0].subtopics[0].youtube = videoUrl;
      
      // Save course
      await saveCourseToDB(updatedJsonData, videoUrl, "");
      
    } catch (error) {
      console.error("Error in video course creation:", error);
      toast({
        title: "Error",
        description: "Failed to generate video course. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };
  
  // Handler for text & image course
  const handleTextImageCourse = async (subtopicTitle: string) => {
    try {
      // Generate theory content
      const theoryPrompt = `Teach me extensively about the subtopic "${subtopicTitle}" within the main topic "${mainTopic}", as if you were teaching a student. Provide detailed explanations with examples, and include citations from relevant educational resources that align with educational standards. Use ${language} to ensure better understanding. Please avoid providing additional resources or images.`;
      
      const theoryResponse = await axios.post(`${SERVER_URL}/api/generate`, { prompt: theoryPrompt });
      const theory = (theoryResponse.data as { text: string }).text;
      
      // Generate image
      const imagePrompt = `Provide an example of ${subtopicTitle} within the context of ${mainTopic}. Ensure the image clearly illustrates this concept in a way that aligns with educational standards and is appropriate for a student.`;
      
      const imageResponse = await axios.post(`${SERVER_URL}/api/image`, { prompt: imagePrompt });
      const imageUrl = (imageResponse.data as { url: string }).url;
      
      // Update the first subtopic with content
      const updatedJsonData = {...jsonData};
      updatedJsonData[mainTopic.toLowerCase()][0].subtopics[0].theory = theory;
      updatedJsonData[mainTopic.toLowerCase()][0].subtopics[0].image = imageUrl;
      
      // Save course
      await saveCourseToDB(updatedJsonData, "", imageUrl);
      
    } catch (error) {
      console.error("Error in text & image course creation:", error);
      toast({
        title: "Error",
        description: "Failed to generate course content. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };
  
  // Save course to database
  const saveCourseToDB = async (updatedData: any, videoUrl: string = "", imageUrl: string = "") => {
    try {
      const uid = sessionStorage.getItem("uid");
      const email = sessionStorage.getItem("email");
      
      if (!uid) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to save a course.",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }
      
      const courseData = {
        user: uid,
        email: email || "",
        content: JSON.stringify(updatedData),
        type: type,
        mainTopic: mainTopic.toLowerCase(),
        language: language
      };
      
      const response = await axios.post(`${SERVER_URL}/api/course`, courseData);
      
      const responseData = response.data as { success: boolean; message?: string; courseId?: string; completed?: boolean };
      if (responseData.success) {
        toast({
          title: "Success!",
          description: responseData.message || "Your course has been created successfully.",
        });
        
        // Save course data to session storage
        sessionStorage.setItem("courseId", responseData.courseId || "");
        sessionStorage.setItem("first", responseData.completed ? "true" : "false");
        sessionStorage.setItem("jsonData", JSON.stringify(updatedData));
        
        // Navigate to the course page
        router.push(`/course/${responseData.courseId}`);
      } else {
        throw new Error(responseData.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save your course. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  // Render the list of topics and subtopics
  const renderTopicsAndSubtopics = () => {
    if (!jsonData || !mainTopic || !jsonData[mainTopic.toLowerCase()]) {
      return <div>Loading course content...</div>;
    }
    
    return (
      <div className="space-y-4">
        <AnimatePresence>
          {jsonData[mainTopic.toLowerCase()].map((topic: any) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader 
                  className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors" 
                  onClick={() => toggleTopic(topic.title)}
                >
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Book className="w-6 h-6" />
                      <span>{topic.title}</span>
                    </span>
                    {expandedTopics.includes(topic.title) ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  {expandedTopics.includes(topic.title) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {topic.subtopics.map((subtopic: any) => (
                            <div key={subtopic.title} className="p-3 bg-gray-50 rounded-md">
                              {subtopic.title}
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
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-4xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">{mainTopic.toUpperCase()}</h1>
          <p className="text-gray-500">These are the topics and subtopics your course will cover</p>
        </div>
        
        {renderTopicsAndSubtopics()}
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={goBackToCreate}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          
          <Button
            onClick={generateCourse}
            disabled={processing}
            className="flex items-center gap-2"
          >
            {processing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Creating Course...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Teach Me</span>
              </>
            )}
          </Button>
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