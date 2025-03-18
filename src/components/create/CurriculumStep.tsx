import React from "react";
import { Book } from "lucide-react";
import { StepContainer } from "./StepContainer";
import { CustomDropdown } from "./CustomDropdown";
import { StepProps } from "@/types/create";

export const CurriculumStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData,
  curriculumDropdownOpen,
  setCurriculumDropdownOpen,
  curriculumDropdownRef
}) => {
  const curriculumOptions = [
    { value: "curriculum1", label: "Curriculum 1" },
    { value: "curriculum2", label: "Curriculum 2" },
    { value: "curriculum3", label: "Curriculum 3" }
  ];

  return (
    <StepContainer icon={<Book className="w-8 h-8" />} title="What's your curriculum?">
      {curriculumDropdownOpen !== undefined && 
       setCurriculumDropdownOpen !== undefined && 
       curriculumDropdownRef && (
        <CustomDropdown
          value={formData.curriculum}
          placeholder="Select your curriculum"
          options={curriculumOptions}
          onChange={(value) => updateFormData("curriculum", value)}
          isOpen={curriculumDropdownOpen}
          setIsOpen={setCurriculumDropdownOpen}
          dropdownRef={curriculumDropdownRef}
        />
      )}
    </StepContainer>
  );
};