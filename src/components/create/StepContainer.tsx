import React from "react";

interface StepContainerProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  icon, 
  title, 
  children 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
};