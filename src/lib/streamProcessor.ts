import { Buffer } from 'buffer';
import OpenAI from 'openai';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

// Improved detection of build/deployment environments
const isBuildOrDeployment = () => {
  return (
    typeof window === 'undefined' && 
    (
      // Check if we're in a build environment
      process.env.NODE_ENV === 'production' && 
      !process.env.NEXT_RUNTIME ||
      // Or if OPENAI_API_KEY is missing (likely during deployment)
      !process.env.OPENAI_API_KEY
    )
  );
};

// Initialize OpenAI with mock during build or deployment without API key
const openai = isBuildOrDeployment()
  ? {
      chat: {
        completions: {
          create: async () => ({ 
            choices: [{ message: { content: 'Mock response during build/deployment' } }]
          })
        }
      }
    } as unknown as OpenAI
  : new OpenAI({
      // Only try to use the API key if we're confident it exists
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-type-safety',
    });

/**
 * Process file stream directly to OpenAI without saving to disk
 */
export async function processFileStream(
  fileBuffer: Buffer | ArrayBuffer,
  filename: string,
  contentType: string,
  mode: string
) {
  // Return mock data during build or deployment without API key
  if (isBuildOrDeployment()) {
    console.log('Running in build/deployment environment, returning mock data');
    return {
      content: "Mock content",
      summary: "Mock summary for build/deployment process",
      analysisType: 'text' as 'text' | 'vision' | 'data'
    };
  }

  try {
    // Handle different file types
    if (contentType.startsWith('image/')) {
      // For images, directly process with Vision API
      return await processImageStream(fileBuffer, contentType, mode);
    } else if (contentType === 'application/pdf') {
      // For PDFs, extract text first
      return await processPdfStream(fileBuffer, mode);
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX, extract text first
      return await processDocxStream(fileBuffer, mode);
    } else if (contentType === 'text/plain') {
      // For TXT, directly process the text
      return await processTextStream(fileBuffer, mode);
    } else {
      throw new Error(`Unsupported file type: ${contentType}`);
    }
  } catch (error) {
    console.error('Error processing file stream:', error);
    throw error;
  }
}

/**
 * Process image stream with Vision API
 */
async function processImageStream(
  fileBuffer: Buffer | ArrayBuffer,
  contentType: string,
  mode: string
) {
  // Return mock data during build or deployment without API key
  if (isBuildOrDeployment()) {
    return {
      content: "Image content",
      summary: "Mock image analysis for build/deployment process",
      analysisType: 'vision' as 'text' | 'vision' | 'data'
    };
  }

  // Convert to Buffer if it's ArrayBuffer
  const buffer = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer 
    : Buffer.from(fileBuffer);
  
  // Convert to base64 for API consumption
  const base64Data = buffer.toString('base64');
  
  // Get appropriate system prompt for the mode
  const systemPrompt = getSystemPromptForMode(mode);
  
  // Process with OpenAI Vision
  const result = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: [
          { 
            type: 'text',
            text: `Analyze this image according to the ${mode} mode.` 
          },
          {
            type: 'image_url',
            image_url: { 
              url: `data:${contentType};base64,${base64Data}` 
            }
          }
        ]
      }
    ],
    max_tokens: 1000,
  });
  
  return {
    content: "Image content",
    summary: result.choices[0]?.message?.content || 'No analysis available',
    analysisType: 'vision'
  };
}

/**
 * Process PDF stream by extracting text and analyzing
 */
async function processPdfStream(
  fileBuffer: Buffer | ArrayBuffer,
  mode: string
) {
  // Return mock data during build or deployment without API key
  if (isBuildOrDeployment()) {
    return {
      content: "PDF content",
      summary: "Mock PDF analysis for build/deployment process",
      analysisType: 'text' as 'text' | 'vision' | 'data'
    };
  }

  // Convert to Buffer if it's ArrayBuffer
  const buffer = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer 
    : Buffer.from(fileBuffer);
  
  try {
    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;
    
    // Process the extracted text with OpenAI
    return processExtractedText(extractedText, mode);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return {
      content: "Error processing PDF",
      summary: "There was an error processing the PDF file. Please try a different file.",
      analysisType: 'text'
    };
  }
}

/**
 * Process DOCX stream by extracting text and analyzing
 */
async function processDocxStream(
  fileBuffer: Buffer | ArrayBuffer,
  mode: string
) {
  // Return mock data during build or deployment without API key
  if (isBuildOrDeployment()) {
    return {
      content: "DOCX content",
      summary: "Mock DOCX analysis for build/deployment process",
      analysisType: 'text' as 'text' | 'vision' | 'data'
    };
  }

  // Convert to Buffer if it's ArrayBuffer
  const buffer = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer 
    : Buffer.from(fileBuffer);
  
  try {
    // Extract text from DOCX
    const result = await mammoth.extractRawText({ 
      buffer: buffer as Buffer
    });
    
    const extractedText = result.value;
    
    // Process the extracted text with OpenAI
    return processExtractedText(extractedText, mode);
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    return {
      content: "Error processing DOCX",
      summary: "There was an error processing the DOCX file. Please try a different file.",
      analysisType: 'text'
    };
  }
}

/**
 * Process text file stream
 */
async function processTextStream(
  fileBuffer: Buffer | ArrayBuffer,
  mode: string
) {
  // Return mock data during build or deployment without API key
  if (isBuildOrDeployment()) {
    return {
      content: "Text content",
      summary: "Mock text analysis for build/deployment process",
      analysisType: 'text' as 'text' | 'vision' | 'data'
    };
  }

  // Convert to Buffer if it's ArrayBuffer
  const buffer = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer 
    : Buffer.from(fileBuffer);
  
  // Convert buffer to text
  const text = buffer.toString('utf8');
  
  // Process the text with OpenAI
  return processExtractedText(text, mode);
}

/**
 * Process extracted text content with OpenAI
 */
async function processExtractedText(text: string, mode: string) {
  // Return mock data during build or deployment without API key
  if (isBuildOrDeployment()) {
    return {
      content: text.substring(0, 100) + "...",
      summary: "Mock analysis for build/deployment process",
      analysisType: 'text' as 'text' | 'vision' | 'data'
    };
  }

  // Get appropriate system prompt for the mode
  const systemPrompt = getSystemPromptForMode(mode);
  
  try {
    // Analyze with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze the following content according to the ${mode} mode:\n\n${text}` }
      ],
      max_tokens: 1000,
    });
    
    return {
      content: text,
      summary: completion.choices[0]?.message?.content || 'No analysis available',
      analysisType: 'text'
    };
  } catch (error) {
    console.error('Error getting completion from OpenAI:', error);
    return {
      content: text,
      summary: "There was an error analyzing this content. Please try again later.",
      analysisType: 'text'
    };
  }
}

/**
 * Get system prompt for the specified mode
 */
function getSystemPromptForMode(mode: string): string {
  switch (mode) {
    case 'study':
      return "You are a helpful study assistant. Your goal is to help the student understand concepts clearly and learn effectively. Break down complex topics, provide clear explanations, and use examples when helpful.";
    case 'reason':
      return "You are a reasoning assistant. Your goal is to help the user think through problems step by step. Identify assumptions, analyze arguments, consider different perspectives, and help with logical problem solving.";
    case 'quiz':
      return "You are a quiz creator. Generate relevant questions based on the content provided. Create questions that test understanding rather than just recall. Provide answers and explanations after the questions.";
    case 'homeworkhelper':
      return "You are a homework helper. Your goal is to guide the student through solving problems without giving away complete answers. Provide hints, ask guiding questions, and explain concepts that will help them solve the problem on their own.";
    default:
      return "You are a helpful assistant analyzing content provided by the user.";
  }
}