import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory } from '@/lib/tokenManagement';

// Define the model to use
const MODEL = "gpt-4o-mini";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OpenAIRequestBody;
    
    // Validate the chat request
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }
    
    // Trim conversation history for better token management
    const trimmedMessages = trimConversationHistory(body.messages, 4000, 4);
    
    // Add a system prompt for homework helper mode
    const messages = addSystemPrompt(trimmedMessages, 'homeworkhelper');
    
    // Retrieve the last user message to decide on subject complexity
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
      
    // Always use the defined model regardless of topic complexity
    const model = MODEL;
    
    // Process the chat request with OpenAI
    return processChatRequest(messages, {
      max_tokens: body.max_tokens || 1000,
      temperature: 0.5, // Use a lower temperature for more precise educational content
      model: model,
      mode: 'homeworkhelper',
      useCache: false // Disable caching to ensure personalized homework help
    });
  } catch (error) {
    console.error('Error in homework helper mode:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}