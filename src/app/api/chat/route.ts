import { NextResponse } from 'next/server';
import https from 'https';
import { OpenAIRequestBody, ChatMessage } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { ENV } from '@/types/envSchema';

// =====================
// Configuration
// =====================
const CONFIG = {
  keywordsApiKey: ENV.KEYWORDS_API_KEY || '',
  allowInsecureSSL: process.env.ALLOW_INSECURE_SSL === 'true',
  environment: process.env.NODE_ENV || 'development'
};

// Create a custom HTTPS agent (only on the server side)
const httpsAgent = new https.Agent({
  rejectUnauthorized: !CONFIG.allowInsecureSSL,
});

// =====================
// Logging Helpers
// =====================
interface LogTokens {
  prompt?: number;
  completion?: number;
  total?: number;
}

interface LogParams {
  model: string;
  promptMessages: ChatMessage[];
  completionMessage: unknown;
  generationTime: number;
  userId: string;
  tokens?: LogTokens;
}

async function logToKeywordsAI({
  model,
  promptMessages,
  completionMessage,
  generationTime,
  userId,
  tokens,
}: LogParams) {
  try {
    const res = await fetch('https://api.keywordsai.co/api/request-logs/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.keywordsApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt_messages: promptMessages,
        completion_message: completionMessage,
        generation_time: generationTime,
        user_id: userId,
        prompt_tokens: tokens?.prompt || 0,
        completion_tokens: tokens?.completion || 0,
        total_tokens: tokens?.total || 0,
        application: 'learnrithm-ai-teacher',
        environment: CONFIG.environment
      })
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error(`[Keywords AI] Logging error: ${res.status} - ${errorData}`);
    } else {
      console.log('[Keywords AI] Successfully logged');
    }
  } catch (error) {
    console.error('[Keywords AI] Logging exception:', error);
  }
}

async function logResponse(
  responseData: { model?: string; content?: string; usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } },
  mode: string,
  messages: ChatMessage[],
  userId: string,
  startTime: number
) {
  const generationTime = (Date.now() - startTime) / 1000;
  await logToKeywordsAI({
    model: responseData?.model || `${mode}-openai`,
    promptMessages: messages,
    completionMessage: { role: 'assistant', content: responseData?.content || '' },
    generationTime,
    userId,
    tokens: {
      prompt: responseData?.usage?.prompt_tokens || 0,
      completion: responseData?.usage?.completion_tokens || 0,
      total: responseData?.usage?.total_tokens || 0
    }
  });
}

// =====================
// Main API Handler
// =====================
export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = (await request.json()) as OpenAIRequestBody;

    // Extract user info from header or body
    const userId =
      request.headers.get('x-user-id') ||
      (body as { userId?: string }).userId ||
      'anonymous';

    // Validate request body
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }

    // Normalize mode to lowercase
    const mode = body.mode?.toLowerCase();
    let responseData: { model?: string; content?: string; usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } } | null = null;

    // Choose the appropriate mode handler
    switch (mode) {
      case 'reason':
      case 'quiz':
      case 'study':
      case 'homeworkhelper': {
        try {
          // Redirect to the specific mode endpoint with custom HTTPS agent
          const modeURL = new URL(`/api/chat/${mode}`, request.url);
          const res = await fetch(modeURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId,
            },
            body: JSON.stringify(body),
            // @ts-expect-error - Node.js specific option for server-side only
            agent: typeof window === 'undefined' ? httpsAgent : undefined,
          });
          responseData = await res.json();

          if (responseData) {
            await logResponse(responseData, mode, body.messages, userId, startTime);
          }
          return NextResponse.json(responseData);
        } catch (fetchError: unknown) {
          console.error(`Error calling ${mode} endpoint:`, fetchError);
          // Fall back to default processing for this mode
          console.log(`Falling back to default processing for ${mode} mode`);
          const fallbackMessages = addSystemPrompt(body.messages, mode);
          const fallbackStart = Date.now();
          const fallbackRes = await processChatRequest(fallbackMessages, {
            max_tokens: body.max_tokens || 1000,
            temperature: 0.7,
          });
          responseData = fallbackRes instanceof NextResponse ? await fallbackRes.json() : fallbackRes;

          if (responseData) {
            await logResponse(responseData, `${mode}-fallback`, fallbackMessages, userId, fallbackStart);
          }
          return NextResponse.json(responseData);
        }
      }
      default: {
        // Default chat behavior (no specific mode)
        const messages = addSystemPrompt(body.messages, 'default');
        const defaultStart = Date.now();
        const result = await processChatRequest(messages, {
          max_tokens: body.max_tokens || 1000,
          temperature: 0.7,
        });
        responseData = result instanceof NextResponse ? await result.json() : result;

        if (responseData) {
          await logResponse(responseData, 'default', messages, userId, defaultStart);
        }
        return NextResponse.json(responseData);
      }
    }
  } catch (error: unknown) {
    console.error('Error processing chat request:', error);
    const generationTime = (Date.now() - startTime) / 1000;
    try {
      const userId = request.headers.get('x-user-id') || 'anonymous';
      await logToKeywordsAI({
        model: 'error-openai',
        promptMessages: [],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : error}` },
        generationTime,
        userId,
      });
    } catch (logError) {
      console.error('Failed to log error to Keywords AI:', logError);
    }
    let errorMessage = 'An error occurred while processing your request';
    let statusCode = 500;

    // Handle specific SSL errors
    if (
      error instanceof Error &&
      error.cause &&
      typeof (error.cause as { code?: string }).code === 'string' &&
      (error.cause as { code: string }).code === 'ERR_SSL_PACKET_LENGTH_TOO_LONG'
    ) {
      errorMessage = 'SSL connection error. Please try again or contact support.';
      statusCode = 502;
    }
    return NextResponse.json(
      {
        error: errorMessage,
        details: CONFIG.environment === 'development' ? (error instanceof Error ? error.message : error) : undefined,
      },
      { status: statusCode }
    );
  }
}