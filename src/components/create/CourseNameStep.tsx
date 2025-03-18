import React from "react";
import { Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StepContainer } from "./StepContainer";
import { StepProps } from "@/types/create";

export const CourseNameStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData 
}) => {
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
};