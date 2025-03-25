import { ChatMessage } from '@/types/openai';

// Trim conversation history to manage token usage
export function trimConversationHistory(messages: ChatMessage[], maxTokens: number, minMessages: number): ChatMessage[] {
  // This is a simplified version that keeps a fixed number of messages
  // In a real implementation, you'd estimate tokens and trim accordingly
  
  // Always keep the system message if present
  const systemMessage = messages.find(msg => msg.role === 'system');
  let trimmedMessages = [...messages];
  
  // If there are more messages than minimum, keep only the most recent ones
  if (messages.length > minMessages) {
    // Keep the most recent messages
    trimmedMessages = messages.slice(-minMessages);
    
    // Ensure system message is included if it exists
    if (systemMessage && !trimmedMessages.includes(systemMessage)) {
      trimmedMessages = [systemMessage, ...trimmedMessages];
    }
  }
  
  return trimmedMessages;
}

// Select appropriate model based on complexity and subject
export function selectAppropriateModel(lastUserMessage: string): string {
  const complexityIndicators = [
    'advanced', 'complex', 'graduate', 'university level', 'difficult',
    'physics', 'quantum', 'advanced mathematics', 'biochemistry', 'theoretical', 'phd', 'thesis'
  ];
  
  // Check if message contains any complexity indicators
  const isComplex = complexityIndicators.some(indicator => 
    lastUserMessage.toLowerCase().includes(indicator.toLowerCase())
  );
  
  return isComplex ? "gpt-4" : "gpt-3.5-turbo";
}