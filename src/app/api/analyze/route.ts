import { NextResponse } from 'next/server';
import { processFileStream } from '@/lib/streamProcessor';
import { AnalysisResponse } from '@/types/files';

// Define allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

// This prevents attempts to access the file system during build
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse<AnalysisResponse>> {
  try {
    // Check content type
    const contentType = request.headers.get('content-type') || '';
    
    // Handle multipart form data
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const mode = (formData.get('mode') as string) || 'study';
      const prompt = (formData.get('prompt') as string) || '';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only PDF, TXT, DOCX, JPG, and PNG files are allowed.' },
          { status: 400 }
        );
      }

      // Get file data as an array buffer and process directly
      const fileArrayBuffer = await file.arrayBuffer();
      
      // Enhance mode with prompt if provided
      let effectiveMode = mode;
      if (prompt) {
        effectiveMode = `${mode} with additional instructions: ${prompt}`;
      }
      
      const analysisResult = await processFileStream(
        fileArrayBuffer,
        file.name,
        file.type,
        effectiveMode
      );

      // Ensure analysisType is one of the allowed types
      if (!['text', 'vision', 'data'].includes(analysisResult.analysisType)) {
        throw new Error('Invalid analysis type');
      }
      
      return NextResponse.json({
        success: true,
        filename: file.name,
        contentType: file.type,
        analysisResult: {
          ...analysisResult,
          analysisType: analysisResult.analysisType as 'text' | 'vision' | 'data'
        }
      });
    }
    // Handle JSON requests
    else if (contentType.includes('application/json')) {
      const { text, mode = 'study', prompt = '' } = await request.json();
      
      if (!text) {
        return NextResponse.json(
          { success: false, error: 'No text provided' },
          { status: 400 }
        );
      }
      
      // Convert text to buffer
      const buffer = Buffer.from(text);
      
      // Enhance mode with prompt if provided
      let effectiveMode = mode;
      if (prompt) {
        effectiveMode = `${mode} with additional instructions: ${prompt}`;
      }
      
      const analysisResult = await processFileStream(
        buffer,
        'text-input.txt',
        'text/plain',
        effectiveMode
      );
      
      return NextResponse.json({
        success: true,
        analysisResult: {
          ...analysisResult,
          analysisType: analysisResult.analysisType as 'text' | 'vision' | 'data'
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing input:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing' },
      { status: 500 }
    );
  }
}