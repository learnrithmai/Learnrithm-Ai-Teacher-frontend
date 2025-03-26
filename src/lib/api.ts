import { NextResponse } from 'next/server';
import { ChatMessage } from '@/types/openai';
import openai, { handleOpenAIError } from '@/lib/openai';
import { trimConversationHistory, selectAppropriateModel } from '@/lib/tokenManagement';
import { 
  generateCacheKey, 
  getCachedResponse, 
  setCachedResponse 
} from '@/lib/cache';

// Validate chat request
export function validateChatRequest(body: { messages?: ChatMessage[] }): { isValid: boolean; errorMessage?: string } {
  if (!body) {
    return { isValid: false, errorMessage: 'Request body is required' };
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return { isValid: false, errorMessage: 'Messages array is required and cannot be empty' };
  }

  return { isValid: true };
}

// Add a system prompt based on the conversation mode
export function addSystemPrompt(messages: ChatMessage[], mode: string): ChatMessage[] {
  const systemPrompts: Record<string, string> = {
    study: "You are an educational AI tutor. Provide clear, concise explanations with examples. Break down complex topics step-by-step. When appropriate, use analogies to illustrate concepts. Be encouraging and supportive, but focus on accuracy and educational value.",
    reason: "You are an analytical reasoning assistant. Your purpose is to help users think through problems logically. Focus on breaking down complex issues, identifying assumptions, evaluating evidence, and constructing sound arguments. Help users understand different perspectives on issues. Present balanced viewpoints and highlight logical fallacies when they appear.",
    quiz: "You are an educational quiz generator. Create engaging, accurate questions on the topic the user specifies. Include a mix of question types (multiple choice, short answer, etc). Provide correct answers and explanations after the user attempts to answer. Adjust difficulty based on user performance. Be encouraging but prioritize educational value.",
    homeworkhelper: "You are a homework assistance tutor. Help students understand their homework problems by guiding them through the solution process without giving direct answers. Provide explanations, examples, and hints that lead to understanding. Encourage critical thinking and independent problem solving. Focus on teaching underlying concepts rather than just getting to the answer.",
    default: "You are a helpful AI assistant."
  };

  const systemPrompt = systemPrompts[mode] || systemPrompts.default;
  
  // Check if there's already a system message at the beginning
  if (messages.length > 0 && messages[0].role === 'system') {
    // Replace existing system message
    return [{ role: 'system', content: systemPrompt }, ...messages.slice(1)];
  } else {
    // Add new system message at the beginning
    return [{ role: 'system', content: systemPrompt }, ...messages];
  }
}

// Process a chat request with OpenAI
export async function processChatRequest(
  messages: ChatMessage[],
  options: {
    max_tokens?: number;
    temperature?: number;
    model?: string;
    mode?: string;
    useCache?: boolean;
    trimTokens?: number;
    minMessages?: number;
    autoSelectModel?: boolean;
  }
) {
  try {
    // Apply message trimming if specified
    let processedMessages = messages;
    if (options.trimTokens && options.minMessages) {
      processedMessages = trimConversationHistory(messages, options.trimTokens, options.minMessages);
    }
    
    // Auto-select model based on content if enabled
    let model = options.model || 'gpt-3.5-turbo';
    if (options.autoSelectModel) {
      // Find the last user message
      const lastUserMsg = [...processedMessages]
        .reverse()
        .find(m => m.role === 'user')?.content || '';
      
      model = selectAppropriateModel(lastUserMsg);
    }

    const useCache = options.useCache !== false;
    
    // Check cache if enabled
    if (useCache) {
      const cacheKey = generateCacheKey(processedMessages, model, options.mode);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(cachedResponse);
      }
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: processedMessages,
      max_tokens: options.max_tokens || 1000,
      temperature: options.temperature || 0.7,
    });

    // Format response
    const responseData = {
      id: completion.id,
      content: completion.choices[0]?.message?.content || '',
      created: completion.created,
      model: completion.model,
    };

    // Cache the response if enabled
    if (useCache) {
      const cacheKey = generateCacheKey(processedMessages, model, options.mode);
      setCachedResponse(cacheKey, responseData);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    const formattedError = handleOpenAIError(error as { response?: { status: number; data?: { error?: { message?: string } } }; request?: XMLHttpRequest; cause?: { code?: string }; message?: string });
    return NextResponse.json(
      { error: formattedError.message },
      { status: formattedError.status }
    );
  }
}

// Get usage statistics for admin dashboard
export async function getUsageStats() {
  // This is a placeholder implementation
  // You would typically fetch this data from your database or another source
  
  return {
    totalRequests: 1250,
    uniqueUsers: 45,
    averageResponseTime: 850, // milliseconds
    errorRate: 0.02, // 2%
    mostPopularModels: [
      { name: 'gpt-3.5-turbo', usage: 850 },
      { name: 'gpt-4', usage: 400 }
    ],
    dailyUsage: [
      { date: '2025-03-17', requests: 150 },
      { date: '2025-03-18', requests: 175 },
      { date: '2025-03-19', requests: 125 },
      { date: '2025-03-20', requests: 200 },
      { date: '2025-03-21', requests: 190 },
      { date: '2025-03-22', requests: 210 },
      { date: '2025-03-23', requests: 200 }
    ]
  };
}