"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { File, Upload, X } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (files: File[]) => void
  maxFiles?: number
  accept?: Record<string, string[]>
}

export function FileUpload({
  onFileSelect,
  maxFiles = 10,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
  },
  className,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
      setFiles(newFiles)
      onFileSelect(newFiles)
    },
    maxFiles,
    accept,
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFileSelect(newFiles)
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary" : "border-muted-foreground/25",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? "Drop files here" : "Drag & drop files here, or click to select"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 group hover:bg-muted">
              {file.type.startsWith("image/") ? (
                <div className="relative w-8 h-8 rounded overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={file.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <File className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

