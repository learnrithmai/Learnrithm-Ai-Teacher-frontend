import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory } from '@/lib/tokenManagement';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json() as OpenAIRequestBody;
    
    // Validate request
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }

    // Trim conversation history for token management
    const trimmedMessages = trimConversationHistory(body.messages, 4000, 4);
    
    // Add system message for study mode
    const messages = addSystemPrompt(trimmedMessages, 'study');
    
    // Get last user message to determine study subject complexity
    const lastUserMsg = [...messages]
      .reverse()
      .find(m => m.role === 'user')?.content || '';
      
    // Select model based on complexity and subject
    const model = /physics|quantum|advanced mathematics|biochemistry|theoretical|phd|thesis/i.test(lastUserMsg)
      ? "gpt-4o"
      : "gpt-3.5-turbo";

    // Process with OpenAI
    return processChatRequest(messages, {
      max_tokens: body.max_tokens || 1500, // Study explanations can be detailed
      temperature: 0.6, // More factual and structured for learning
      model: model,
      mode: 'study',
      useCache: true // Cache common study materials
    });
  } catch (error) {
    console.error('Error in study mode:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}