import { NextResponse } from 'next/server';
import https from 'https';
import { OpenAIRequestBody, ChatMessage } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { ENV } from '@/types/envSchema';

// Define the model to use
const MODEL = "gpt-4o-mini";

// =====================
// Configuration
// =====================
const CONFIG = {
  keywordsApiKey: ENV.KEYWORDS_API_KEY || '',
  allowInsecureSSL: process.env.ALLOW_INSECURE_SSL === 'true',
  environment: process.env.NODE_ENV || 'development',
  model: MODEL // Add model to configuration
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
  contentType?: string; // Add contentType parameter like in generate-content
}

async function logToKeywordsAI({
  model,
  promptMessages,
  completionMessage,
  generationTime,
  userId,
  tokens,
  contentType,
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
        environment: CONFIG.environment,
        content_type: contentType || 'chat' // Default to 'chat' if not specified
      }),
      // @ts-expect-error - Node.js specific option for server-side only
      agent: typeof window === 'undefined' ? httpsAgent : undefined,
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
    model: responseData?.model || `${mode}-${CONFIG.model}`, // Use configured model
    promptMessages: messages,
    completionMessage: { role: 'assistant', content: responseData?.content || '' },
    generationTime,
    userId,
    tokens: {
      prompt: responseData?.usage?.prompt_tokens || 0,
      completion: responseData?.usage?.completion_tokens || 0,
      total: responseData?.usage?.total_tokens || 0
    },
    contentType: mode // Use mode as contentType
  });
}

// Add helper function to enhance system prompts with LaTeX support
function enhanceSystemPromptWithLatex(prompt: string): string {
  return `${prompt}

For mathematical content, use LaTeX notation within $ symbols (e.g., $x^2$ for x squared or $\\frac{1}{2}$ for fractions). Format complex mathematical expressions with double dollar signs for block mode: $$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$`;
}

// Override addSystemPrompt to add LaTeX support
export function addSystemPromptWithLatex(messages: ChatMessage[], mode: string): ChatMessage[] {
  // Deep copy the messages to avoid mutating the original
  const newMessages = JSON.parse(JSON.stringify(messages));
  
  // Find system message if it exists
  const systemMessageIndex = newMessages.findIndex(
    (message: ChatMessage) => message.role === 'system'
  );

  // Get appropriate system prompt based on mode
  let systemPrompt = getSystemPromptForMode(mode);
  
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

// Helper to get system prompt for each mode
function getSystemPromptForMode(mode: string): string {
  switch (mode.toLowerCase()) {
    case 'reason':
      return `You are a helpful teaching assistant that guides students through reasoning problems step-by-step. 
You help students think critically and understand concepts deeply without giving away answers.
Be encouraging, ask guiding questions, and help students discover solutions themselves.
Use the Socratic method to lead students to insights through questions.
For complex problems, break them down into manageable steps.
If a student seems confused, backtrack and try a different approach.
Always acknowledge students' efforts and progress.`;
    
    case 'quiz':
      return `You are a quiz assistant that helps students learn through testing their knowledge.
Create engaging, fair questions that assess understanding of the topic.
Provide immediate constructive feedback on answers.
Explain why answers are correct or incorrect.
Adjust difficulty based on student performance.
Focus on testing conceptual understanding rather than memorization.
Ask questions that build on previous knowledge.`;
    
    case 'study':
      return `You are a study guide creator that helps students prepare for exams and master subjects.
Summarize key concepts in clear, concise language.
Organize information in a logical, easy-to-follow structure.
Highlight important terms, formulas, and concepts.
Provide mnemonics, analogies, and visual descriptions to aid memory.
Include practice questions with solutions.
Suggest effective study strategies tailored to the subject.
Create connections between different parts of the material.`;
    
    case 'homeworkhelper':
      return `You are a homework helper that guides students through academic assignments without solving problems for them.
Ask questions to understand what the student already knows.
Provide hints and scaffolding rather than complete solutions.
Explain concepts relevant to the homework.
Use analogies and examples to clarify difficult ideas.
Break complex problems into manageable steps.
Encourage the student to articulate their thinking process.
Validate progress and suggest next steps when stuck.`;
    
    default:
      return `You are an AI teaching assistant specializing in education.
Your goal is to help students learn effectively by providing clear explanations, useful examples, and guidance appropriate to their educational level.
Respond in a friendly, encouraging tone that builds confidence.
When explaining concepts, use simple language first, then introduce technical terms.
Use analogies and real-world examples to illustrate abstract ideas.
Break down complex topics into manageable parts.
When answering questions, check for understanding and address misconceptions.
Adapt your responses to be age-appropriate and match the subject matter.
Encourage critical thinking by asking follow-up questions.
Be patient, supportive, and focus on building a positive learning experience.`;
  }
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
              'x-model': CONFIG.model, // Pass model in headers
            },
            body: JSON.stringify({
              ...body,
              model: CONFIG.model // Set model in request body
            }),
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
          // Use the enhanced system prompt with LaTeX support
          const fallbackMessages = addSystemPromptWithLatex(body.messages, mode);
          const fallbackStart = Date.now();
          const fallbackRes = await processChatRequest(fallbackMessages, {
            model: CONFIG.model, // Use the configured model
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
        // Use the enhanced system prompt with LaTeX support
        const messages = addSystemPromptWithLatex(body.messages, 'default');
        const defaultStart = Date.now();
        const result = await processChatRequest(messages, {
          model: CONFIG.model, // Use the configured model
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
        model: `error-${CONFIG.model}`, // Use configured model in error logs
        promptMessages: [],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : error}` },
        generationTime,
        userId,
        contentType: 'error' // Add content type for errors
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