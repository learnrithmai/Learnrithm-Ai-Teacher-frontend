import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';


export async function POST(request: Request) {
  try {
    const body = await request.json() as OpenAIRequestBody;
    
    // Validate request body
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }

    // Normalize mode to lowercase for consistency
    const mode = body.mode?.toLowerCase();

    // Choose the appropriate mode handler
    switch (mode) {
      case 'reason':
      case 'quiz':
      case 'study':
      case 'homeworkhelper':
        // Redirect to the specific mode endpoint
        const response = await fetch(new URL(`/api/chat/${mode}`, request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        
        const data = await response.json();
        return NextResponse.json(data);
        
      default:
        // Default chat behavior (no specific mode)
        // Add default system prompt
        const messages = addSystemPrompt(body.messages, 'default');
        
        return processChatRequest(messages, {
          max_tokens: body.max_tokens || 1000,
          temperature: 0.7,
        });
    }
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}