import React from "react";
import { Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StepContainer } from "./StepContainer";
import { StepProps } from "@/types/create";
import { DifficultySelector } from "@/components/create/DifficultySelector";

export const CourseNameStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData,
  setSelectedLevel 
}) => {
  return (
    <StepContainer icon={<Book className="w-8 h-8" />} title="What course do you want to learn?">
      <Input
        placeholder="Enter course name"
        value={formData.course}
        onChange={(e) => updateFormData("course", e.target.value)}
        className="bg-input text-input-foreground mb-6"
      />
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Difficulty Level:</label>
        <DifficultySelector
          selectedDifficulty={formData.difficulty || "medium"}
          onChange={(difficulty) => {
            updateFormData("difficulty", difficulty);
            if (setSelectedLevel) setSelectedLevel(difficulty);
          }}
        />
      </div>
    </StepContainer>
  );
};