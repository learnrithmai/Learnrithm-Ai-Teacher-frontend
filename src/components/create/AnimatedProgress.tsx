import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Rocket } from "lucide-react";

interface AnimatedProgressProps {
  currentStep: number;
  totalSteps: number;
  skipSchool: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ 
  currentStep, 
  totalSteps,
  skipSchool
}) => {
  const adjustedProgress = () => {
    if (skipSchool && currentStep >= 5) {
      return ((currentStep - 1) / (totalSteps - 2)) * 100;
    } 
    return (currentStep / (totalSteps - 1)) * 100;
  };

  return (
    <div className="relative">
      <Progress value={adjustedProgress()} className="h-2" />
      <motion.div
        className="absolute top-0 -mt-2"
        style={{ left: `calc(${adjustedProgress()}% - 8px)` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Rocket className="w-4 h-4 text-primary" />
      </motion.div>
    </div>
  );
};