import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory } from '@/lib/tokenManagement';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OpenAIRequestBody;
    
    // Validate request
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400 }
      );
    }

    // Trim conversation history for token management (with a smaller buffer)
    const trimmedMessages = trimConversationHistory(body.messages, 4000, 2);
    
    // Add system prompt for quiz mode
    const messages = addSystemPrompt(trimmedMessages, 'quiz');
    
    // Get last user message to determine quiz subject complexity
    const lastUserMsg = [...messages]
      .reverse()
      .find(m => m.role === 'user')?.content || '';
      
    // Select model based on complexity keywords in the last user message
    const model = /advanced|complex|graduate|university level|difficult/i.test(lastUserMsg)
      ? "gpt-4o"
      : "gpt-3.5-turbo";

    // Process with OpenAI
    return processChatRequest(messages, {
      max_tokens: body.max_tokens || 1500, // Quizzes need space for both questions and answers
      temperature: 0.8, // Higher creativity for diverse quiz questions
      model: model,
      mode: 'quiz',
      useCache: true // Caching can be used for quizzes on the same topic
    });
  } catch (error) {
    console.error('Error in quiz mode:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
