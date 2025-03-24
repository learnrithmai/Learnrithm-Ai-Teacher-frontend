export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  files?: FilePreview[];
  chatId: string;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

export interface FilePreview {
  id: string;
  name: string;
  size: number;
  type: string;
  analysis?: AnalysisResult; 
}

export interface AnalysisResult {
  summary: string;
  details: string;
}

export interface ChatsByDate {
  [dateLabel: string]: Chat[];
}

export interface Mode {
  id: string;
  name: string;
  icon: React.ComponentType<any>; // Updated to accept React components
}

export interface FileProcessingRequest {
  file: File; // The file to be processed
  mode: string; // The mode in which to process the file (e.g., study, quiz)
}

export interface FileProcessingResponse {
  success: boolean;
  content?: string; // Extracted content from the file
  error?: string; // Error message if processing failed
}