"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Rocket, Book, School, Globe, Upload, FileText, Video, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const steps = ["Course", "Subtopic", "School", "Country", "Curriculum", "Learning Materials", "PDF"];

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    course: "",
    subtopic: "",
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

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
    formData.school &&
    formData.country &&
    formData.curriculum &&
    (formData.learningMaterials.pdf || formData.learningMaterials.video || formData.learningMaterials.text);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        <AnimatedProgress currentStep={currentStep} totalSteps={steps.length} />
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
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
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
          <StepContainer icon={<School className="w-8 h-8" />} title="What school do you attend?">
            <Select onValueChange={(value) => updateFormData("school", value)}>
              <SelectTrigger className="bg-input text-input-foreground">
                <SelectValue placeholder="Select your school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school1">School 1</SelectItem>
                <SelectItem value="school2">School 2</SelectItem>
                <SelectItem value="school3">School 3</SelectItem>
              </SelectContent>
            </Select>
          </StepContainer>
        );
      case 3:
        return (
          <StepContainer icon={<Globe className="w-8 h-8" />} title="What's your country?">
            <Select onValueChange={(value) => updateFormData("country", value)}>
              <SelectTrigger className="bg-input text-input-foreground">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </StepContainer>
        );
      case 4:
        return (
          <StepContainer icon={<Book className="w-8 h-8" />} title="What's your curriculum?">
            <Select onValueChange={(value) => updateFormData("curriculum", value)}>
              <SelectTrigger className="bg-input text-input-foreground">
                <SelectValue placeholder="Select your curriculum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curriculum1">Curriculum 1</SelectItem>
                <SelectItem value="curriculum2">Curriculum 2</SelectItem>
                <SelectItem value="curriculum3">Curriculum 3</SelectItem>
              </SelectContent>
            </Select>
          </StepContainer>
        );
      case 5:
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
      case 6:
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

function AnimatedProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="relative">
      <Progress value={(currentStep / (totalSteps - 1)) * 100} className="h-2" />
      <motion.div
        className="absolute top-0 -mt-2"
        style={{ left: `calc(${(currentStep / (totalSteps - 1)) * 100}% - 8px)` }}
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