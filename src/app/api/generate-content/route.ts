import { ENV } from '@/types/envSchema';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

// Define the model to use
const MODEL = "gpt-4o"; // Using more capable model for extended content

// =====================
// Configuration
// =====================
const CONFIG = {
  keywordsApiKey: ENV.KEYWORDS_API_KEY || '',
  allowInsecureSSL: process.env.ALLOW_INSECURE_SSL === 'true',
  environment: process.env.NODE_ENV || 'development',
  model: MODEL
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
  promptMessages: any[];
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
      }),
      // @ts-expect-error - Node.js specific option for server-side only
      agent: typeof window === 'undefined' ? httpsAgent : undefined,
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error(`[Keywords AI] Logging error: ${res.status} - ${errorData}`);
    } else {
      console.log('[Keywords AI] Successfully logged content generation');
    }
  } catch (error) {
    console.error('[Keywords AI] Logging exception:', error);
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // Parse request body
    const body = await req.json();
    const {
      mainTopic,
      subtopicTitle,
      contentType,
      educationLevel,
      language,
      selectedLevel,
    } = body;

    // Extract user info from header or body
    const userId =
      req.headers.get('x-user-id') ||
      (body as { userId?: string }).userId ||
      'anonymous';

    // Input validation
    if (!mainTopic || !subtopicTitle || !contentType) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build the appropriate prompt based on content type
    let content;
    try {
      if (contentType === "Video & Text Course") {
        content = await generateVideoTextContent(mainTopic, subtopicTitle, language, educationLevel, selectedLevel, userId, startTime);
      } else if (contentType === "PDF Course") {
        content = await generatePDFContent(mainTopic, subtopicTitle, language, educationLevel, selectedLevel, userId, startTime);
      } else {
        content = await generateTextContent(mainTopic, subtopicTitle, language, educationLevel, selectedLevel, userId, startTime);
      }

      return NextResponse.json({
        success: true,
        content
      });
    } catch (error) {
      console.error("Content generation error:", error);
      
      // Log the error to Keywords AI
      const generationTime = (Date.now() - startTime) / 1000;
      await logToKeywordsAI({
        model: `error-${CONFIG.model}`,
        promptMessages: [{ role: 'user', content: `Generate ${contentType} for ${mainTopic} - ${subtopicTitle}` }],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : String(error)}` },
        generationTime,
        userId,
      });
      
      return NextResponse.json(
        { success: false, message: "Error generating content", error: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    
    // Log the error to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    try {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      await logToKeywordsAI({
        model: `error-${CONFIG.model}`,
        promptMessages: [],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : String(error)}` },
        generationTime,
        userId,
      });
    } catch (logError) {
      console.error('Failed to log error to Keywords AI:', logError);
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to generate content", error: String(error) },
      { status: 500 }
    );
  }
}

async function generateVideoTextContent(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string,
  userId: string,
  startTime: number
) {
  try {
    // Generate theory content first
    const theoryPrompt = constructTheoryPrompt(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);
    const promptMessages = [
      {
        role: "system" as const,
        content: `You are an expert educational content creator specializing in ${mainTopic}, particularly on topics related to ${subtopicTitle}. 
        Create accurate, comprehensive, and pedagogically sound content that is directly relevant to the requested topic.
        Ensure your content is factually correct and appropriate for ${educationLevel} education at ${selectedLevel} difficulty level.
        Your response should be extensive, detailed, and thorough enough to fill approximately 2 pages of A4 paper when printed.`
      },
      {
        role: "user" as const,
        content: theoryPrompt
      }
    ];

    const theoryResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: promptMessages,
      temperature: 0.7,
      max_tokens: 4000 // Increased token limit for longer content
    });

    // Generate a YouTube search query
    const videoQueryPrompt = `Create a precise YouTube search query for a high-quality educational video about "${subtopicTitle}" 
    in the context of ${mainTopic} for ${educationLevel} level students (${selectedLevel} difficulty) in ${language}.
    Return ONLY the search query text without any formatting or extra text.`;

    const videoQueryMessages = [
      {
        role: "system" as const,
        content: "You create precise search queries for educational videos. Respond with only the search query, no other text."
      },
      {
        role: "user" as const,
        content: videoQueryPrompt
      }
    ];

    const videoQueryResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: videoQueryMessages,
      temperature: 0.5,
      max_tokens: 100
    });

    if (!theoryResponse.choices[0].message.content || !videoQueryResponse.choices[0].message.content) {
      throw new Error("Failed to generate content from OpenAI");
    }

    // Log to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    await logToKeywordsAI({
      model: `${MODEL}-video-theory`,
      promptMessages: promptMessages,
      completionMessage: { role: 'assistant', content: theoryResponse.choices[0].message.content },
      generationTime,
      userId,
      tokens: {
        prompt: theoryResponse.usage?.prompt_tokens,
        completion: theoryResponse.usage?.completion_tokens,
        total: theoryResponse.usage?.total_tokens
      }
    });

    // Log video query to Keywords AI
    await logToKeywordsAI({
      model: `${MODEL}-video-query`,
      promptMessages: videoQueryMessages,
      completionMessage: { role: 'assistant', content: videoQueryResponse.choices[0].message.content },
      generationTime: generationTime / 2, // Approximate time for this part
      userId,
      tokens: {
        prompt: videoQueryResponse.usage?.prompt_tokens,
        completion: videoQueryResponse.usage?.completion_tokens,
        total: videoQueryResponse.usage?.total_tokens
      }
    });

    return {
      theory: theoryResponse.choices[0].message.content,
      videoQuery: videoQueryResponse.choices[0].message.content.trim(),
      type: "video"
    };
  } catch (error) {
    console.error("Error in video content generation:", error);
    throw error;
  }
}

async function generatePDFContent(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string,
  userId: string,
  startTime: number
) {
  try {
    const theoryPrompt = constructPDFPrompt(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);
    const promptMessages = [
      {
        role: "system" as const,
        content: "You are an expert in creating educational content for PDFs. Your content should be well-structured, accurate, and optimized for PDF reading. Use markdown formatting. Create comprehensive content that would fill at least 2 pages of A4 paper when printed."
      },
      {
        role: "user" as const,
        content: theoryPrompt
      }
    ];

    const theoryResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: promptMessages,
      temperature: 0.7,
      max_tokens: 4500 // Increased token limit for longer content
    });

    if (!theoryResponse.choices[0].message.content) {
      throw new Error("Failed to generate PDF content from OpenAI");
    }

    // Log to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    await logToKeywordsAI({
      model: `${MODEL}-pdf`,
      promptMessages: promptMessages,
      completionMessage: { role: 'assistant', content: theoryResponse.choices[0].message.content },
      generationTime,
      userId,
      tokens: {
        prompt: theoryResponse.usage?.prompt_tokens,
        completion: theoryResponse.usage?.completion_tokens,
        total: theoryResponse.usage?.total_tokens
      }
    });

    return {
      theory: theoryResponse.choices[0].message.content,
      type: "pdf"
    };
  } catch (error) {
    console.error("Error in PDF content generation:", error);
    throw error;
  }
}

async function generateTextContent(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string,
  userId: string,
  startTime: number
) {
  try {
    // Generate theory content
    const theoryPrompt = constructTheoryPrompt(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);
    const theoryMessages = [
      {
        role: "system" as const,
        content: "You are an expert educator specializing in creating engaging, accurate educational content. Format your response using markdown for clarity. Your content should be extensive and thorough, approximately 2 pages of A4 paper when printed."
      },
      {
        role: "user" as const,
        content: theoryPrompt
      }
    ];

    const theoryResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: theoryMessages,
      temperature: 0.7,
      max_tokens: 4000 // Increased token limit for longer content
    });

    if (!theoryResponse.choices[0].message.content) {
      throw new Error("Failed to generate content from OpenAI");
    }

    // Log theory content to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    await logToKeywordsAI({
      model: `${MODEL}-text`,
      promptMessages: theoryMessages,
      completionMessage: { role: 'assistant', content: theoryResponse.choices[0].message.content },
      generationTime,
      userId,
      tokens: {
        prompt: theoryResponse.usage?.prompt_tokens,
        completion: theoryResponse.usage?.completion_tokens,
        total: theoryResponse.usage?.total_tokens
      }
    });

    return {
      theory: theoryResponse.choices[0].message.content,
      type: "text"
    };
  } catch (error) {
    console.error("Error in text content generation:", error);
    throw error;
  }
}

function constructTheoryPrompt(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string
): string {
  return `Create extensive, comprehensive educational content about the subtopic "${subtopicTitle}" 
  within the main topic "${mainTopic}" for ${educationLevel} level students (${selectedLevel} difficulty).
  
  Your content must be thorough enough to fill approximately 2 pages of A4 paper and include:
  1. A detailed introduction to the concept with historical context if relevant
  2. In-depth explanations with multiple examples and counter-examples
  3. Key principles, theories, or relationships with thorough analysis
  4. Multiple practical applications and real-world relevance
  5. Common misconceptions and how to address them
  6. Advanced concepts for students who want to go deeper
  7. A comprehensive summary of all key points
  
  Requirements:
  - Content must be in ${language}
  - Use appropriate complexity for ${educationLevel} level
  - Format using markdown with clear headings (##) and sections
  - Include code examples if relevant
  - Add bullet points or numbered lists for better readability
  - Include at least 5-7 practice questions or exercises with solutions
  - Use tables to organize information when appropriate
  - For mathematical expressions, use LaTeX syntax enclosed in dollar signs ($) for inline math and double dollar signs ($$) for display math
  - Include diagrams descriptions where visual elements would be helpful`;
}

function constructPDFPrompt(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string
): string {
  return `Create extensive, comprehensive educational content about the subtopic "${subtopicTitle}" 
  within the main topic "${mainTopic}" for ${educationLevel} level students (${selectedLevel} difficulty).
  
  Structure the content for PDF format with enough material to fill at least 2 full A4 pages:
  1. Title, Introduction, and Historical Context
  2. Detailed Learning Objectives
  3. Main Content (with multiple clear sections and subsections)
  4. Multiple Examples, Case Studies, and Illustrations
  5. Common Misconceptions and Clarifications
  6. At least 5-7 Practice Exercises with Detailed Solutions
  7. Comprehensive Summary
  8. Glossary of Key Terms
  9. Additional Resources and Further Reading
  
  Requirements:
  - Content must be in ${language}
  - Use appropriate complexity for ${educationLevel} level
  - Format using markdown with clear headings (##) and sections
  - Include tables for organizing information
  - Add diagrams descriptions where visual information would be helpful
  - Include key terms and detailed definitions
  - End with suggestions for further reading and exploration
  - For mathematical expressions, use LaTeX syntax enclosed in dollar signs ($) for inline math and double dollar signs ($$) for display math`;
}