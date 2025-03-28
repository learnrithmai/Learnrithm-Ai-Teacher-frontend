import { NextResponse } from 'next/server';
import { ChatMessage, OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, processChatRequest } from '@/lib/api';
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
  contentType?: string; // Add content type for better tracking
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
        application: 'learnrithm-ai-teacher',
        environment: process.env.NODE_ENV || 'development',
        content_type: params.contentType || 'reason', // Default to 'reason' if not specified
      })
    });
    
    if (!response.ok) {
      console.warn('[Keywords AI] Failed to log:', await response.text());
    }
  } catch (error) {
    console.warn('[Keywords AI] Logging error:', error);
  }
}

// Add helper function to enhance system prompts with LaTeX support
function enhanceSystemPromptWithLatex(prompt: string): string {
  return `${prompt}

For mathematical content, use LaTeX notation within $ symbols (e.g., $x^2$ for x squared or $\\frac{1}{2}$ for fractions). Format complex mathematical expressions with double dollar signs for block mode: $$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$`;
}

// Override addSystemPrompt to add LaTeX support
function addSystemPromptWithLatex(messages: ChatMessage[], mode: string): ChatMessage[] {
  // Deep copy the messages to avoid mutating the original
  const newMessages = JSON.parse(JSON.stringify(messages));
  
  // Find system message if it exists
  const systemMessageIndex = newMessages.findIndex(
    (message: ChatMessage) => message.role === 'system'
  );

  // Get reasoning mode system prompt
  let systemPrompt = `You are a helpful teaching assistant that guides students through reasoning problems step-by-step. 
You help students think critically and understand concepts deeply without giving away answers.
Be encouraging, ask guiding questions, and help students discover solutions themselves.
Use the Socratic method to lead students to insights through questions.
For complex problems, break them down into manageable steps.
If a student seems confused, backtrack and try a different approach.
Always acknowledge students' efforts and progress.`;
  
  // Enhance with LaTeX instructions
  systemPrompt = enhanceSystemPromptWithLatex(systemPrompt);

  if (systemMessageIndex >= 0) {
    // Update existing system message
    newMessages[systemMessageIndex].content = systemPrompt;
  } else {
    // Add system message at the beginning
    newMessages.unshift({
      role: 'system',
      content: systemPrompt,
    });
  }

  return newMessages;
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

    // Trim conversation history for token management (keeping more context for reasoning)
    const trimmedMessages = trimConversationHistory(body.messages, 6000, 6);
    
    // Add system message for reasoning mode with LaTeX support
    const messages = addSystemPromptWithLatex(trimmedMessages, 'reason');
    
    // Use the defined model constant
    const model = MODEL;

    // Process the request with OpenAI
    const response = await processChatRequest(messages, {
      max_tokens: body.max_tokens || 1200, // Longer responses for reasoning tasks
      temperature: 0.7, // Balanced temperature for reasoning
      model: model,
      mode: 'reason',
      useCache: false // Reasoning should be processed fresh each time
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
        generationTime,
        contentType: 'reason' // Specify content type as 'reason'
      });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in reasoning mode:', error);
    
    // Log error details to Keywords AI for tracking failures
    if (KEYWORDS_AI_API_KEY) {
      logToKeywordsAI({
        model: MODEL,
        promptMessages: [],
        completionMessage: { error: error instanceof Error ? error.message : 'Unknown error' },
        generationTime: (Date.now() - startTime) / 1000,
        contentType: 'reason-error' // Use specific content type for errors
      });
    }
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}