import { ENV } from '@/types/envSchema';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import https from 'https';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

// Define the model to use
const MODEL = "gpt-4o-mini"; // Using GPT-4o mini model

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
        model: MODEL,
        promptMessages: [{ role: 'user', content: `Generate ${contentType} for ${mainTopic} - ${subtopicTitle}` }],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : String(error)}` },
        generationTime,
        userId,
        contentType: 'error'
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
        model: MODEL,
        promptMessages: [],
        completionMessage: { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : String(error)}` },
        generationTime,
        userId,
        contentType: 'api-error'
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
        content: `You are an exceptional ${educationLevel} teacher creating student materials for ${mainTopic}. 

Write exactly as if speaking directly to your students in a real classroom setting. Your content should feel like actual student notes or textbook material, not like a lesson plan with instructional labels.

Your teaching strengths:
1. You make complex concepts feel simple and approachable
2. You use natural, engaging language that connects with students
3. You seamlessly integrate examples, explanations, and practice
4. You anticipate confusion points and address them naturally
5. You create a supportive, encouraging learning environment
6. You make abstract ideas concrete through relatable examples
7. You build content that flows logically from one concept to the next
8. You never reveal the instructional structure behind your teaching

Create content that a ${educationLevel} student would actually see in their coursework at ${selectedLevel} difficulty, with all teaching elements woven naturally into the material.`
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
      max_tokens: 4000 // Adjusted token limit for GPT-4o mini
    });

    // Generate a YouTube search query
    const videoQueryPrompt = `As an experienced ${educationLevel} educator teaching ${mainTopic}, you need to find the perfect educational video on "${subtopicTitle}" for your ${selectedLevel} level class that speaks ${language}.

Create a YouTube search query that will find a video that:
1. Directly addresses the specific topic
2. Is appropriate for ${educationLevel} students
3. Matches the ${selectedLevel} difficulty level
4. Is in ${language}
5. Has high pedagogical value
6. Is likely to be from a reputable educational source

Return ONLY the search query text without any additional text or formatting.`

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
      model: MODEL,
      promptMessages: promptMessages,
      completionMessage: { role: 'assistant', content: theoryResponse.choices[0].message.content },
      generationTime,
      userId,
      tokens: {
        prompt: theoryResponse.usage?.prompt_tokens,
        completion: theoryResponse.usage?.completion_tokens,
        total: theoryResponse.usage?.total_tokens
      },
      contentType: 'video-theory'
    });

    // Log video query to Keywords AI
    await logToKeywordsAI({
      model: MODEL,
      promptMessages: videoQueryMessages,
      completionMessage: { role: 'assistant', content: videoQueryResponse.choices[0].message.content },
      generationTime: generationTime / 2, // Approximate time for this part
      userId,
      tokens: {
        prompt: videoQueryResponse.usage?.prompt_tokens,
        completion: videoQueryResponse.usage?.completion_tokens,
        total: videoQueryResponse.usage?.total_tokens
      },
      contentType: 'video-query'
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
        content: `You are creating authentic ${educationLevel} study materials for ${mainTopic} that will be used directly by students.

Your content should read exactly like a well-crafted textbook or comprehensive student notes - not like a teacher's lesson plan. Never use instructional design labels as headings (like "Objectives:" or "Assessment:"). Instead, use natural content-focused headings.

Your content creation strengths:
1. You organize information in a clear, logical flow that builds understanding
2. You explain concepts in student-friendly language at ${selectedLevel} difficulty
3. You present material as if speaking directly to the student
4. You use examples, analogies and visual descriptions that make learning accessible
5. You anticipate and address confusion points naturally within explanations
6. You integrate practice opportunities that reinforce understanding
7. You create materials that could stand alone as complete learning resources
8. You keep the teaching structure invisible - students see only the content

Write as if this will be printed and handed directly to a ${educationLevel} student studying ${subtopicTitle} - they should see only well-organized content, not the educational framework behind it.`
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
      max_tokens: 4000 // Adjusted token limit for GPT-4o mini
    });

    if (!theoryResponse.choices[0].message.content) {
      throw new Error("Failed to generate PDF content from OpenAI");
    }

    // Log to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    await logToKeywordsAI({
      model: MODEL,
      promptMessages: promptMessages,
      completionMessage: { role: 'assistant', content: theoryResponse.choices[0].message.content },
      generationTime,
      userId,
      tokens: {
        prompt: theoryResponse.usage?.prompt_tokens,
        completion: theoryResponse.usage?.completion_tokens,
        total: theoryResponse.usage?.total_tokens
      },
      contentType: 'pdf'
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
        content: `You are writing authentic ${educationLevel} student materials for learning ${subtopicTitle} within ${mainTopic} at ${selectedLevel} difficulty level.

Create content that reads exactly like polished study notes or textbook material - not like a teacher's lesson plan. Never use instructional design labels in headings (like "Hook:" or "Objective:"). Use natural, topic-relevant headings instead.

Your content creation approach:
1. You write as if directly addressing the student in a warm, encouraging voice
2. You explain concepts clearly with language appropriate for ${selectedLevel} difficulty
3. You seamlessly integrate examples, explanations, practice, and feedback
4. You address potential confusion naturally within your explanations
5. You make connections to students' existing knowledge and interests
6. You break complex ideas into manageable parts without obvious scaffolding
7. You include practice opportunities that feel like natural extensions of learning
8. You keep all teaching structures invisible - students see only engaging content

This should read exactly like material a student would find in their course materials or comprehensive notes, with the pedagogical framework completely hidden behind natural content flow.`
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
      max_tokens: 4000 // Adjusted token limit for GPT-4o mini
    });

    if (!theoryResponse.choices[0].message.content) {
      throw new Error("Failed to generate content from OpenAI");
    }

    // Log theory content to Keywords AI
    const generationTime = (Date.now() - startTime) / 1000;
    await logToKeywordsAI({
      model: MODEL,
      promptMessages: theoryMessages,
      completionMessage: { role: 'assistant', content: theoryResponse.choices[0].message.content },
      generationTime,
      userId,
      tokens: {
        prompt: theoryResponse.usage?.prompt_tokens,
        completion: theoryResponse.usage?.completion_tokens,
        total: theoryResponse.usage?.total_tokens
      },
      contentType: 'text'
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
  // Adapt difficulty level description based on the selected level
  let difficultyDescription = "";
  if (selectedLevel === "easy") {
    difficultyDescription = "using foundational concepts, accessible language, and straightforward examples";
  } else if (selectedLevel === "medium") {
    difficultyDescription = "building on basic knowledge with moderate complexity and some challenging concepts";
  } else if (selectedLevel === "hard") {
    difficultyDescription = "exploring advanced concepts, sophisticated relationships, and rigorous analysis";
  }
  
  // Adapt education level specific instructions
  let educationLevelInstructions = "";
  if (educationLevel === "kg12") {
    educationLevelInstructions = `
- Use simple, concrete language with relatable examples
- Include frequent engagement through questions and activities
- Break concepts into very small, manageable pieces
- Use storytelling and characters to maintain interest
- Provide plenty of visual thinking prompts
- Reinforce concepts through repetition and varied approaches
- Keep explanations brief with immediate application`;
  } else if (educationLevel === "highSchool") {
    educationLevelInstructions = `
- Balance conceptual understanding with practical applications
- Connect content to teenagers' interests and experiences
- Include real-world examples that demonstrate relevance
- Provide more challenging analytical questions
- Include short projects or exploratory activities
- Address potential career connections to the topic
- Use engaging, age-appropriate language and examples`;
  } else if (educationLevel === "university") {
    educationLevelInstructions = `
- Provide more theoretical depth and scholarly context
- Include references to key research and relevant literature
- Encourage critical analysis and independent thinking
- Present competing perspectives or interpretations
- Connect to broader academic discourse in the field
- Include more sophisticated problem-solving approaches
- Reference scholarly terminology with clear explanations`;
  } else if (educationLevel === "skill") {
    educationLevelInstructions = `
- Focus heavily on practical application and hands-on learning
- Break skills into clear, sequential steps with specific instructions
- Include troubleshooting guidance for common challenges
- Emphasize real-world application scenarios
- Provide clear criteria for successful skill performance
- Include practice exercises with increasing independence
- Connect skills to workplace or practical contexts`;
  }

  return `Create engaging, student-centered lesson content on "${subtopicTitle}" within "${mainTopic}" for ${educationLevel} students in ${language}, at ${selectedLevel} difficulty level.

IMPORTANT: Write this exactly as it would appear in a real student's notes or textbook. DO NOT use instructional design labels like "Hook:" or "Objective:" in your headings. Instead, use natural, topic-relevant headings that a student would actually see.

Create content that flows naturally as if a skilled teacher is speaking directly to students. The material should:

1. Start with an interesting real-world scenario, question, or fascinating fact about ${subtopicTitle} that naturally draws students in without explicitly labeling it as a "hook"

2. Include clear learning goals phrased conversationally ("By the end of this lesson, you'll be able to...")

3. Connect to students' existing knowledge with relatable examples specific to ${educationLevel} level

4. Present core concepts in a structured, logical flow with:
   - Clear explanations using accessible language appropriate for ${selectedLevel} difficulty
   - Visual descriptions and analogies that make abstract concepts concrete
   - Examples AND counter-examples that clarify understanding
   - Addressing of potential misunderstandings naturally within the content
   - Gradual progression from simpler to more complex ideas

5. Integrate practice throughout with:
   - Guided examples with step-by-step thinking revealed
   - "Try This" activities with increasing independence
   - Real-world applications showing why this matters
   - Questions that promote deeper thinking
   - Clear solutions and explanations

6. Close with:
   - A summary of key points
   - Connections to other topics in ${mainTopic}
   - Next steps for further exploration
   - Quick review questions for self-assessment

Specific requirements:
${educationLevelInstructions}
- Write in a warm, encouraging voice as if speaking directly to the student
- Use second-person "you" language to create a personal connection
- Include appropriate academic terminology with clear, friendly explanations
- Format using markdown with topic-based headings (not instructional labels)
- For mathematical content, use LaTeX notation within $ symbols
- Incorporate culturally diverse examples and applications

Remember: This should read like authentic learning content a student would actually use - not like a teacher's lesson plan. The instructional design should be invisible to the student, with all teaching elements integrated naturally into the content.`;
}

function constructPDFPrompt(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string
): string {
  // Adapt difficulty level description based on the selected level
  let difficultyDescription = "";
  if (selectedLevel === "easy") {
    difficultyDescription = "using foundational concepts, accessible language, and straightforward examples";
  } else if (selectedLevel === "medium") {
    difficultyDescription = "building on basic knowledge with moderate complexity and some challenging concepts";
  } else if (selectedLevel === "hard") {
    difficultyDescription = "exploring advanced concepts, sophisticated relationships, and rigorous analysis";
  }
  
  // Adapt education level specific instructions
  let educationLevelInstructions = "";
  if (educationLevel === "kg12") {
    educationLevelInstructions = `
- Use simple, concrete language with many visual thinking prompts
- Break concepts into very small, manageable pieces
- Include frequent activities and engagement opportunities
- Use storytelling elements to maintain interest
- Include more visual organizers and less text-dense sections
- Provide plenty of examples with colorful descriptions
- Keep explanations brief with immediate application`;
  } else if (educationLevel === "highSchool") {
    educationLevelInstructions = `
- Balance conceptual understanding with practical exercises
- Connect content to teenagers' experiences and interests
- Include culturally diverse, real-world examples
- Provide scaffolded note-taking sections
- Include critical thinking prompts throughout
- Address potential career connections to the topic
- Use engaging, age-appropriate language and examples`;
  } else if (educationLevel === "university") {
    educationLevelInstructions = `
- Provide more theoretical depth and scholarly context
- Include citations and references to key research
- Encourage critical analysis through guided questions
- Present competing perspectives or interpretations
- Connect to broader academic discourse in the field
- Include more sophisticated problem-solving approaches
- Use scholarly terminology with clear explanations`;
  } else if (educationLevel === "skill") {
    educationLevelInstructions = `
- Focus primarily on practical application and sequential skill building
- Provide clear, step-by-step procedures with visual markers
- Include troubleshooting sections for common challenges
- Emphasize real-world application scenarios
- Provide assessment rubrics for skill performance
- Include practice exercises with increasing independence
- Connect skills to workplace or practical contexts`;
  }

  return `Create a comprehensive, student-friendly study guide on "${subtopicTitle}" within "${mainTopic}" for ${educationLevel} students in ${language}, at ${selectedLevel} difficulty level.

IMPORTANT: This should be formatted exactly like high-quality student notes or a textbook chapter. DO NOT include instructional design labels in headings (like "Objectives:" or "Learning Activities:"). Instead, use natural, topic-relevant headings a student would actually see in their materials.

The content should flow as if written by a knowledgeable, engaging teacher who understands how ${educationLevel} students learn best. Structure the material with:

1. A compelling introduction to ${subtopicTitle} that:
   - Presents an intriguing scenario, question, or fact that sparks curiosity
   - Clearly outlines what students will learn (written conversationally)
   - Shows why this topic matters in the real world
   - Connects to prior knowledge in ${mainTopic}

2. Main content presentation that:
   - Uses clear, engaging language appropriate for ${selectedLevel} difficulty
   - Organizes information with logical flow and natural topic-based headings
   - Explains key concepts with multiple representations (descriptions, analogies, examples)
   - Highlights important vocabulary within context (not as isolated lists)
   - Includes relevant visuals described in text (tables, diagrams, flowcharts)
   - Addresses common points of confusion within the explanations
   - Progresses from concrete to more abstract understanding

3. Practice and application opportunities that:
   - Provide worked examples showing expert thinking processes
   - Include "Your Turn" practice problems with solutions
   - Connect concepts to real-world scenarios relevant to ${educationLevel} students
   - Offer critical thinking challenges that apply knowledge in new ways
   - Include self-check questions with answer explanations

4. Synthesis and extension elements that:
   - Summarize key points in a clear, memorable way
   - Connect this topic to other aspects of ${mainTopic}
   - Suggest ways to apply this knowledge beyond the classroom
   - Provide "Going Further" resources for extended learning
   - Include a glossary of key terms as they appear in context

Specific requirements:
${educationLevelInstructions}
- Use a friendly, conversational tone with "you" language
- Write as if speaking directly to the student, not about them
- Use topic-relevant headings that reflect the subject content
- Include helpful callout boxes for tips, notes, and important points
- For mathematical expressions, use LaTeX notation within $ symbols
- Incorporate diverse, inclusive examples and scenarios

Remember: The final content should read like an actual page from an exceptional textbook or comprehensive student notes - not like a teacher's lesson plan or worksheet.`;
}