"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

// Import step components
import { CourseNameStep } from "@/components/create/CourseNameStep";
import { SubtopicStep } from "@/components/create/SubtopicStep";
import { EducationLevelStep } from "@/components/create/EducationLevelStep";
import { CountryStep } from "@/components/create/CountryStep";
import { SchoolStep } from "@/components/create/SchoolStep";
import { CurriculumStep } from "@/components/create/CurriculumStep";
import { LearningMaterialsStep } from "@/components/create/LearningMaterialsStep";
import { PDFUploadStep } from "@/components/create/PDFUploadStep";
import { AnimatedProgress } from "@/components/create/AnimatedProgress";
import { FloatingElements } from "@/components/create/FloatingElements";

// Import types
import { FormData } from "@/types/create";

// Constants for API endpoint and steps
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const steps = ["Course", "Subtopic", "Education Level", "Country", "School", "Curriculum", "Learning Materials", "PDF"];

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    course: "",
    subtopic: "",
    educationLevel: "",
    school: "",
    country: "",
    curriculum: "",
    learningMaterials: {
      pdf: false,
      video: false,
      text: false,
    },
    pdf: null,
  });
  
  // UI states
  const [processing, setProcessing] = useState(false);
  const [paidMember, setPaidMember] = useState(false);
  const [valid, setValid] = useState(true);
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  const [selectedLevel, setSelectedLevel] = useState("easy");

  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [curriculumDropdownOpen, setCurriculumDropdownOpen] = useState(false);
  const [educationLevelDropdownOpen, setEducationLevelDropdownOpen] = useState(false);
  
  // Dropdown refs
  const countryDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const schoolDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const curriculumDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const educationLevelDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  
  // Session validation
  useEffect(() => {
    const isVerified = sessionStorage.getItem("isVerified");
    if (!isVerified) {
      router.push("/create");
    }
    
    if (sessionStorage.getItem("type") !== "free") {
      setPaidMember(true);
    } else {
      const validCheck = async (uid: string) => {
        try {
          const dataToSend = { user: uid };
          const postURL = `${SERVER_URL}/api/valid`;
          const res = await axios.post(postURL, dataToSend);
          const responseData = res.data as { message: string };
          
          if (responseData.message !== "valid") {
            setValid(false);
          }
        } catch (error) {
          console.error("Error checking validity:", error);
          toast({
            title: "Error",
            description: "Failed to verify your account status.",
            variant: "destructive",
          });
        }
      };
      
      const uid = sessionStorage.getItem("uid");
      if (uid) validCheck(uid);
    }
  }, [router]);

  // Handle dropdown close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target as Node)) {
        setSchoolDropdownOpen(false);
      }
      if (curriculumDropdownRef.current && !curriculumDropdownRef.current.contains(event.target as Node)) {
        setCurriculumDropdownOpen(false);
      }
      if (educationLevelDropdownRef.current && !educationLevelDropdownRef.current.contains(event.target as Node)) {
        setEducationLevelDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form update handlers
  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    if (key === "subtopic") {
      const splitSubtopics = value.split(",").map((st: string) => st.trim()).filter(Boolean);
      setSubtopics(splitSubtopics);
    }
  };

  const updateLearningMaterials = (key: keyof FormData["learningMaterials"]) => {
    setFormData(prev => ({
      ...prev,
      learningMaterials: {
        ...prev.learningMaterials,
        [key]: !prev.learningMaterials[key],
      },
    }));
  };

  // Navigation handlers
  const nextStep = () => {
    if (currentStep === 2 && formData.educationLevel === "skill") {
      setCurrentStep(5); // Skip to curriculum step
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  
  const prevStep = () => {
    if (currentStep === 5 && formData.educationLevel === "skill") {
      setCurrentStep(2); // Go back to education level
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  // Premium feature check
  const checkPaidMembership = () => {
    if (!paidMember) {
      toast({
        title: "Premium Feature",
        description: "This feature is available for paid members only.",
        variant: "default",
      });
      return false;
    }
    return true;
  };
  
  // API processing
  const sendPrompt = async (prompt: string, mainTopic: string, selectedType: string) => {
    setProcessing(true);
    
    try {
      const postURL = `${SERVER_URL}/api/prompt`;
      const res = await axios.post(postURL, { prompt });
      const generatedText = (res.data as { generatedText: string }).generatedText;
      
      const cleanedJsonString = generatedText
        .replace(/```json/g, "")
        .replace(/```/g, "");
        
      try {
        const parsedJson = JSON.parse(cleanedJsonString);
        setProcessing(false);
        
        router.push(`/create/topics?data=${encodeURIComponent(JSON.stringify({
          jsonData: parsedJson,
          mainTopic: mainTopic.toLowerCase(),
          type: formData.learningMaterials.video ? "video & text course" : "text & image course",
          language: language,
        }))}`);
        
      } catch (error) {
        console.error("JSON parsing error:", error);
        sendPrompt(prompt, mainTopic, selectedType); // Retry on parsing error
      }
    } catch (error) {
      console.error("API error:", error);
      sendPrompt(prompt, mainTopic, selectedType); // Retry on API error
    }
  };

  // Form submission
  const handleSubmit = () => {
    // Validation
    if (!formData.course.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a course name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.subtopic.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter at least one subtopic.",
        variant: "destructive",
      });
      return;
    }
    
    if (!valid) {
      toast({
        title: "Account Issue",
        description: "There's an issue with your account. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    
    // Create prompt
    const topicCount = paidMember ? "7" : "4";
    
    const prompt = `Generate a list of Strict ${topicCount} topics based on the ${selectedLevel} or if the user has a ${formData.school} and should strictly get the information from ${formData.school} websites and any number sub topic for each topic for main title ${formData.course.toLowerCase()}, everything in single line. Those topics should be in ${language} language,Those ${topicCount} topics should Strictly include these topics :- ${formData.subtopic.toLowerCase()}. Strictly Keep theory, youtube, image field empty. Generate in the form of JSON in this format {
      "${formData.course.toLowerCase()}": [
       {
       "title": "Topic Title",
       "subtopics": [
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        },
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        }
       ]
       },
       {
       "title": "Topic Title",
       "subtopics": [
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        },
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        }
       ]
       }
      ]
    }`;
    
    const selectedType = formData.learningMaterials.video ? "Video & Text Course" : "Text & Image Course";
    sendPrompt(prompt, formData.course, selectedType);
  };

  // Submission control
  const isLastStep = currentStep === steps.length - 1;
  const canSubmit =
    formData.course &&
    formData.subtopic &&
    formData.educationLevel &&
    (formData.educationLevel === "skill" || formData.school) &&
    formData.country &&
    formData.curriculum &&
    (formData.learningMaterials.pdf || formData.learningMaterials.video || formData.learningMaterials.text);

  // Common props for step components
  const commonStepProps = {
    formData,
    updateFormData,
    updateLearningMaterials,
    paidMember,
    checkPaidMembership,
    nextStep
  };

  // Dropdown props
  const dropdownProps = {
    countryDropdownOpen,
    setCountryDropdownOpen,
    schoolDropdownOpen, 
    setSchoolDropdownOpen,
    curriculumDropdownOpen,
    setCurriculumDropdownOpen,
    educationLevelDropdownOpen,
    setEducationLevelDropdownOpen,
    countryDropdownRef,
    schoolDropdownRef,
    curriculumDropdownRef,
    educationLevelDropdownRef
  };

  // Render current step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CourseNameStep {...commonStepProps} />;
      case 1:
        return <SubtopicStep {...commonStepProps} />;
      case 2:
        return <EducationLevelStep 
          {...commonStepProps}
          {...dropdownProps} 
          language={language}
          setLanguage={setLanguage}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        />;
      case 3:
        return <CountryStep 
          {...commonStepProps}
          {...dropdownProps} 
        />;
      case 4:
        return <SchoolStep 
          {...commonStepProps}
          {...dropdownProps} 
        />;
      case 5:
        return <CurriculumStep 
          {...commonStepProps}
          {...dropdownProps} 
        />;
      case 6:
        return <LearningMaterialsStep {...commonStepProps} />;
      case 7:
        return <PDFUploadStep {...commonStepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        <AnimatedProgress 
          currentStep={currentStep} 
          totalSteps={formData.educationLevel === "skill" ? steps.length - 1 : steps.length}
          skipSchool={formData.educationLevel === "skill"} 
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Back
          </Button>
          {isLastStep ? (
            <Button onClick={handleSubmit} disabled={!canSubmit || processing}>
              {processing ? "Creating..." : "Submit"}
            </Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </div>
      </div>
      <FloatingElements />
    </div>
  );
}