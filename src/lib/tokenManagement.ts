import { ChatMessage } from '@/types/openai';

// Simple token estimator (1 token ≈ 4 characters for English text)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// More accurate token counting if you have access to tokenizer
export function countTokensAccurate(text: string): number {
  // Implement more accurate token counting if you have access to a tokenizer
  // For now, just use the simple estimator
  return estimateTokens(text);
}

// Trim conversation history to fit within token limits
export function trimConversationHistory(
  messages: ChatMessage[], 
  maxTokens: number = 4000,
  preserveRecentMessages: number = 4
): ChatMessage[] {
  // Always keep system message if present
  const systemMessage = messages.find(msg => msg.role === 'system');
  
  // Always keep the most recent N user/assistant message pairs
  const recentMessages = messages
    .filter(msg => msg.role !== 'system')
    .slice(-preserveRecentMessages);
  
  // Start with system message and recent messages we must keep
  let result = systemMessage ? [systemMessage] : [];
  result = [...result, ...recentMessages];
  
  // Calculate tokens used by required messages
  let tokenCount = result.reduce((total, msg) => total + estimateTokens(msg.content), 0);
  
  // Get remaining messages we might include (excluding system and recent messages)
  const remainingMessages = messages
    .filter(msg => msg.role !== 'system' && !recentMessages.includes(msg));
  
  // Add as many remaining messages as will fit under the token limit, starting from most recent
  for (let i = remainingMessages.length - 1; i >= 0; i--) {
    const msg = remainingMessages[i];
    const msgTokens = estimateTokens(msg.content);
    
    if (tokenCount + msgTokens <= maxTokens) {
      // Insert after system message but before recent messages
      result.splice(systemMessage ? 1 : 0, 0, msg);
      tokenCount += msgTokens;
    } else {
      // Skip this message as it would exceed the token limit
      continue;
    }
  }
  
  // Return messages in correct chronological order
  return result;
}

// Select appropriate model based on complexity and mode
export function selectAppropriateModel(
  messages: ChatMessage[],
  mode: string,
  defaultModel: string = "gpt-3.5-turbo"
): string {
  // Get the latest user message
  const latestUserMessage = [...messages]
    .reverse()
    .find(m => m.role === 'user')?.content || '';
  
  // Check complexity indicators
  const isComplex = 
    latestUserMessage.length > 500 || 
    /calculus|quantum|differential equations|thermodynamics|advanced|complex algorithm/i.test(latestUserMessage);
    
  // Use more capable model for complex questions or reasoning mode
  if (isComplex || mode === 'reason') {
    return "gpt-4o";
  }
  
  // For homework helper, check for specific subjects that might benefit from more advanced model
  if (mode === 'homeworkhelper' && 
      /physics|chemistry|mathematics|algebra|geometry|trigonometry|statistics/i.test(latestUserMessage)) {
    return "gpt-4o";
  }
  
  return defaultModel;
}