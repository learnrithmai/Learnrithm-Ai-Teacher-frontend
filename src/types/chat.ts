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
  }
  
  export interface ChatsByDate {
    [dateLabel: string]: Chat[];
  }
  
  export interface Mode {
    id: string;
    name: string;
    icon: string;
  }