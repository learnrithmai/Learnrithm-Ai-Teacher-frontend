import React from "react";
import { Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StepContainer } from "./StepContainer";
import { StepProps } from "@/types/create";

export const SubtopicStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData,
  paidMember 
}) => {
  return (
    <StepContainer icon={<Book className="w-8 h-8" />} title="What subtopic interests you?">
      <Input
        placeholder="Enter subtopics (comma separated)"
        value={formData.subtopic}
        onChange={(e) => updateFormData("subtopic", e.target.value)}
        className="bg-input text-input-foreground"
      />
      <p className="text-xs text-gray-500 mt-1">
        {paidMember ? "Enter as many subtopics as you want" : "For free members, limited to 5 subtopics"}
      </p>
    </StepContainer>
  );
};