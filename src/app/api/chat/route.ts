import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import https from 'https';

// Create a custom HTTPS agent with relaxed SSL options for troubleshooting
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Only use during development/debugging
});

// Function to log to Keywords AI using their API - now with enhanced token data
async function logToKeywordsAI(
  model: string, 
  promptMessages: any[], 
  completionMessage: any, 
  generationTime: number, 
  userId?: string,
  tokenData?: {
    tokens?: {
      prompt?: number,
      completion?: number,
      total?: number
    }
  }
) {
  try {
    // Log to Keywords AI
    const response = await fetch('https://api.keywordsai.co/api/request-logs/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KEYWORDS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        prompt_messages: promptMessages,
        completion_message: completionMessage,
        generation_time: generationTime,
        user_id: userId || 'anonymous',
        // Add token usage data if available
        prompt_tokens: tokenData?.tokens?.prompt || 0,
        completion_tokens: tokenData?.tokens?.completion || 0,
        total_tokens: tokenData?.tokens?.total || 0,
        // Add any other metadata you want to track
        application: 'learnrithm-ai-teacher',
        environment: process.env.NODE_ENV || 'development'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Keywords AI logging error: ${response.status} - ${errorData}`);
    } else {
      console.log('Successfully logged to Keywords AI');
    }
  } catch (error) {
    // Don't fail the main request if logging fails
    console.error('Error logging to Keywords AI:', error);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    const body = await request.json() as OpenAIRequestBody;
    
    // Extract user info for logging
    const userId = request.headers.get('x-user-id') || (body as any).userId || 'anonymous';
    
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
    let responseData: any = null;

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
              'x-user-id': userId, // Pass user ID to mode endpoint
            },
            body: JSON.stringify(body),
            // @ts-ignore - Node.js specific option
            agent: typeof window === 'undefined' ? httpsAgent : undefined,
          });
          
          responseData = await response.json();
          
          // Log to Keywords AI after completion
          const endTime = Date.now();
          const generationTime = (endTime - startTime) / 1000; // Convert to seconds
          
          await logToKeywordsAI(
            responseData.model || `${mode}-openai`, // Get actual model if available
            body.messages,
            { role: 'assistant', content: responseData.content },
            generationTime,
            userId,
            {
              tokens: {
                prompt: responseData.usage?.prompt_tokens || 0,
                completion: responseData.usage?.completion_tokens || 0,
                total: responseData.usage?.total_tokens || 0
              }
            }
          );
          
          return NextResponse.json(responseData);
        } catch (fetchError: any) {
          console.error(`Error calling ${mode} endpoint:`, fetchError);
          
          // Fall back to default processing if mode-specific endpoint fails
          console.log(`Falling back to default processing for ${mode} mode`);
          const fallbackMessages = addSystemPrompt(body.messages, mode);
          
          const fallbackStartTime = Date.now();
          responseData = await processChatRequest(fallbackMessages, {
            max_tokens: body.max_tokens || 1000,
            temperature: 0.7,
          });
          
          // Log fallback to Keywords AI
          const fallbackEndTime = Date.now();
          const fallbackGenerationTime = (fallbackEndTime - fallbackStartTime) / 1000;
          
          await logToKeywordsAI(
            responseData.model || `${mode}-fallback-openai`,
            fallbackMessages,
            { role: 'assistant', content: responseData.content },
            fallbackGenerationTime,
            userId,
            {
              tokens: {
                prompt: responseData.usage?.prompt_tokens || 0,
                completion: responseData.usage?.completion_tokens || 0,
                total: responseData.usage?.total_tokens || 0
              }
            }
          );
          
          return responseData;
        }
        
      default:
        // Default chat behavior (no specific mode)
        // Add default system prompt
        const messages = addSystemPrompt(body.messages, 'default');
        
        const defaultStartTime = Date.now();
        responseData = await processChatRequest(messages, {
          max_tokens: body.max_tokens || 1000,
          temperature: 0.7,
        });
        
        // Log default processing to Keywords AI with token data
        const defaultEndTime = Date.now();
        const defaultGenerationTime = (defaultEndTime - defaultStartTime) / 1000;
        
        await logToKeywordsAI(
          responseData.model || 'default-openai',
          messages,
          { role: 'assistant', content: responseData.content },
          defaultGenerationTime,
          userId,
          {
            tokens: {
              prompt: responseData.usage?.prompt_tokens || 0,
              completion: responseData.usage?.completion_tokens || 0,
              total: responseData.usage?.total_tokens || 0
            }
          }
        );
        
        return NextResponse.json(responseData);
    }
  } catch (error: any) {
    console.error('Error processing chat request:', error);
    
    // Try to log the error to Keywords AI
    const endTime = Date.now();
    const generationTime = (endTime - startTime) / 1000;
    
    try {
      const userId = request.headers.get('x-user-id') || 'anonymous';
      await logToKeywordsAI(
        'error-openai',
        [], // We don't have messages in case of error
        { role: 'assistant', content: `Error: ${error.message}` },
        generationTime,
        userId
        // No token data for errors
      );
    } catch (logError) {
      console.error('Failed to log error to Keywords AI:', logError);
    }
    
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