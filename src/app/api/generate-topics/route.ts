import { ENV } from '@/types/envSchema';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

// Define the model to use
const MODEL = "gpt-4o-mini";

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
  contentType?: string;
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
        content_type: contentType
      }),
      // @ts-expect-error - Node.js specific option for server-side only
      agent: typeof window === 'undefined' ? httpsAgent : undefined,
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error(`[Keywords AI] Logging error: ${res.status} - ${errorData}`);
    } else {
      console.log('[Keywords AI] Successfully logged topics generation');
    }
  } catch (error) {
    console.error('[Keywords AI] Logging exception:', error);
  }
}

// Define the Topic interface
interface Topic {
  name: string;
  description: string;
  subtopics: string[];
}

/**
 * Create fallback topics when API or parsing fails
 */
function getFallbackTopics(subject: string, difficulty: string, educationLevel: string, subtopics: string[] = []): Topic[] {
  // Base fallback topics
  const topics: Topic[] = [
    {
      name: `Introduction to ${subject}`,
      description: `A comprehensive overview of key concepts and principles in ${subject}, designed for ${educationLevel} students at a ${difficulty} level. This foundational topic provides essential knowledge for further study.`,
      subtopics: ["Basic Principles", "Key Terminology", "Historical Development", "Practical Applications"]
    },
    {
      name: `Fundamental ${subject} Concepts`,
      description: `An exploration of the core concepts that form the foundation of ${subject}. Students will gain a solid understanding of essential theories and frameworks at a ${difficulty} level.`,
      subtopics: ["Theoretical Frameworks", "Core Methodologies", "Problem-Solving Approaches", "Critical Analysis"]
    },
    {
      name: `${subject} in Practice`,
      description: `Application of ${subject} knowledge to real-world scenarios and problems. This practical topic bridges theory and implementation, suitable for ${educationLevel} education.`,
      subtopics: ["Case Studies", "Implementation Strategies", "Practical Exercises", "Real-World Examples"]
    }
  ];
  
  // Add topics related to specific subtopics if provided
  if (subtopics && subtopics.length > 0) {
    for (let i = 0; i < Math.min(2, subtopics.length); i++) {
      topics.push({
        name: `${subtopics[i]} in ${subject}`,
        description: `A focused study of ${subtopics[i]} within the context of ${subject}. This topic explores key aspects and applications specifically relevant to ${educationLevel} students.`,
        subtopics: ["Core Concepts", "Practical Applications", "Analysis Methods", "Advanced Techniques"]
      });
    }
  }
  
  return topics;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // Parse the request body
    const body = await req.json();
    
    // Extract parameters with defaults
    const subject = body.subject;
    const difficulty = body.difficulty;
    const educationLevel = body.educationLevel;
    const count = body.count || 5;
    const subtopics = Array.isArray(body.subtopics) ? body.subtopics : [];
    const curriculum = body.curriculum || '';
    const school = body.school || '';
    const country = body.country || '';
    
    // Extract user ID from request
    const userId = req.headers.get('x-user-id') || 
      (body as { userId?: string }).userId || 
      'anonymous';
    
    // Validate required fields
    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject is required" },
        { status: 400 }
      );
    }
    
    // Create the prompt
    const subtopicText = subtopics.length > 0 
      ? `Each topic MUST relate directly to one or more of these subtopics: ${subtopics.join(', ')}.` 
      : '';
    
    const curriculumText = curriculum
      ? `Follow the specific requirements and structure of the ${curriculum} curriculum.`
      : '';
    
    const prompt = `Generate ${count} educational topics for teaching "${subject}" with STRICT ADHERENCE to the following requirements:

CRITICAL REQUIREMENTS:
1. SUBJECT AREA (${subject}):
   - ALL topics MUST be 100% focused on "${subject}" with no deviation
   - Topics should cover critical aspects of ${subject} that are essential for ${school} students${country ? ` in ${country}` : ''}
   - DO NOT include any unrelated subjects or topics
   
2. DIFFICULTY LEVEL (${difficulty}): 
   - For "easy": Topics MUST be foundational, use simple language, cover basic concepts only, and be highly accessible.
   - For "medium": Topics MUST build on fundamentals, introduce moderate complexity, and require some prior knowledge.
   - For "hard": Topics MUST be advanced, cover complex theories/applications, and challenge students with sophisticated concepts.

3. EDUCATION LEVEL (${educationLevel}):
   - Content MUST be precisely calibrated for ${educationLevel} level students ${school ? ` at ${school}` : ''}${country ? ` in ${country}` : ''}
   - Use appropriate terminology, examples, and depth for this specific education level

${curriculumText ? `4. CURRICULUM (${curriculum}):
   - ${curriculumText}
   - Structure topics to align with standard ${curriculum} for ${school} requirements and frameworks` : ''}

${subtopicText ? `${curriculumText ? '5' : '4'}. SUBTOPIC ALIGNMENT:
   - ${subtopicText}
   - DO NOT introduce topics outside of these specified subtopics.` : ''}

Each topic MUST include:
1. A clear, descriptive name that reflects both the subject (${subject}), ${difficulty}  level, and appropriateness for ${educationLevel} education
2. A detailed description (50-100 words) explicitly mentioning how it relates to ${subject} at ${school} and ${difficulty} level at ${educationLevel} education 
3. 3-5 relevant subtopics that maintain consistent ${difficulty} and ${subject} focus at ${educationLevel} level for a cohesive learning experience at ${school} .

Format your response EXACTLY as this JSON structure with no additional text:
{
  "topics": [
    {
      "name": "Topic Name Example (relating to ${subject} at ${difficulty} level and ${educationLevel} at ${school})",
      "description": "Description example that clearly demonstrates how this topic covers ${subject} at ${difficulty} level complexity for ${educationLevel} students at ${school}",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
    }
  ]
}`;

    // Define interfaces for message roles and structures
    interface SystemMessage {
      role: "system";
      content: string;
    }
    
    interface UserMessage {
      role: "user";
      content: string;
    }
    
    type ChatMessage = SystemMessage | UserMessage;
    
    const promptMessages: ChatMessage[] = [
      {
      role: "system",
      content: "You are an expert educational content creator specialized in curriculum development for students at all levels. Your primary responsibility is to create highly tailored educational content that perfectly balances SUBJECT MATTER, DIFFICULTY LEVEL, and EDUCATION LEVEL. Every topic you generate must:\n\n        1. Be 100% focused on the requested subject with no deviation or tangential content\n        2. Precisely match the specified difficulty level (easy/medium/hard) in both language and concept complexity\n        3. Be perfectly calibrated for the student's education level, using appropriate terminology and examples\n        4. Incorporate curriculum requirements when specified\n        5. Align with cultural and regional educational contexts when country information is provided\n        6. Integrate with institutional teaching approaches when school information is provided\n        7. Include only subtopics that directly support learning the main subject\n        \n        You must strictly follow all instructions and return only valid JSON with no additional text or comments. The generated content should be immediately useful for teachers and optimally formatted for student learning."
      },
      {
      role: "user",
      content: prompt
      }
    ];

    try {
      // Make OpenAI API request
      console.log(`Requesting topics for ${subject} (${difficulty} level)...`);
      
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: promptMessages,
        temperature: 0.5,
      });
      
      // Get response content
      const content = completion.choices[0].message.content;
      
      // Calculate generation time
      const generationTime = (Date.now() - startTime) / 1000;
      
      if (!content) {
        throw new Error("No content generated");
      }
      
      // Log to Keywords AI
      await logToKeywordsAI({
        model: MODEL,
        promptMessages: promptMessages,
        completionMessage: { role: 'assistant', content: content },
        generationTime,
        userId,
        tokens: {
          prompt: completion.usage?.prompt_tokens,
          completion: completion.usage?.completion_tokens,
          total: completion.usage?.total_tokens
        },
        contentType: 'topics-generation'
      });
      
      // Try to parse the response
      try {
        // Clean content and parse JSON
        const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
        const result = JSON.parse(cleanContent);
        
        // Validate response structure
        if (!result.topics || !Array.isArray(result.topics) || result.topics.length === 0) {
          throw new Error("Invalid response structure");
        }
        
        console.log(`Successfully generated ${result.topics.length} topics for ${subject}`);
        
        // Return successful response
        return NextResponse.json({
          success: true,
          data: result
        });
      } catch (parseError) {
        // Log parsing error to Keywords AI
        await logToKeywordsAI({
          model: MODEL,
          promptMessages: promptMessages,
          completionMessage: { 
            role: 'assistant', 
            content: `Error parsing JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw content: ${content}` 
          },
          generationTime,
          userId,
          tokens: {
            prompt: completion.usage?.prompt_tokens,
            completion: completion.usage?.completion_tokens,
            total: completion.usage?.total_tokens
          },
          contentType: 'parse-error'
        });
        
        // Return fallback topics if parsing fails
        console.log(`Parsing error: ${parseError instanceof Error ? parseError.message : String(parseError)}. Using fallback topics.`);
        
        return NextResponse.json({
          success: true,
          data: { topics: getFallbackTopics(subject, difficulty, educationLevel, subtopics) },
          fallback: true
        });
      }
    } catch (apiError) {
      // Log API error to Keywords AI
      const generationTime = (Date.now() - startTime) / 1000;
      await logToKeywordsAI({
        model: MODEL,
        promptMessages: promptMessages,
        completionMessage: { 
          role: 'assistant', 
          content: `OpenAI API error: ${apiError instanceof Error ? apiError.message : String(apiError)}` 
        },
        generationTime,
        userId,
        contentType: 'api-error'
      });
      
      // Handle OpenAI API errors
      console.error("OpenAI API error:", apiError);
      
      return NextResponse.json({
        success: true, // Return success to prevent client errors
        data: { topics: getFallbackTopics(subject, difficulty, educationLevel, subtopics) },
        fallback: true,
        error: apiError instanceof Error ? apiError.message : String(apiError)
      });
    }
  } catch (error) {
    // Log general error to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    try {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      await logToKeywordsAI({
        model: MODEL,
        promptMessages: [],
        completionMessage: { 
          role: 'assistant', 
          content: `General error: ${error instanceof Error ? error.message : String(error)}` 
        },
        generationTime,
        userId,
        contentType: 'general-error'
      });
    } catch (logError) {
      console.error('Failed to log error to Keywords AI:', logError);
    }
    
    // Handle general errors
    console.error("General error:", error);
    
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}