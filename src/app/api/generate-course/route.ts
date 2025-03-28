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
      console.log('[Keywords AI] Successfully logged course generation');
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
      course,
      subtopic,
      educationLevel,
      country,
      school,
      curriculum,
      learningMaterials,
      language = "English",
      selectedLevel = "medium",
      paidMember = true
    } = body;

    // Extract user ID from request
    const userId = req.headers.get('x-user-id') || 
      (body as { userId?: string }).userId || 
      'anonymous';

    // Input validation
    if (!course || !subtopic || !educationLevel) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine topic count based on membership
    const topicCount = paidMember ? "7" : "4";

    // Build a prompt based on user selections
    const prompt = constructPrompt({
      course,
      subtopic,
      educationLevel,
      country,
      school,
      curriculum,
      learningMaterials,
      language,
      selectedLevel,
      topicCount
    });

    const promptMessages = [
      {
        role: "system" as const,
        content: "You are an expert educational content creator specialized in curriculum development for students at all levels. Your primary responsibility is to create highly tailored educational content that perfectly balances SUBJECT MATTER, DIFFICULTY LEVEL, and EDUCATION LEVEL. Every topic you generate must:\n\n1. Be 100% focused on the requested subject with no deviation or tangential content\n2. Precisely match the specified difficulty level (easy/medium/hard) in both language and concept complexity\n3. Be perfectly calibrated for the student's education level, using appropriate terminology and examples\n4. Incorporate curriculum requirements when specified\n5. Align with cultural and regional educational contexts when country information is provided\n6. Integrate with institutional teaching approaches when school information is provided\n7. Include only subtopics that directly support learning the main subject\n\nYou must strictly follow all instructions and return only valid JSON with no additional text or comments. The generated content should be immediately useful for teachers and optimally formatted for student learning."
      },
      {
        role: "user" as const,
        content: prompt
      }
    ];

    // Generate content using OpenAI - UPDATED to use gpt-4o-mini
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: promptMessages,
      temperature: 0.7,
      max_tokens: 3500,
      // Removed the response_format parameter as it may not be supported by your model
    });

    // Extract the generated content
    const generatedContent = completion.choices[0].message.content;

    // Calculate generation time
    const generationTime = (Date.now() - startTime) / 1000;

    // Log to Keywords AI
    await logToKeywordsAI({
      model: `${MODEL}-course-generation`,
      promptMessages: promptMessages,
      completionMessage: { role: 'assistant', content: generatedContent || '' },
      generationTime,
      userId,
      tokens: {
        prompt: completion.usage?.prompt_tokens,
        completion: completion.usage?.completion_tokens,
        total: completion.usage?.total_tokens
      }
    });

    // Parse the JSON from the response
    try {
      // Clean the response if it contains markdown formatting
      const cleanedContent = generatedContent?.replace(/```json\s+|\s+```|```/g, '').trim() || "{}";
      
      // Parse the JSON response
      const parsedJson = JSON.parse(cleanedContent);
      
      return NextResponse.json({
        success: true,
        data: parsedJson,
        mainTopic: course.toLowerCase(),
        type: determineContentType(learningMaterials),
        language: language,
        educationLevel: educationLevel,
        selectedLevel: selectedLevel
      });
      
    } catch (error) {
      console.error("Error parsing JSON from OpenAI response:", error);
      console.log("Raw response:", generatedContent);
      
      // Log parsing error to Keywords AI
      await logToKeywordsAI({
        model: `error-${MODEL}-parse`,
        promptMessages: promptMessages,
        completionMessage: { 
          role: 'assistant', 
          content: `Error parsing JSON: ${error instanceof Error ? error.message : String(error)}. Raw content: ${generatedContent}` 
        },
        generationTime,
        userId,
        tokens: {
          prompt: completion.usage?.prompt_tokens,
          completion: completion.usage?.completion_tokens,
          total: completion.usage?.total_tokens
        }
      });
      
      return NextResponse.json(
        { success: false, message: "Failed to parse generated content", error: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    
    // Log general error to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    try {
      const userId = req.headers.get('x-user-id') || 'anonymous';
      await logToKeywordsAI({
        model: `error-${MODEL}-general`,
        promptMessages: [],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : String(error)}` },
        generationTime,
        userId,
      });
    } catch (logError) {
      console.error('Failed to log error to Keywords AI:', logError);
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to generate course content", error: String(error) },
      { status: 500 }
    );
  }
}

function constructPrompt({
  course,
  subtopic,
  educationLevel,
  country,
  school,
  curriculum,
  language,
  selectedLevel,
  topicCount,
  learningMaterials
}: {
  course: string;
  subtopic: string;
  educationLevel: string;
  country: string;
  school: string;
  curriculum: string;
  learningMaterials: { pdf: boolean; video: boolean; text: boolean };
  language: string;
  selectedLevel: string;
  topicCount: string;
}) {
  // Start with the course subject and difficulty level
  let prompt = `Generate a comprehensive and educational list of exactly ${topicCount} distinct topics for a course on "${course}" with STRICT ADHERENCE to the following requirements:

CRITICAL REQUIREMENTS:
1. SUBJECT AREA (${course}):
   - ALL topics MUST be 100% focused on "${course}" with no deviation
   - Topics should cover critical aspects of ${course} that are essential for mastery
   
2. DIFFICULTY LEVEL (${selectedLevel}): 
   - For "easy": Topics MUST be foundational, use simple language, cover basic concepts only, and be highly accessible.
   - For "medium": Topics MUST build on fundamentals, introduce moderate complexity, and require some prior knowledge.
   - For "hard": Topics MUST be advanced, cover complex theories/applications, and challenge students with sophisticated concepts.
   
3. EDUCATION LEVEL (${educationLevel}):`;
  
  // Add detailed education level context
  if (educationLevel === "highSchool") {
    prompt += `
   - Content MUST be precisely calibrated for high school students
   - Use appropriate terminology, examples, and depth that high school students can understand
   - Focus on core concepts and applications with practical examples`;
  } else if (educationLevel === "kg12") {
    prompt += `
   - Content MUST be simplified and accessible for K-12 students
   - Use clear, straightforward language appropriate for younger learners
   - Emphasize fundamental concepts with engaging, relatable examples`;
  } else if (educationLevel === "university") {
    prompt += `
   - Content MUST be at university level academic standard
   - Include advanced concepts, critical analysis, and deeper theoretical foundations
   - Encourage analytical thinking and scholarly investigation`;
  } else if (educationLevel === "skill") {
    prompt += `
   - Content MUST focus on practical skill development
   - Include clear steps, techniques, and real-world applications
   - Emphasize hands-on learning and measurable competency development`;
  }

  // Add school and country specific context
  if (school && country && educationLevel !== "skill") {
    prompt += `

4. INSTITUTIONAL CONTEXT:
   - Content MUST be aligned with the educational approach of ${school} in ${country}
   - Consider cultural and regional educational standards and expectations
   - Ensure topics reflect the teaching methodologies common in this institutional context`;
  }

  // Add curriculum alignment
  if (curriculum) {
    prompt += `

${school && country ? '5' : '4'}. CURRICULUM ALIGNMENT:
   - ALL content MUST align with ${curriculum} curriculum standards
   - Follow the specific structure, sequence, and learning objectives of this curriculum
   - Ensure coverage of required curriculum components and assessment criteria`;
  }

  // Add subtopics requirement with strong emphasis
  prompt += `

${(curriculum ? (school && country ? '6' : '5') : (school && country ? '5' : '4'))}. SUBTOPIC INTEGRATION:
   - Each generated topic MUST incorporate and explicitly address these subtopics: ${subtopic}
   - DO NOT introduce topics that fail to connect with these specified subtopics
   - Ensure subtopics are meaningfully integrated, not superficially mentioned`;
  
  // Add language requirement
  prompt += `

${(curriculum ? (school && country ? '7' : '6') : (school && country ? '6' : '5'))}. LANGUAGE:
   - ALL content MUST be presented in ${language}
   - Use appropriate terminology, phrasing, and examples for ${language} speakers
   - Ensure linguistic and cultural appropriateness`;
  
  // Specify the format for subtopics
  prompt += `

For each main topic, generate 2-4 highly relevant subtopics that:
1. Break down the main concept into clearly teachable components
2. Maintain consistent ${selectedLevel} difficulty level
3. Follow a logical learning progression
4. Directly support mastery of the main topic
5. Are appropriate for ${educationLevel} education`;
  
  // Specify output format with explicit JSON structure
  prompt += `

You must respond ONLY with a valid JSON object in exactly the following structure without any additional text, explanations or markdown formatting:

{
  "${course.toLowerCase()}": [
    {
      "title": "Main Topic Title",
      "subtopics": [
        {
          "title": "Subtopic Title",
          "theory": "",
          "youtube": "",
          "image": "",
          "done": false
        }
      ]
    }
  ]
}

The JSON MUST have exactly ${topicCount} main topics. Leave "theory", "youtube", and "image" fields empty as these will be filled later.`;
  
  return prompt;
}

function determineContentType(learningMaterials: { pdf: boolean; video: boolean; text: boolean }) {
  if (learningMaterials.video) {
    return "Video & Text Course";
  } else if (learningMaterials.pdf) {
    return "PDF Course";
  } else {
    return "Text & Image Course";
  }
}