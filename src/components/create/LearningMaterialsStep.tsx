import React from "react";
import { File, FileText, Video } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StepContainer } from "./StepContainer";
import { StepProps } from "@/types/create";

export const LearningMaterialsStep: React.FC<StepProps> = ({ 
  formData, 
  updateLearningMaterials,
  paidMember,
  checkPaidMembership
}) => {
  return (
    <StepContainer icon={<File className="w-8 h-8" />} title="Choose your learning materials">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="pdf"
            checked={formData.learningMaterials.pdf}
            onCheckedChange={() => updateLearningMaterials && updateLearningMaterials("pdf")}
          />
          <Label htmlFor="pdf" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>PDF Materials</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2" onClick={() => !paidMember && checkPaidMembership()}>
          <Checkbox
            id="video"
            checked={formData.learningMaterials.video}
            onCheckedChange={() => {
              if (paidMember && updateLearningMaterials) {
                updateLearningMaterials("video");
              }
            }}
            disabled={!paidMember}
          />
          <Label htmlFor="video" className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Video Lessons {!paidMember && "(Premium)"}</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="text"
            checked={formData.learningMaterials.text}
            onCheckedChange={() => updateLearningMaterials && updateLearningMaterials("text")}
          />
          <Label htmlFor="text" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Text-based Content</span>
          </Label>
        </div>
      </div>
    </StepContainer>
  );
};