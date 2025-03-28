export interface FormData {
  course: string;
  difficulty: string; // Add this line
  subtopic: string;
  educationLevel: string;
  school: string;
  country: string;
  curriculum: string;
  learningMaterials: {
    pdf: boolean;
    video: boolean;
    text: boolean;
  };
  pdf: File | null;
}

export interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string | File | { pdf: boolean; video: boolean; text: boolean; } | null) => void;
  paidMember?: boolean;
  checkPaidMembership?: () => boolean;
  updateLearningMaterials?: (field: keyof FormData["learningMaterials"]) => void;
  language?: string;
  setLanguage?: (language: string) => void;
  setSelectedLevel?: (level: string) => void;
  educationLevelDropdownOpen?: boolean;
  setEducationLevelDropdownOpen?: (open: boolean) => void;
  educationLevelDropdownRef?: React.RefObject<HTMLDivElement>;
  countryDropdownOpen?: boolean;
  setCountryDropdownOpen?: (open: boolean) => void;
  countryDropdownRef?: React.RefObject<HTMLDivElement>;
  schoolDropdownOpen?: boolean;
  setSchoolDropdownOpen?: (open: boolean) => void;
  schoolDropdownRef?: React.RefObject<HTMLDivElement>;
  curriculumDropdownOpen?: boolean;
  setCurriculumDropdownOpen?: (open: boolean) => void;
  curriculumDropdownRef?: React.RefObject<HTMLDivElement>;
}
  
  export interface CustomDropdownProps {
    value: string;
    placeholder: string;
    options: Array<{value: string; label: string}>;
    onChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
  }