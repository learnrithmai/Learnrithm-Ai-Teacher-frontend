import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import https from 'https';

// Create a custom HTTPS agent with relaxed SSL options for troubleshooting
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Only use during development/debugging
});

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
        try {
          // Redirect to the specific mode endpoint with SSL error handling
          const response = await fetch(new URL(`/api/chat/${mode}`, request.url), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            // @ts-ignore - Node.js specific option
            agent: typeof window === 'undefined' ? httpsAgent : undefined,
          });
          
          const data = await response.json();
          return NextResponse.json(data);
        } catch (fetchError: any) {
          console.error(`Error calling ${mode} endpoint:`, fetchError);
          
          // Fall back to default processing if mode-specific endpoint fails
          console.log(`Falling back to default processing for ${mode} mode`);
          const fallbackMessages = addSystemPrompt(body.messages, mode);
          
          return processChatRequest(fallbackMessages, {
            max_tokens: body.max_tokens || 1000,
            temperature: 0.7,
          });
        }
        
      default:
        // Default chat behavior (no specific mode)
        // Add default system prompt
        const messages = addSystemPrompt(body.messages, 'default');
        
        return processChatRequest(messages, {
          max_tokens: body.max_tokens || 1000,
          temperature: 0.7,
        });
    }
  } catch (error: any) {
    console.error('Error processing chat request:', error);
    
    // Improved error handling with more details
    let errorMessage = 'An error occurred while processing your request';
    let statusCode = 500;
    
    // Handle specific SSL errors
    if (error.cause && error.cause.code === 'ERR_SSL_PACKET_LENGTH_TOO_LONG') {
      errorMessage = 'SSL connection error. Please try again or contact support.';
      statusCode = 502; // Bad Gateway
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}