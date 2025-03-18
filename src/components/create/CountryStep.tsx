import React from "react";
import { Globe } from "lucide-react";
import { StepContainer } from "./StepContainer";
import { CustomDropdown } from "./CustomDropdown";
import { StepProps } from "@/types/create";
import { universities } from "@/lib/data";

export const CountryStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData,
  countryDropdownOpen,
  setCountryDropdownOpen,
  countryDropdownRef
}) => {
  const countryOptions = Object.keys(universities).map(country => ({
    value: country,
    label: country
  }));

  return (
    <StepContainer icon={<Globe className="w-8 h-8" />} title="What's your country?">
      {countryDropdownOpen !== undefined && 
       setCountryDropdownOpen !== undefined && 
       countryDropdownRef && (
        <CustomDropdown
          value={formData.country}
          placeholder="Select your country"
          options={countryOptions}
          onChange={(value) => updateFormData("country", value)}
          isOpen={countryDropdownOpen}
          setIsOpen={setCountryDropdownOpen}
          dropdownRef={countryDropdownRef}
        />
      )}
    </StepContainer>
  );
};