import { Buffer } from 'buffer';
import OpenAI from 'openai';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  // Convert to Buffer if it's ArrayBuffer
  const buffer = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer 
    : Buffer.from(fileBuffer);
  
  // Extract text from PDF
  const pdfData = await pdfParse(buffer);
  const extractedText = pdfData.text;
  
  // Process the extracted text with OpenAI
  return processExtractedText(extractedText, mode);
}

/**
 * Process DOCX stream by extracting text and analyzing
 */
async function processDocxStream(
  fileBuffer: Buffer | ArrayBuffer,
  mode: string
) {
  // Convert to Buffer if it's ArrayBuffer
  const buffer = Buffer.isBuffer(fileBuffer) 
    ? fileBuffer 
    : Buffer.from(fileBuffer);
  
  // Extract text from DOCX
  const result = await mammoth.extractRawText({ 
    buffer: buffer as Buffer
  });
  
  const extractedText = result.value;
  
  // Process the extracted text with OpenAI
  return processExtractedText(extractedText, mode);
}

/**
 * Process text file stream
 */
async function processTextStream(
  fileBuffer: Buffer | ArrayBuffer,
  mode: string
) {
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
  // Get appropriate system prompt for the mode
  const systemPrompt = getSystemPromptForMode(mode);
  
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