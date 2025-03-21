import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory, selectAppropriateModel } from '@/lib/tokenManagement';

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
    const trimmedMessages = trimConversationHistory(body.messages, 6000, 6); // Keep more context for reasoning
    
    // Add system message for reasoning mode
    const messages = addSystemPrompt(trimmedMessages, 'reason');
    
    // Always use GPT-4o for reasoning tasks which require more advanced capabilities
    const model = "gpt-4o";

    // Process with OpenAI
    return processChatRequest(messages, {
      max_tokens: body.max_tokens || 1200, // Allow longer responses for reasoning
      temperature: 0.7, // Balanced for reasoning
      model: model,
      mode: 'reason',
      useCache: false // Reasoning should be fresh each time
    });
  } catch (error) {
    console.error('Error in reasoning mode:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}