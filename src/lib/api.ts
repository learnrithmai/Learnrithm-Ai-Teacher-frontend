import { NextResponse } from 'next/server';
import { ChatMessage, OpenAIRequestBody } from '@/types/openai';
import openai, { handleOpenAIError } from '@/lib/openai';
import { trimConversationHistory } from '@/lib/tokenManagement';
import { getCachedResponse, setCachedResponse, generateCacheKey } from '@/lib/cache';

// Validate chat request
export function validateChatRequest(body: any): { isValid: boolean; errorMessage?: string } {
  if (!body) {
    return { isValid: false, errorMessage: 'Request body is required' };
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return { isValid: false, errorMessage: 'Messages array is required and cannot be empty' };
  }

  return { isValid: true };
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
  }
) {
  try {
    const model = options.model || 'gpt-3.5-turbo';
    const useCache = options.useCache !== false;
    
    // Check cache if enabled
    if (useCache) {
      const cacheKey = generateCacheKey(messages, model, options.mode);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(cachedResponse);
      }
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
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
      const cacheKey = generateCacheKey(messages, model, options.mode);
      setCachedResponse(cacheKey, responseData);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    const formattedError = handleOpenAIError(error);
    return NextResponse.json(
      { error: formattedError.message },
      { status: formattedError.status }
    );
  }
}