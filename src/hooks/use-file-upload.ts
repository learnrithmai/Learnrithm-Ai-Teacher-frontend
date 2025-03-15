import { useState, useCallback } from 'react';

/**
 * Extends the File interface to include an optional preview URL
 */
export interface FileWithPreview extends File {
  preview?: string;
}

/**
 * Return type for the useFileUpload hook
 */
export interface UseFileUploadReturn {
  files: FileWithPreview[];
  addFiles: (newFiles: FileWithPreview[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
}

/**
 * Hook for managing file uploads with preview functionality
 */
export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  /**
   * Add new files to the file list
   */
  const addFiles = useCallback((newFiles: FileWithPreview[]): void => {
    // Create preview URLs for the files that don't have them
    const filesWithPreviews = newFiles.map((file: FileWithPreview) => {
      if (!file.preview && file.type.startsWith('image/')) {
        return Object.assign(file, {
          preview: URL.createObjectURL(file)
        });
      }
      return file;
    });
    
    setFiles((prevFiles: FileWithPreview[]) => [...prevFiles, ...filesWithPreviews]);
  }, []);

  /**
   * Remove a file at the specified index
   */
  const removeFile = useCallback((index: number): void => {
    setFiles((prevFiles: FileWithPreview[]) => {
      // Check if index is valid
      if (index < 0 || index >= prevFiles.length) {
        return prevFiles;
      }
      
      const newFiles = [...prevFiles];
      const fileToRemove = newFiles[index];
      
      // Safely revoke the object URL if it exists
      if (fileToRemove && typeof fileToRemove.preview === 'string') {
        try {
          URL.revokeObjectURL(fileToRemove.preview);
        } catch (error) {
          console.error('Error revoking object URL:', error);
        }
      }
      
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);
  
  /**
   * Clear all files and revoke their object URLs
   */
  const clearFiles = useCallback((): void => {
    setFiles((prevFiles: FileWithPreview[]) => {
      // Revoke all object URLs to prevent memory leaks
      prevFiles.forEach((file: FileWithPreview) => {
        if (file && typeof file.preview === 'string') {
          try {
            URL.revokeObjectURL(file.preview);
          } catch (error) {
            console.error('Error revoking object URL:', error);
          }
        }
      });
      return [];
    });
  }, []);

  return { files, addFiles, removeFile, clearFiles };
}