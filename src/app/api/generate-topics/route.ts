import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      description: `An exploration of the core concepts that form the foundation of ${subject}. Students will gain a solid understanding of essential theories and frameworks at a ${difficulty} difficulty level.`,
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
  try {
    // Parse the request body
    const body = await req.json();
    
    // Extract parameters with defaults
    const subject = body.subject;
    const difficulty = body.difficulty || "medium";
    const educationLevel = body.educationLevel || "university";
    const count = body.count || 5;
    const subtopics = Array.isArray(body.subtopics) ? body.subtopics : [];
    
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
    
    const prompt = `Generate ${count} educational topics for teaching "${subject}" at ${difficulty} difficulty level for ${educationLevel} students. ${subtopicText}

Each topic must include:
1. A clear, descriptive name
2. A detailed description (50-100 words)
3. 3-5 relevant subtopics

Format your response EXACTLY as this JSON structure with no additional text:
{
  "topics": [
    {
      "name": "Topic Name Example",
      "description": "Description example...",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
    }
  ]
}`;

    try {
      // Make OpenAI API request
      console.log(`Requesting topics for ${subject} (${difficulty} level)...`);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an API that only returns valid JSON. You are an expert educational content creator."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
      });
      
      // Get response content
      const content = completion.choices[0].message.content;
      
      if (!content) {
        throw new Error("No content generated");
      }
      
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
        // Return fallback topics if parsing fails
        console.log(`Parsing error: ${parseError instanceof Error ? parseError.message : String(parseError)}. Using fallback topics.`);
        
        return NextResponse.json({
          success: true,
          data: { topics: getFallbackTopics(subject, difficulty, educationLevel, subtopics) },
          fallback: true
        });
      }
    } catch (apiError) {
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
    // Handle general errors
    console.error("General error:", error);
    
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}