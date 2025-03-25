export interface AnalysisResult {
    content?: string;
    summary: string;
    analysisType: 'text' | 'vision' | 'data';
  }
  
  export interface AnalysisResponse {
    success: boolean;
    filename?: string;
    contentType?: string;
    analysisResult?: AnalysisResult;
    error?: string;
  }
  
  export interface FileProcessingRequest {
    file: {
      id: string;
      filename: string;
      contentType: string;
      path: string;
      size?: number;
    };
    mode: string;
  }