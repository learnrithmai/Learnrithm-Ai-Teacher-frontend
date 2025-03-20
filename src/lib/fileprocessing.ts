import { join } from 'path';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import * as pdfjs from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { Readable } from 'stream';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ExtractionResult {
  success: boolean;
  content?: string;
  fileName?: string;
  error?: string;
}

/**
 * Extract text content from various file types
 */
export async function extractTextFromFile(fileId: string): Promise<ExtractionResult> {
  try {
    // Check for different file extensions
    const possibleExtensions = ['.pdf', '.txt', '.doc', '.docx', '.jpg', '.png', '.webp', '.csv', '.xls', '.xlsx'];
    let filePath: string | null = null;
    let fileName: string | null = null;
    
    // Find the file with the correct extension
    for (const ext of possibleExtensions) {
      const path = join(process.cwd(), 'uploads', `${fileId}${ext}`);
      
      try {
        await access(path, constants.R_OK);
        filePath = path;
        fileName = `${fileId}${ext}`;
        break;
      } catch {
        // File with this extension doesn't exist, try the next one
        continue;
      }
    }
    
    if (!filePath || !fileName) {
      return {
        success: false,
        error: 'File not found'
      };
    }
    
    // Extract text based on file type
    if (fileName.endsWith('.pdf')) {
      return await extractTextFromPdf(filePath, fileName);
    } else if (fileName.endsWith('.txt')) {
      return await extractTextFromTxt(filePath, fileName);
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.webp')) {
      return await extractTextFromImage(filePath, fileName);
    } else if (fileName.endsWith('.csv')) {
      return await extractTextFromCsv(filePath, fileName);
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
               fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      // For Office documents, we'd typically use libraries like mammoth.js, docx, excel4node
      // This is simplified for the example
      return {
        success: false,
        error: `Extraction from ${fileName.split('.').pop()} files is not yet implemented`
      };
    } else {
      return {
        success: false,
        error: 'Unsupported file type'
      };
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return {
      success: false,
      error: 'Failed to extract text from file'
    };
  }
}

/**
 * Extract text from PDF files
 */
async function extractTextFromPdf(filePath: string, fileName: string): Promise<ExtractionResult> {
  try {
    const data = await readFile(filePath);
    const pdf = await pdfjs.getDocument(data).promise;
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      
      // Limit text extraction to avoid excessive token usage
      if (fullText.length > 100000) {
        fullText = fullText.substring(0, 100000) + '... [Content truncated due to length]';
        break;
      }
    }
    
    return {
      success: true,
      content: fullText,
      fileName
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return {
      success: false,
      error: 'Failed to extract text from PDF'
    };
  }
}

/**
 * Extract text from text files
 */
async function extractTextFromTxt(filePath: string, fileName: string): Promise<ExtractionResult> {
  try {
    const buffer = await readFile(filePath);
    let content = buffer.toString('utf-8');
    
    // Limit content to avoid excessive token usage
    if (content.length > 100000) {
      content = content.substring(0, 100000) + '... [Content truncated due to length]';
    }
    
    return {
      success: true,
      content,
      fileName
    };
  } catch (error) {
    console.error('Error extracting text from TXT:', error);
    return {
      success: false,
      error: 'Failed to extract text from text file'
    };
  }
}

/**
 * Extract text from images using Tesseract OCR
 */
async function extractTextFromImage(filePath: string, fileName: string): Promise<ExtractionResult> {
  try {
    const worker = await createWorker('eng');
    
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    
    return {
      success: true,
      content: text,
      fileName
    };
  } catch (error) {
    console.error('Error extracting text from image:', error);
    return {
      success: false,
      error: 'Failed to extract text from image'
    };
  }
}

/**
 * Extract text from CSV files
 */
async function extractTextFromCsv(filePath: string, fileName: string): Promise<ExtractionResult> {
  try {
    const buffer = await readFile(filePath);
    const content = buffer.toString('utf-8');
    
    // For simplicity, we're just returning the raw CSV content
    // In a real application, you might want to parse it properly
    
    return {
      success: true,
      content,
      fileName
    };
  } catch (error) {
    console.error('Error extracting text from CSV:', error);
    return {
      success: false,
      error: 'Failed to extract text from CSV file'
    };
  }
}