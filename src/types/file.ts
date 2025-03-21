export interface FileMetadata {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  userId?: string;
  path: string;
}

export interface FileAnalysisResult {
  fileId: string;
  content?: string;        // Extracted text content
  summary?: string;        // Summary of the file
  error?: string;          // Error message if processing failed
  analysisType: 'text' | 'vision' | 'data';
}

export interface FileUploadResponse {
  success: boolean;
  file?: {
    id: string;
    filename: string;
    contentType: string;
    size: number;
    uploadedAt: string;
    path: string;
  };
  error?: string;
}

export type SupportedFileTypes = 'application/pdf' | 'text/plain' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'image/jpeg' | 'image/png'; 

export interface FileProcessingRequest {
  file: FileMetadata;
  mode: 'study' | 'reason' | 'quiz' | 'homeworkhelper';
}

export interface FileProcessingResponse {
  success: boolean;
  analysisResult?: FileAnalysisResult;
  error?: string;
}