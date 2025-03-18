import React from "react";
import { School } from "lucide-react";
import { StepContainer } from "./StepContainer";
import { CustomDropdown } from "./CustomDropdown";
import { StepProps } from "@/types/create";
import { universities } from "@/lib/data";

export const SchoolStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData,
  schoolDropdownOpen,
  setSchoolDropdownOpen,
  schoolDropdownRef
}) => {
  const schoolOptions = formData.country 
    ? universities[formData.country as keyof typeof universities]?.map(uni => ({
        value: uni.value,
        label: uni.label
      })) || []
    : [];

  return (
    <StepContainer icon={<School className="w-8 h-8" />} title="What school do you attend?">
      {schoolDropdownOpen !== undefined && 
       setSchoolDropdownOpen !== undefined && 
       schoolDropdownRef && (
        <CustomDropdown
          value={formData.school}
          placeholder="Select your school"
          options={schoolOptions}
          onChange={(value) => updateFormData("school", value)}
          isOpen={schoolDropdownOpen}
          setIsOpen={setSchoolDropdownOpen}
          dropdownRef={schoolDropdownRef}
        />
      )}
    </StepContainer>
  );
};