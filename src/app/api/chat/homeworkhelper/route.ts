export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { OpenAIRequestBody } from '@/types/openai';
import { validateChatRequest, addSystemPrompt, processChatRequest } from '@/lib/api';
import { trimConversationHistory } from '@/lib/tokenManagement';

export async function POST(request: Request) {
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
    
    // Add system message for homework helper mode
    const messages = addSystemPrompt(trimmedMessages, 'homeworkhelper');
    
    // Get last user message to determine homework subject and complexity
    const lastUserMsg = [...messages]
      .reverse()
      .find(m => m.role === 'user')?.content || '';
      
    // Select model based on subject area and complexity
    const isAdvancedMath = /calculus|differential equations|linear algebra|statistics|probability|vectors/i.test(lastUserMsg);
    const isAdvancedScience = /physics|chemistry|biochemistry|quantum|thermodynamics|organic chemistry/i.test(lastUserMsg);
    
    // Use more capable model for advanced STEM subjects
    const model = (isAdvancedMath || isAdvancedScience) ? "gpt-4o" : "gpt-3.5-turbo";

    // Process with OpenAI
    return processChatRequest(messages, {
      max_tokens: body.max_tokens || 1000,
      temperature: 0.5, // More precise for educational content
      model: model,
      mode: 'homeworkhelper',
      useCache: false // Don't cache homework help as it should be personalized
    });
  } catch (error) {
    console.error('Error in homework helper mode:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}