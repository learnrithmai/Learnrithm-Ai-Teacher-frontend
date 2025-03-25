import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory } from '@/lib/tokenManagement';

// Add environment variable or config for Keywords AI API key
const KEYWORDS_AI_API_KEY = process.env.KEYWORDS_AI_API_KEY || '';

// Helper function to log request/response to Keywords AI
async function logToKeywordsAI(params: {
  model: string;
  promptMessages: any[];
  completionMessage: any;
  customerParams?: {
    customer_identifier?: string;
    name?: string;
    email?: string;
  };
  cost?: number;
  generationTime?: number;
  ttft?: number;
}) {
  try {
    const url = 'https://api.keywordsai.co/api/request-logs/create/';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEYWORDS_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: params.model,
        prompt_messages: params.promptMessages,
        completion_message: params.completionMessage,
        customer_params: params.customerParams || {},
        cost: params.cost || 0,
        generation_time: params.generationTime || 0,
        ttft: params.ttft || 0,
      })
    });
    
    if (!response.ok) {
      console.warn('Failed to log to Keywords AI:', await response.text());
    }
  } catch (error) {
    // Non-blocking - just log the error without affecting the main flow
    console.warn('Error logging to Keywords AI:', error);
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
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
    const response = await processChatRequest(messages, {
      max_tokens: body.max_tokens || 1500, // Study explanations can be detailed
      temperature: 0.6, // More factual and structured for learning
      model: model,
      mode: 'study',
      useCache: true // Cache common study materials
    });
    
    // Get generation time
    const generationTime = (Date.now() - startTime) / 1000;
    
    // Extract completion message from response
    const responseData = await response.json();
    
    // Log to Keywords AI (non-blocking)
    if (KEYWORDS_AI_API_KEY) {
      const completionMessage = {
        role: 'assistant',
        content: responseData.choices?.[0]?.message?.content || ''
      };
      
      // Get user ID or other customer info from your auth system if available
      const userInfo = (body as any).user || {};
      
      logToKeywordsAI({
        model: model,
        promptMessages: messages,
        completionMessage: completionMessage,
        customerParams: {
          customer_identifier: userInfo.id || 'anonymous',
          name: userInfo.name || '',
          email: userInfo.email || ''
        },
        generationTime: generationTime,
        // Cost and TTFT would need to be extracted from actual API response if available
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error in study mode:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}