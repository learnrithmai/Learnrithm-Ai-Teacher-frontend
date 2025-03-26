"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { generateCourse } from "@/lib/course-api";

// Import step components
import { CourseNameStep } from "./CourseNameStep";
import { SubtopicStep } from "./SubtopicStep";
import { EducationLevelStep } from "./EducationLevelStep";
import { CountryStep } from "./CountryStep";
import { SchoolStep } from "./SchoolStep";
import { CurriculumStep } from "./CurriculumStep";
import { LearningMaterialsStep } from "./LearningMaterialsStep";
import { PDFUploadStep } from "./PDFUploadStep";
import { AnimatedProgress } from "./AnimatedProgress";
import { FloatingElements } from "./FloatingElements";

// Import types
import { FormData, StepProps } from "@/types/create";

// Constants for API endpoint and steps
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paidMember, setPaidMember] = useState(false);
  const [language, setLanguage] = useState("English");
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [skipSchool, setSkipSchool] = useState(false);

  // Dropdown states
  const [educationLevelDropdownOpen, setEducationLevelDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [curriculumDropdownOpen, setCurriculumDropdownOpen] = useState(false);
  
  // Dropdown refs for handling click outside
  const educationLevelDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const curriculumDropdownRef = useRef<HTMLDivElement>(null);

  // Update form data handler
  const updateFormData = (field: keyof FormData, value: string | File | { pdf: boolean; video: boolean; text: boolean; } | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset dependent fields when education level changes
    if (field === "educationLevel") {
      if (value === "skill") {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          country: "",
          school: "",
        }));
        setSkipSchool(true);
      } else {
        setSkipSchool(false);
      }
    }
    
    // Reset school when country changes
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        [field]: value as string,
        school: "",
      }));
    }
  };
  
  // Update learning materials handler
  const updateLearningMaterials = (field: keyof FormData["learningMaterials"]) => {
    setFormData((prev) => ({
      ...prev,
      learningMaterials: {
        ...prev.learningMaterials,
        [field]: !prev.learningMaterials[field],
      },
    }));
  };
  
  // Check for paid membership
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
  
  // Handle next step
  const nextStep = () => {
    // Validate current step
    if (currentStep === 0 && !formData.course.trim()) {
      toast({
        title: "Course name is required",
        description: "Please enter a course name to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 1 && !formData.subtopic.trim()) {
      toast({
        title: "Subtopics are required",
        description: "Please enter at least one subtopic to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && !formData.educationLevel) {
      toast({
        title: "Education level is required",
        description: "Please select your education level to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if free user has entered too many subtopics
    if (currentStep === 1 && !paidMember) {
      const subtopicCount = formData.subtopic.split(",").filter(s => s.trim()).length;
      if (subtopicCount > 5) {
        toast({
          title: "Too many subtopics",
          description: "Free members are limited to 5 subtopics. Please upgrade to add more.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Skip school step if skill development is selected
    if (currentStep === 3 && skipSchool) {
      setCurrentStep(currentStep + 2);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const prevStep = () => {
    if (currentStep === 5 && skipSchool) {
      setCurrentStep(currentStep - 2);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Final validation
    if (!formData.course.trim() || !formData.subtopic.trim() || !formData.educationLevel) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to generate your course.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if free user has selected premium features
    if (!paidMember) {
      const subtopicCount = formData.subtopic.split(",").filter(s => s.trim()).length;
      if (subtopicCount > 5) {
        toast({
          title: "Too many subtopics",
          description: "Free members are limited to 5 subtopics. Please upgrade to add more.",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.learningMaterials.video) {
        toast({
          title: "Premium Feature",
          description: "Video content is available for paid members only.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setProcessing(true);
    
    try {
      // Generate course structure
      const result = await generateCourse(
        formData, 
        language, 
        selectedLevel, 
        paidMember
      ) as {
        success: boolean;
        data?: unknown;
        message?: string;
        mainTopic?: string;
        type?: string;
        language?: string;
      };
      
      // Check if successful (fixed the typo from 'sesuccess' to 'result.success')
      if (result.success) {
        // Store metadata for use in the topics page
        const urlData = {
          jsonData: result.data,
          mainTopic: result.mainTopic,
          type: result.type,
          language: result.language,
          educationLevel: formData.educationLevel,
          selectedLevel: selectedLevel
        };
        
        // Save to localStorage for backup/state persistence
        try {
          localStorage.setItem('courseGenerationData', JSON.stringify(urlData));
        } catch {
          console.log('Could not save to localStorage');
        }
        
        // Redirect to topics page with query parameters
        router.push(`/create/topics?subject=${encodeURIComponent(formData.course)}&difficulty=${selectedLevel}&educationLevel=${formData.educationLevel}&subtopics=${encodeURIComponent(formData.subtopic)}`);
        
        // Don't show error toast on success or set processing to false
        // The component will unmount due to navigation
      } else {
        // Only show error toast and reset processing state if there was an error
        toast({
          title: "Error",
          description: result.message || "Failed to generate course content.",
          variant: "destructive",
        });
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error in course generation:", error);
      toast({
        title: "Error",
        description: "An error occurred while generating your course.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (educationLevelDropdownRef.current && !educationLevelDropdownRef.current.contains(event.target as Node)) {
        setEducationLevelDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target as Node)) {
        setSchoolDropdownOpen(false);
      }
      if (curriculumDropdownRef.current && !curriculumDropdownRef.current.contains(event.target as Node)) {
        setCurriculumDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render current step
  const renderStep = () => {
    const commonProps: StepProps = {
      formData,
      updateFormData,
      paidMember,
      checkPaidMembership,
      updateLearningMaterials,
      language,
      setLanguage,
      setSelectedLevel,
      educationLevelDropdownOpen,
      setEducationLevelDropdownOpen,
      educationLevelDropdownRef: educationLevelDropdownRef as React.RefObject<HTMLDivElement>,
      countryDropdownOpen,
      setCountryDropdownOpen,
      countryDropdownRef: countryDropdownRef as React.RefObject<HTMLDivElement>,
      schoolDropdownOpen,
      setSchoolDropdownOpen,
      schoolDropdownRef: schoolDropdownRef as React.RefObject<HTMLDivElement>,
      curriculumDropdownOpen,
      setCurriculumDropdownOpen,
      curriculumDropdownRef: curriculumDropdownRef as React.RefObject<HTMLDivElement>
    };

    switch (currentStep) {
      case 0:
        return <CourseNameStep {...commonProps} />;
      case 1:
        return <SubtopicStep {...commonProps} />;
      case 2:
        return <EducationLevelStep {...commonProps} />;
      case 3:
        return <CountryStep {...commonProps} />;
      case 4:
        return <SchoolStep {...commonProps} />;
      case 5:
        return <CurriculumStep {...commonProps} />;
      case 6:
        return <LearningMaterialsStep {...commonProps} />;
      case 7:
        return <PDFUploadStep {...commonProps} />;
      default:
        return <CourseNameStep {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Learning Journey</h1>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {skipSchool ? steps.length - 1 : steps.length}
          </p>
          <div className="mt-4">
            <AnimatedProgress 
              currentStep={currentStep} 
              totalSteps={steps.length}
              skipSchool={skipSchool}
            />
          </div>
        </div>
        
        <div className="bg-card border rounded-xl shadow-sm p-6 mb-8">
          {renderStep()}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || processing}
          >
            Back
          </Button>
          
          {currentStep === (skipSchool ? steps.length - 2 : steps.length - 1) ? (
            <Button 
              onClick={handleSubmit}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Topics...
                </>
              ) : (
                "Create Topics"
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      
      <FloatingElements />
    </div>
  );
}