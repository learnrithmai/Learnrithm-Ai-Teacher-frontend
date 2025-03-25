import { readFile } from 'fs/promises';
import mammoth from 'mammoth';
import { extname } from 'path';
// Import pdf-parse at the top level
import pdfParse from 'pdf-parse';

/**
 * Extract text from various file types
 */
export async function extractTextFromFile(filePath: string, contentType: string): Promise<string | null> {
  try {
    // Determine file type from contentType or extension
    const fileExt = extname(filePath).toLowerCase();
    
    if (contentType === 'application/pdf' || fileExt === '.pdf') {
      return extractTextFromPdf(filePath);
    } else if (contentType === 'text/plain' || fileExt === '.txt') {
      return extractTextFromTxt(filePath);
    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileExt === '.docx') {
      return extractTextFromDocx(filePath);
    } else if (contentType.startsWith('image/')) {
      // For images, we'll use vision API, so no text extraction needed
      return null;
    }
    
    throw new Error(`Unsupported file type: ${contentType}`);
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return null;
  }
}

/**
 * Extract text from PDF files
 */
async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    // Load PDF file directly - don't use require() for pdf-parse
    const dataBuffer = await readFile(filePath);
    
    // Process PDF with proper options to avoid looking for test files
    const data = await pdfParse(dataBuffer, {
      // Prevent the library from trying to load test files
      version: 'default'
    });
    
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Return a fallback rather than throwing
    return "Could not extract text from PDF. The file may be corrupted or password protected.";
  }
}

/**
 * Extract text from TXT files
 */
async function extractTextFromTxt(filePath: string): Promise<string> {
  try {
    const buffer = await readFile(filePath);
    return buffer.toString('utf8');
  } catch (error) {
    console.error('Error extracting text from TXT:', error);
    throw error;
  }
}

/**
 * Extract text from DOCX files using mammoth
 */
async function extractTextFromDocx(filePath: string): Promise<string> {
  try {
    // Use mammoth to extract text from the DOCX file
    const result = await mammoth.extractRawText({
      path: filePath
    });
    
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw error;
  }
}