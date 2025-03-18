import React from "react";
import { ChevronDown } from "lucide-react";
import { CustomDropdownProps } from "@/types/create";

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  placeholder,
  options,
  onChange,
  isOpen,
  setIsOpen,
  dropdownRef
}) => {
  return (
    <div ref={dropdownRef} className="relative">
      <div 
        className="flex justify-between items-center p-3 rounded-md border cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${!value ? 'text-gray-400' : ''}`}>
          {value ? options.find(opt => opt.value === value)?.label || placeholder : placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div 
              key={option.value} 
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};