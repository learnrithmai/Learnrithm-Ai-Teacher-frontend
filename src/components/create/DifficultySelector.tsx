import React from "react";
import { Button } from "@/components/ui/button";

interface DifficultySelectorProps {
  selectedDifficulty: string;
  onChange: (difficulty: string) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onChange,
}) => {
  const difficulties = ["Easy", "Medium", "Hard"];

  return (
    <div className="flex space-x-2">
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty}
          variant={selectedDifficulty === difficulty.toLowerCase() ? "default" : "outline"}
          onClick={() => onChange(difficulty.toLowerCase())}
        >
          {difficulty}
        </Button>
      ))}
    </div>
  );
};