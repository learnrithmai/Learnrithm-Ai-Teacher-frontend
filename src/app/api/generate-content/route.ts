import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const {
      mainTopic,
      subtopicTitle,
      contentType,
      educationLevel,
      language = "English",
      selectedLevel = "medium",
    } = body;

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
        content = await generateVideoTextContent(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);
      } else if (contentType === "PDF Course") {
        content = await generatePDFContent(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);
      } else {
        content = await generateTextImageContent(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);
      }

      return NextResponse.json({
        success: true,
        content
      });
    } catch (error) {
      console.error("Content generation error:", error);
      return NextResponse.json(
        { success: false, message: "Error generating content", error: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
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
  selectedLevel: string
) {
  try {
    // Generate theory content first
    const theoryPrompt = constructTheoryPrompt(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);

    const theoryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert educational content creator specializing in ${mainTopic}, particularly on topics related to ${subtopicTitle}. 
          Create accurate, comprehensive, and pedagogically sound content that is directly relevant to the requested topic.
          Ensure your content is factually correct and appropriate for ${educationLevel} education at ${selectedLevel} difficulty level.`
        },
        {
          role: "user",
          content: theoryPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    // Generate a YouTube search query
    const videoQueryPrompt = `Create a precise YouTube search query for a high-quality educational video about "${subtopicTitle}" 
    in the context of ${mainTopic} for ${educationLevel} level students (${selectedLevel} difficulty) in ${language}.
    Return ONLY the search query text without any formatting or extra text.`;

    const videoQueryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You create precise search queries for educational videos. Respond with only the search query, no other text."
        },
        {
          role: "user",
          content: videoQueryPrompt
        }
      ],
      temperature: 0.5,
      max_tokens: 100
    });

    if (!theoryResponse.choices[0].message.content || !videoQueryResponse.choices[0].message.content) {
      throw new Error("Failed to generate content from OpenAI");
    }

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
  selectedLevel: string
) {
  try {
    const theoryPrompt = constructPDFPrompt(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);

    const theoryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in creating educational content for PDFs. Your content should be well-structured, accurate, and optimized for PDF reading. Use markdown formatting."
        },
        {
          role: "user",
          content: theoryPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    if (!theoryResponse.choices[0].message.content) {
      throw new Error("Failed to generate PDF content from OpenAI");
    }

    return {
      theory: theoryResponse.choices[0].message.content,
      type: "pdf"
    };
  } catch (error) {
    console.error("Error in PDF content generation:", error);
    throw error;
  }
}

async function generateTextImageContent(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string
) {
  try {
    // Generate theory content
    const theoryPrompt = constructTheoryPrompt(mainTopic, subtopicTitle, language, educationLevel, selectedLevel);

    const theoryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educator specializing in creating engaging, accurate educational content. Format your response using markdown for clarity."
        },
        {
          role: "user",
          content: theoryPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    // Generate an image prompt
    const imagePromptText = constructImagePrompt(mainTopic, subtopicTitle, educationLevel);

    const imagePromptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You create detailed prompts for generating educational images. Respond with only the image prompt, no other text."
        },
        {
          role: "user",
          content: imagePromptText
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    if (!theoryResponse.choices[0].message.content || !imagePromptResponse.choices[0].message.content) {
      throw new Error("Failed to generate content from OpenAI");
    }

    return {
      theory: theoryResponse.choices[0].message.content,
      imagePrompt: imagePromptResponse.choices[0].message.content.trim(),
      type: "image"
    };
  } catch (error) {
    console.error("Error in text/image content generation:", error);
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
  return `Create comprehensive educational content about the subtopic "${subtopicTitle}" 
  within the main topic "${mainTopic}" for ${educationLevel} level students (${selectedLevel} difficulty).
  
  Your content must include:
  1. A clear introduction to the concept
  2. Detailed explanations with examples
  3. Key principles or relationships
  4. Practical applications
  5. A brief summary
  
  Requirements:
  - Content must be in ${language}
  - Use appropriate complexity for ${educationLevel} level
  - Format using markdown with clear headings (##) and sections
  - Include code examples if relevant
  - Add bullet points or numbered lists for better readability
  - Include practice questions or exercises
  - End with a summary of key points`;
}

function constructPDFPrompt(
  mainTopic: string,
  subtopicTitle: string,
  language: string,
  educationLevel: string,
  selectedLevel: string
): string {
  return `Create comprehensive educational content about the subtopic "${subtopicTitle}" 
  within the main topic "${mainTopic}" for ${educationLevel} level students (${selectedLevel} difficulty).
  
  Structure the content for PDF format with:
  1. Title and Introduction
  2. Learning Objectives
  3. Main Content (with clear sections)
  4. Examples and Illustrations
  5. Practice Exercises
  6. Summary
  7. Additional Resources
  
  Requirements:
  - Content must be in ${language}
  - Use appropriate complexity for ${educationLevel} level
  - Format using markdown with clear headings (##) and sections
  - Include tables or diagrams descriptions where relevant
  - Add practice questions with solutions
  - Include key terms and definitions
  - End with suggestions for further reading`;
}

function constructImagePrompt(
  mainTopic: string,
  subtopicTitle: string,
  educationLevel: string
): string {
  return `Create a detailed prompt for generating an educational image that illustrates 
  the concept of "${subtopicTitle}" within the context of "${mainTopic}" for ${educationLevel} level students.
  
  Your prompt should specify:
  1. The main visual elements to include
  2. The preferred style (diagram, illustration, infographic)
  3. Any text or labels to include
  4. The suggested color scheme
  5. The layout and composition
  
  Make the prompt specific and detailed to ensure the generated image is clear, 
  informative, and directly relevant to teaching this educational concept.
  
  Return ONLY the image generation prompt, no other text.`;
}