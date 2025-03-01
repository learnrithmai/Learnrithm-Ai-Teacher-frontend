"use client"

import * as React from "react"

interface UseFileUploadOptions {
  maxSize?: number
  maxFiles?: number
  acceptedTypes?: string[]
}

interface FileWithPreview extends File {
  preview?: string
}

export function useFileUpload({
  maxSize = 5 * 1024 * 1024,
  maxFiles = 10,
  acceptedTypes = ["image/*", "application/pdf"],
}: UseFileUploadOptions = {}) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const cleanup = React.useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
  }, [files])

  React.useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const validateFile = React.useCallback(
    (file: File): boolean => {
      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
        return false
      }

      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const baseType = type.split("/")[0]
          return file.type.startsWith(`${baseType}/`)
        }
        return file.type === type
      })

      if (!isValidType) {
        setError(`File type must be one of: ${acceptedTypes.join(", ")}`)
        return false
      }

      return true
    },
    [maxSize, acceptedTypes],
  )

  const addFiles = React.useCallback(
    (newFiles: FileList | File[]) => {
      setError(null)

      const validFiles = Array.from(newFiles)
        .filter(validateFile)
        .slice(0, maxFiles - files.length)

      const filesWithPreviews = validFiles.map((file) => {
        if (file.type.startsWith("image/")) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        }
        return file
      })

      setFiles((prev) => [...prev, ...filesWithPreviews])
    },
    [files.length, maxFiles, validateFile],
  )

  const removeFile = React.useCallback((index: number) => {
    setFiles((prev) => {
      const file = prev[index]
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const clearFiles = React.useCallback(() => {
    cleanup()
    setFiles([])
  }, [cleanup])

  return {
    files,
    error,
    addFiles,
    removeFile,
    clearFiles,
  }
}

