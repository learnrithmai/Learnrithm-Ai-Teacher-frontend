import { NextResponse } from 'next/server';
import { ChatMessage, OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory } from '@/lib/tokenManagement';
import { ENV } from '@/types/envSchema';

// Define the model to use
const MODEL = "gpt-4o-mini";

// Add environment variable or config for Keywords AI API key
const KEYWORDS_AI_API_KEY = ENV.KEYWORDS_API_KEY || '';

// Improved TypeScript interface for log function
interface LogParams {
  model: string;
  promptMessages: ChatMessage[];
  completionMessage: unknown;
  customerParams?: {
    customer_identifier?: string;
    name?: string;
    email?: string;
  };
  cost?: number;
  generationTime?: number;
  ttft?: number;
}

// Helper function to log request/response to Keywords AI
async function logToKeywordsAI(params: LogParams) {
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
      console.warn('[Keywords AI] Failed to log:', await response.text());
    }
  } catch (error) {
    console.warn('[Keywords AI] Logging error:', error);
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
      
    // Always use the defined model regardless of complexity
    const model = MODEL;

    // Process with OpenAI
    const response = await processChatRequest(messages, {
      max_tokens: body.max_tokens || 1500,
      temperature: 0.6,
      model: model,
      mode: 'study',
      useCache: true
    });

    if (!response.ok) {
      console.error('[OpenAI] Error response:', await response.text());
      throw new Error('OpenAI response failed.');
    }

    const responseData = await response.json();

    // Get generation time
    const generationTime = (Date.now() - startTime) / 1000;

    // Log to Keywords AI (non-blocking)
    if (KEYWORDS_AI_API_KEY) {
      const completionMessage = {
        role: 'assistant',
        content: responseData.choices?.[0]?.message?.content || ''
      };
      
      const userInfo = (body as { user?: { id?: string; name?: string; email?: string } }).user || {};
      
      logToKeywordsAI({
        model,
        promptMessages: messages,
        completionMessage,
        customerParams: {
          customer_identifier: userInfo.id || 'anonymous',
          name: userInfo.name || '',
          email: userInfo.email || ''
        },
        cost: responseData.usage?.total_tokens || 0,
        generationTime
      });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[Study Mode] Error:', error);

    // Log error details to Keywords AI for tracking failures
    if (KEYWORDS_AI_API_KEY) {
      logToKeywordsAI({
        model: MODEL,
        promptMessages: [],
        completionMessage: { error: error instanceof Error ? error.message : 'Unknown error' },
        generationTime: (Date.now() - startTime) / 1000
      });
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}