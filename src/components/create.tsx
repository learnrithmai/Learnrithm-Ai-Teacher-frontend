"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Rocket, Book, School, Globe, Upload, FileText, Video, File, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { universities } from "@/lib/data"; // Import universities

// Added education level step
const steps = ["Course", "Subtopic", "Education Level", "Country", "School", "Curriculum", "Learning Materials", "PDF"];

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    course: "",
    subtopic: "",
    educationLevel: "", // New field for education level
    school: "",
    country: "",
    curriculum: "",
    learningMaterials: {
      pdf: false,
      video: false,
      text: false,
    },
    pdf: null as File | null,
  });

  // Custom dropdown state
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [curriculumDropdownOpen, setCurriculumDropdownOpen] = useState(false);
  const [educationLevelDropdownOpen, setEducationLevelDropdownOpen] = useState(false);
  
  // Refs for dropdown containers
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);
  const curriculumDropdownRef = useRef<HTMLDivElement>(null);
  const educationLevelDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateFormData = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateLearningMaterials = (key: keyof typeof formData.learningMaterials) => {
    setFormData((prev) => ({
      ...prev,
      learningMaterials: {
        ...prev.learningMaterials,
        [key]: !prev.learningMaterials[key],
      },
    }));
  };

  // Modified next step logic to skip school selection if "skill" is chosen
  const nextStep = () => {
    if (currentStep === 2 && formData.educationLevel === "skill") {
      // Skip school step if education level is "skill"
      setCurrentStep(5);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };
  
  const prevStep = () => {
    if (currentStep === 5 && formData.educationLevel === "skill") {
      // Go back to education level step when coming from curriculum step in skill path
      setCurrentStep(2);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    updateFormData("pdf", acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = () => {
    console.log("Submitting form data:", formData);
    toast({
      title: "Course Created!",
      description: "Your course has been successfully created.",
    });
    setFormData({
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
    setCurrentStep(0);
    // Redirect to topics page after submission
    router.push("/create/topics");
  };

  const isLastStep = currentStep === steps.length - 1;
  const canSubmit =
    formData.course &&
    formData.subtopic &&
    formData.educationLevel &&
    (formData.educationLevel === "skill" || formData.school) &&
    formData.country &&
    formData.curriculum &&
    (formData.learningMaterials.pdf || formData.learningMaterials.video || formData.learningMaterials.text);

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
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </div>
      </div>
      <FloatingElements />
    </div>
  );

  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <StepContainer icon={<Book className="w-8 h-8" />} title="What course do you want to learn?">
            <Input
              placeholder="Enter course name"
              value={formData.course}
              onChange={(e) => updateFormData("course", e.target.value)}
              className="bg-input text-input-foreground"
            />
          </StepContainer>
        );
      case 1:
        return (
          <StepContainer icon={<Book className="w-8 h-8" />} title="What subtopic interests you?">
            <Input
              placeholder="Enter subtopic"
              value={formData.subtopic}
              onChange={(e) => updateFormData("subtopic", e.target.value)}
              className="bg-input text-input-foreground"
            />
          </StepContainer>
        );
      case 2:
        return (
          <StepContainer icon={<GraduationCap className="w-8 h-8" />} title="What's your education level?">
            {/* Custom Education Level Dropdown */}
            <div ref={educationLevelDropdownRef} className="relative">
              <div 
                className="flex justify-between items-center p-3 rounded-md border cursor-pointer bg-white"
                onClick={() => setEducationLevelDropdownOpen(!educationLevelDropdownOpen)}
              >
                <span className={`${!formData.educationLevel ? 'text-gray-400' : ''}`}>
                  {formData.educationLevel === "highSchool" ? "High School" : 
                   formData.educationLevel === "kg12" ? "K-12" :
                   formData.educationLevel === "university" ? "University" :
                   formData.educationLevel === "skill" ? "Skill Development" :
                   "Select your education level"}
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform ${educationLevelDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {educationLevelDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("educationLevel", "highSchool");
                      setEducationLevelDropdownOpen(false);
                    }}
                  >
                    High School
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("educationLevel", "kg12");
                      setEducationLevelDropdownOpen(false);
                    }}
                  >
                    K-12
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("educationLevel", "university");
                      setEducationLevelDropdownOpen(false);
                    }}
                  >
                    University
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("educationLevel", "skill");
                      setEducationLevelDropdownOpen(false);
                    }}
                  >
                    Skill Development
                  </div>
                </div>
              )}
            </div>
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer icon={<Globe className="w-8 h-8" />} title="What's your country?">
            {/* Custom Country Dropdown */}
            <div ref={countryDropdownRef} className="relative">
              <div 
                className="flex justify-between items-center p-3 rounded-md border cursor-pointer bg-white"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              >
                <span className={`${!formData.country ? 'text-gray-400' : ''}`}>
                  {formData.country || "Select your country"}
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {countryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {Object.keys(universities).map((country) => (
                    <div 
                      key={country} 
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        updateFormData("country", country);
                        setCountryDropdownOpen(false);
                      }}
                    >
                      {country}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </StepContainer>
        );
      case 4:
        return (
          <StepContainer icon={<School className="w-8 h-8" />} title="What school do you attend?">
            {/* Custom School Dropdown */}
            <div ref={schoolDropdownRef} className="relative">
              <div 
                className="flex justify-between items-center p-3 rounded-md border cursor-pointer bg-white"
                onClick={() => setSchoolDropdownOpen(!schoolDropdownOpen)}
              >
                <span className={`${!formData.school ? 'text-gray-400' : ''}`}>
                  {formData.school ? 
                    universities[formData.country as keyof typeof universities]?.find(u => u.value === formData.school)?.label || "Select your school" :
                    "Select your school"
                  }
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform ${schoolDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {schoolDropdownOpen && formData.country && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {universities[formData.country as keyof typeof universities]?.map((university) => (
                    <div 
                      key={university.value} 
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        updateFormData("school", university.value);
                        setSchoolDropdownOpen(false);
                      }}
                    >
                      {university.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </StepContainer>
        );
      case 5:
        return (
          <StepContainer icon={<Book className="w-8 h-8" />} title="What's your curriculum?">
            {/* Custom Curriculum Dropdown */}
            <div ref={curriculumDropdownRef} className="relative">
              <div 
                className="flex justify-between items-center p-3 rounded-md border cursor-pointer bg-white"
                onClick={() => setCurriculumDropdownOpen(!curriculumDropdownOpen)}
              >
                <span className={`${!formData.curriculum ? 'text-gray-400' : ''}`}>
                  {formData.curriculum === "curriculum1" ? "Curriculum 1" :
                   formData.curriculum === "curriculum2" ? "Curriculum 2" :
                   formData.curriculum === "curriculum3" ? "Curriculum 3" :
                   "Select your curriculum"}
                </span>
                <ChevronDown className={`h-5 w-5 transition-transform ${curriculumDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {curriculumDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("curriculum", "curriculum1");
                      setCurriculumDropdownOpen(false);
                    }}
                  >
                    Curriculum 1
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("curriculum", "curriculum2");
                      setCurriculumDropdownOpen(false);
                    }}
                  >
                    Curriculum 2
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      updateFormData("curriculum", "curriculum3");
                      setCurriculumDropdownOpen(false);
                    }}
                  >
                    Curriculum 3
                  </div>
                </div>
              )}
            </div>
          </StepContainer>
        );
      case 6:
        return (
          <StepContainer icon={<File className="w-8 h-8" />} title="Choose your learning materials">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pdf"
                  checked={formData.learningMaterials.pdf}
                  onCheckedChange={() => updateLearningMaterials("pdf")}
                />
                <Label htmlFor="pdf" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF Materials</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="video"
                  checked={formData.learningMaterials.video}
                  onCheckedChange={() => updateLearningMaterials("video")}
                />
                <Label htmlFor="video" className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Video Lessons</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="text"
                  checked={formData.learningMaterials.text}
                  onCheckedChange={() => updateLearningMaterials("text")}
                />
                <Label htmlFor="text" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Text-based Content</span>
                </Label>
              </div>
            </div>
          </StepContainer>
        );
      case 7:
        return (
          <StepContainer icon={<Upload className="w-8 h-8" />} title="Upload your own PDF (Optional)">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary bg-opacity-10" : "border-muted"
              }`}
            >
              <input {...getInputProps()} />
              <p>Drag & drop your PDF here, or click to select</p>
              {formData.pdf && <p className="mt-2">File: {formData.pdf.name}</p>}
            </div>
            <Button onClick={nextStep} className="mt-4 w-full">
              Skip PDF Upload
            </Button>
          </StepContainer>
        );
      default:
        return null;
    }
  }
}

function StepContainer({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Enhanced progress bar to handle skipped steps
function AnimatedProgress({ 
  currentStep, 
  totalSteps,
  skipSchool
}: { 
  currentStep: number; 
  totalSteps: number;
  skipSchool: boolean;
}) {
  // Calculate adjusted progress based on whether school step is skipped
  const adjustedProgress = () => {
    if (skipSchool && currentStep >= 5) {
      // If we're skipping school and at or past the curriculum step
      return ((currentStep - 1) / (totalSteps - 2)) * 100;
    } 
    return (currentStep / (totalSteps - 1)) * 100;
  };

  return (
    <div className="relative">
      <Progress value={adjustedProgress()} className="h-2" />
      <motion.div
        className="absolute top-0 -mt-2"
        style={{ left: `calc(${adjustedProgress()}% - 8px)` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Rocket className="w-4 h-4 text-primary" />
      </motion.div>
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
        <School className="w-16 h-16 text-primary opacity-20" />
      </motion.div>
    </>
  );
}