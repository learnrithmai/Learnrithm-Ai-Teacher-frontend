export interface FormData {
    course: string;
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
    updateFormData: (key: keyof FormData, value: any) => void;
    updateLearningMaterials?: (key: keyof FormData['learningMaterials']) => void;
    paidMember: boolean;
    checkPaidMembership: () => boolean;
    language?: string;
    setLanguage?: (value: string) => void;
    selectedLevel?: string;
    setSelectedLevel?: (value: string) => void;
    countryDropdownOpen?: boolean;
    setCountryDropdownOpen?: (value: boolean) => void;
    schoolDropdownOpen?: boolean;
    setSchoolDropdownOpen?: (value: boolean) => void;
    curriculumDropdownOpen?: boolean;
    setCurriculumDropdownOpen?: (value: boolean) => void;
    educationLevelDropdownOpen?: boolean;
    setEducationLevelDropdownOpen?: (value: boolean) => void;
    countryDropdownRef?: React.RefObject<HTMLDivElement>;
    schoolDropdownRef?: React.RefObject<HTMLDivElement>;
    curriculumDropdownRef?: React.RefObject<HTMLDivElement>;
    educationLevelDropdownRef?: React.RefObject<HTMLDivElement>;
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