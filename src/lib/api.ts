import { NextResponse } from 'next/server';
import { ChatMessage, OpenAIRequestBody, ChatMode, SYSTEM_PROMPTS, MODE_MODEL_MAP } from '@/types/openai';
import openai, { handleOpenAIError } from '@/lib/openai';
import { trimConversationHistory, selectAppropriateModel } from '@/lib/tokenManagement';
import { getCachedResponse, setCachedResponse, generateCacheKey } from '@/lib/cache';

// Validate chat request
export function validateChatRequest(body: any): { isValid: boolean; errorMessage?: string } {
  if (!body) {
    return { isValid: false, errorMessage: 'Request body is required' };
  }
  
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return { isValid: false, errorMessage: 'Messages are required and must be an array' };
  }
  
  return { isValid: true };
}

// Add system prompt based on mode
export function addSystemPrompt(messages: ChatMessage[], mode: ChatMode): ChatMessage[] {
  const systemPrompt = SYSTEM_PROMPTS[mode];
  
  // Check if a system message already exists
  const hasSystemMessage = messages.some(msg => msg.role === 'system');
  
  if (hasSystemMessage) {
    return messages;
  }
  
  return [
    { 
      role: 'system',
      content: systemPrompt
    },
    ...messages
  ];
}

// Usage tracking
let totalTokensUsed = 0;
let requestCount = 0;

// Process chat request with all optimizations
export async function processChatRequest(
  messages: ChatMessage[],
  options: { 
    max_tokens?: number;
    temperature?: number;
    model?: string;
    mode?: ChatMode;
    useCache?: boolean;
  } = {}
) {
  try {
    const { 
      max_tokens = 1000, 
      temperature = 0.7, 
      model: explicitModel,
      mode,
      useCache = true
    } = options;
    
    // Select model based on mode and message content if not explicitly provided
    const defaultModel = mode ? MODE_MODEL_MAP[mode as ChatMode] : "gpt-3.5-turbo";
    const model = explicitModel || (mode ? selectAppropriateModel(messages, mode, defaultModel) : defaultModel);
    
    // Trim messages to fit token limits
    const trimmedMessages = trimConversationHistory(messages, 4000, 4);
    
    // Try to get from cache if enabled
    if (useCache) {
      const cacheKey = generateCacheKey(trimmedMessages, mode);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(cachedResponse);
      }
    }
    
    // Track request
    requestCount++;
    
    // Make API call
    const completion = await openai.chat.completions.create({
      model,
      messages: trimmedMessages,
      max_tokens,
      temperature,
    });
    
    // Track token usage
    if (completion.usage) {
      totalTokensUsed += completion.usage.total_tokens;
    }
    
    // Format response
    const response = {
      id: completion.id,
      content: completion.choices[0].message.content || '',
      created: completion.created,
    };
    
    // Store in cache if enabled
    if (useCache) {
      const cacheKey = generateCacheKey(trimmedMessages, mode);
      setCachedResponse(cacheKey, response);
    }
    
    return NextResponse.json(response);
  } catch (error) {
    const { message, status } = handleOpenAIError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Get usage statistics
export function getUsageStats() {
  return {
    totalRequests: requestCount,
    totalTokensUsed,
    // Estimated cost at $0.01 per 1K tokens for gpt-3.5-turbo
    estimatedCost: `$${((totalTokensUsed / 1000) * 0.01).toFixed(2)}`,
  };
}