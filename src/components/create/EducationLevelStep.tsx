import React from "react";
import { GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StepContainer } from "./StepContainer";
import { CustomDropdown } from "./CustomDropdown";
import { StepProps } from "@/types/create";

export const EducationLevelStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData,
  paidMember,
  checkPaidMembership,
  language,
  setLanguage,
  setSelectedLevel,
  educationLevelDropdownOpen,
  setEducationLevelDropdownOpen,
  educationLevelDropdownRef
}) => {
  const educationOptions = [
    { value: "highSchool", label: "High School" },
    { value: "kg12", label: "K-12" },
    { value: "university", label: "University" },
    { value: "skill", label: "Skill Development" }
  ];
  
  const handleEducationChange = (value: string) => {
    updateFormData("educationLevel", value);
    
    // Set level based on selection
    if (value === "highSchool" && setSelectedLevel) setSelectedLevel("medium");
    else if (value === "kg12" && setSelectedLevel) setSelectedLevel("easy");
    else if (value === "university" && setSelectedLevel) setSelectedLevel("advanced");
    else if (value === "skill" && setSelectedLevel) setSelectedLevel("medium");
  };

  return (
    <StepContainer icon={<GraduationCap className="w-8 h-8" />} title="What's your education level?">
      {educationLevelDropdownOpen !== undefined && 
       setEducationLevelDropdownOpen !== undefined && 
       educationLevelDropdownRef && (
        <CustomDropdown
          value={formData.educationLevel}
          placeholder="Select your education level"
          options={educationOptions}
          onChange={handleEducationChange}
          isOpen={educationLevelDropdownOpen}
          setIsOpen={setEducationLevelDropdownOpen}
          dropdownRef={educationLevelDropdownRef}
        />
      )}
      
      <div className="mt-3">
        <Label className="text-sm font-medium">Select Language</Label>
        <Select 
          value={language} 
          onValueChange={(value) => {
            if (!paidMember) {
              checkPaidMembership();
              return;
            }
            if (setLanguage) setLanguage(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </StepContainer>
  );
};