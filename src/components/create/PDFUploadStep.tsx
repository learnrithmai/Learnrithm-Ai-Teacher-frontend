import React from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { StepContainer } from "./StepContainer";
import { StepProps } from "@/types/create";

export const PDFUploadStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData 
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    updateFormData("pdf", acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    } 
  });

  return (
    <StepContainer icon={<Upload className="w-8 h-8" />} title="Upload your own PDF (Optional)">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary bg-opacity-10" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <p>Drag & drop your PDF here, or click to select</p>
        {formData.pdf && <p className="mt-2">File: {formData.pdf.name}</p>}
      </div>
      <Button className="mt-4 w-full">
        Skip PDF Upload
      </Button>
    </StepContainer>
  );
};