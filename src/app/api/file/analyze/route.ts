import { NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/fileprocessing';
import openai from '@/lib/openai';
import { rateLimit } from '@/lib/rateLimit';
import { cache } from '@/lib/cache';

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimited = await rateLimit(ip, 'file-analysis', 5, 60); // 5 requests per minute
    
    if (rateLimited) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      }, { status: 429 });
    }
    
    // Parse request body
    const body = await request.json();
    const { fileId, question, mode } = body;
    
    if (!fileId) {
      return NextResponse.json({
        success: false,
        error: 'File ID is required'
      }, { status: 400 });
    }
    
    // Generate cache key
    const cacheKey = `file-analysis-${fileId}-${question || ''}-${mode || ''}`;
    
    // Check cache first
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        result: cachedResult
      });
    }
    
    // Extract text from the file
    const extractionResult = await extractTextFromFile(fileId);
    
    if (!extractionResult.success || !extractionResult.content) {
      return NextResponse.json({
        success: false,
        error: extractionResult.error || 'Failed to extract content from file'
      }, { status: 400 });
    }
    
    // Determine system prompt based on mode
    let systemPrompt = "You are a helpful assistant that analyzes documents.";
    
    if (mode === 'reason') {
      systemPrompt = "You are a reasoning assistant helping analyze documents. Break down the content logically and systematically, finding patterns, inconsistencies, and implications.";
    } else if (mode === 'quiz') {
      systemPrompt = "You are a quiz generator. Based on the document content, create 5 relevant quiz questions with multiple-choice answers and explanations.";
    } else if (mode === 'study') {
      systemPrompt = "You are a study assistant. Summarize the key concepts in the document, create bullet points of important information, and explain difficult concepts in simpler terms.";
    } else if (mode === 'homeworkhelper') {
      systemPrompt = "You are a homework assistant. Help understand the material in the document by explaining concepts step by step, but encourage learning rather than just providing answers.";
    }
    
    // Analyze the document content with OpenAI
    const completion = await openai.chat.completions.create({
      model: (mode === 'reason' || mode === 'homeworkhelper') ? "gpt-4o" : "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: question 
            ? `Document content: ${extractionResult.content}\n\nQuestion/Task: ${question}`
            : `Please analyze this document and provide insights:\n\n${extractionResult.content}`
        }
      ],
      max_tokens: 2000,
      temperature: mode === 'quiz' ? 0.8 : 0.5, // More creativity for quiz generation
    });
    
    const analysis = {
      fileId,
      fileName: extractionResult.fileName,
      summary: completion.choices[0].message.content || 'No analysis available',
      contentPreview: extractionResult.content.substring(0, 200) + '...',
      mode: mode || 'general',
      timestamp: new Date().toISOString()
    };
    
    // Cache the result for 1 hour
    await cache.set(cacheKey, analysis, 60 * 60);
    
    return NextResponse.json({
      success: true,
      result: analysis
    });
  } catch (error) {
    console.error('Error analyzing file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze file'
    }, { status: 500 });
  }
}