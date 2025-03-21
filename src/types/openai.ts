export type MessageRole = 'user' | 'assistant' | 'system';
export type ChatMode = 'reason' | 'quiz' | 'study' | 'homeworkhelper';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface OpenAIRequestBody {
  messages: ChatMessage[];
  mode?: ChatMode;
  max_tokens?: number;
  temperature?: number;
  files?: string[]; // Array of file IDs
}

export interface OpenAIResponseData {
  id: string;
  content: string;
  created: number;
  model: string;
}

// System prompts for each mode
export const SYSTEM_PROMPTS: Record<ChatMode, string> = {
  study: "You are a helpful study assistant. Your goal is to help the student understand concepts clearly and learn effectively. Break down complex topics, provide clear explanations, and use examples when helpful.",
  
  reason: "You are a reasoning assistant. Your goal is to help the user think through problems step by step. Identify assumptions, analyze arguments, consider different perspectives, and help with logical problem solving.",
  
  quiz: "You are a quiz creator. Generate relevant questions based on the content provided. Create questions that test understanding rather than just recall. Provide answers and explanations after the questions.",
  
  homeworkhelper: "You are a homework helper. Your goal is to guide the student through solving problems without giving away complete answers. Provide hints, ask guiding questions, and explain concepts that will help them solve the problem on their own."
};

// Add system prompt based on mode
export function addSystemPrompt(messages: ChatMessage[], mode: ChatMode): ChatMessage[] {
  const systemPrompt = SYSTEM_PROMPTS[mode];
  
  // Check if there's already a system message
  const existingSystemIndex = messages.findIndex(msg => msg.role === 'system');
  
  if (existingSystemIndex >= 0) {
    // Replace existing system message
    return [
      { ...messages[existingSystemIndex], content: systemPrompt },
      ...messages.filter((_, i) => i !== existingSystemIndex)
    ];
  } else {
    // Add new system message at the beginning
    return [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
  }
}