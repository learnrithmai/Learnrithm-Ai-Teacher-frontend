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
      console.log('[Keywords AI] Successfully logged quiz generation');
    }
  } catch (error) {
    console.error('[Keywords AI] Logging exception:', error);
  }
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The correct answer string that matches one of the options
}

// Generate fallback questions when the API fails
function generateFallbackQuestions(topic: string, count: number = 3): QuizQuestion[] {
  const questions: QuizQuestion[] = [
    {
      question: `What is a key concept in ${topic}?`,
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctAnswer: "Option A"
    }
  ];
  
  // Add more generic questions if needed
  for (let i = 1; i < count; i++) {
    questions.push({
      question: `Question ${i + 1} about ${topic}?`,
      options: [
        "First choice",
        "Second choice",
        "Third choice",
        "Fourth choice"
      ],
      correctAnswer: "First choice"
    });
  }
  
  return questions;
}

// Function to sanitize LaTeX notation if needed
function sanitizeText(text: string): string {
  // If we want to keep LaTeX notation intact for rendering, return as is
  // If we want to strip LaTeX markers, uncomment the line below
  // return text.replace(/\$\$(.*?)\$\$|\$(.*?)\$/g, '$1$2');
  return text;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // Parse request body
    const body = await req.json();
    const {
      subject,
      topic,
      content,
      questionCount = 5,
      difficulty,
      educationLevel
    } = body;

    // Extract user info from header or body
    const userId =
      req.headers.get('x-user-id') ||
      (body as { userId?: string }).userId ||
      'anonymous';

    // Input validation
    if (!subject || !topic || !content) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the quiz generation prompt
    const prompt = `Generate ${questionCount} multiple-choice quiz questions about "${topic}" within the subject "${subject}" at ${difficulty} difficulty level for ${educationLevel} students.

Base the questions on this content:
${content}

REQUIREMENTS:
1. Each question must:
   - Be directly relevant to the content provided
   - Be at ${difficulty} difficulty level
   - Have exactly 4 options (A, B, C, D)
   - Have 1 clearly correct answer
   - Be appropriate for ${educationLevel} students

2. Questions should:
   - Test different cognitive levels (recall, application, analysis)
   - Cover different aspects of the topic
   - Be clear and unambiguous
   - Avoid trick questions
   - Use language appropriate for ${educationLevel} students
   - For mathematical notation, use plain text alternatives where possible (avoid LaTeX notation with $ symbols)

Format your response EXACTLY as valid JSON with this structure:
{
  "questions": [
    {
      "question": "Question text goes here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}

The "correctAnswer" field must be EXACTLY identical to one of the options.
DO NOT use LaTeX formatting with $ symbols in questions or options.`;

    // Define message structure
    const promptMessages = [
      {
        role: "system" as const,
        content: `You are an expert educational assessment designer specialized in creating high-quality multiple-choice questions. You create questions that are:

1. Clearly written and free of ambiguity
2. Precisely targeted to the specified educational level
3. Aligned with academic standards for the subject
4. Balanced across different cognitive domains (knowledge, comprehension, application, analysis)
5. Constructed with plausible distractors that reveal common misconceptions

For mathematical content, use plain text alternatives instead of LaTeX notation with $ symbols. For example, use "x^2" instead of "$x^2$".

You always format your output as valid JSON exactly as requested, with no additional text or commentary.`
      },
      {
        role: "user" as const,
        content: prompt
      }
    ];

    try {
      // Make API request
      console.log(`Generating ${questionCount} quiz questions for ${topic}...`);
      
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: promptMessages,
        temperature: 0.7,
        max_tokens: 2000
      });
      
      // Get content and calculate generation time
      const content = completion.choices[0].message.content;
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
        contentType: 'quiz-generation'
      });
      
      // Try to parse the response
      try {
        // Clean content and parse JSON
        const cleanContent = content.replace(/```json\s*|\s*```/g, '').trim();
        const result = JSON.parse(cleanContent);
        
        // Validate response structure
        if (!result.questions || !Array.isArray(result.questions) || result.questions.length === 0) {
          throw new Error("Invalid response structure");
        }
        
        // Sanitize text and validate that each correctAnswer exists in the options
        result.questions = result.questions.map((q: QuizQuestion) => {
          // Sanitize question and options
          const sanitizedQuestion = sanitizeText(q.question);
          const sanitizedOptions = q.options.map(opt => sanitizeText(opt));
          const sanitizedCorrectAnswer = sanitizeText(q.correctAnswer);
          
          // Make sure the correct answer is one of the options
          const correctOptionIndex = sanitizedOptions.findIndex(opt => 
            opt === sanitizedCorrectAnswer || 
            opt.replace(/\s+/g, '') === sanitizedCorrectAnswer.replace(/\s+/g, '')
          );
          
          if (correctOptionIndex === -1) {
            // If correct answer not found in options, use the first option as correct
            console.warn(`Correct answer "${sanitizedCorrectAnswer}" not found in options for question "${sanitizedQuestion}"`);
            return {
              question: sanitizedQuestion,
              options: sanitizedOptions,
              correctAnswer: sanitizedOptions[0]
            };
          }
          
          // Ensure the correctAnswer exactly matches an option (helps with string comparison)
          return {
            question: sanitizedQuestion,
            options: sanitizedOptions,
            correctAnswer: sanitizedOptions[correctOptionIndex]
          };
        });
        
        console.log(`Successfully generated ${result.questions.length} quiz questions for ${topic}`);
        
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
        
        // Return fallback questions if parsing fails
        console.log(`Parsing error: ${parseError instanceof Error ? parseError.message : String(parseError)}. Using fallback questions.`);
        
        return NextResponse.json({
          success: true,
          data: { questions: generateFallbackQuestions(topic, questionCount) },
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
        data: { questions: generateFallbackQuestions(topic, questionCount) },
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