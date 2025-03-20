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
    file?: FileMetadata;
    error?: string;
  }