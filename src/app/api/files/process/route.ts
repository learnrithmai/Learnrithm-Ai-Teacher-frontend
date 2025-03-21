import { NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/fileprocessing';
import { FileProcessingRequest, FileProcessingResponse } from '@/types/file';
import { SYSTEM_PROMPTS, ChatMode } from '@/types/openai';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request): Promise<NextResponse<FileProcessingResponse>> {
  try {
    // Parse the request body
    const body = await request.json() as FileProcessingRequest;
    
    if (!body.file || !body.mode) {
      return NextResponse.json(
        { success: false, error: 'File metadata and mode are required' },
        { status: 400 }
      );
    }

    // Validate mode
    const mode = body.mode as ChatMode;
    if (!['study', 'reason', 'quiz', 'homeworkhelper'].includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Must be one of: study, reason, quiz, homeworkhelper' },
        { status: 400 }
      );
    }

    // Get appropriate system prompt for the selected mode
    const systemPrompt = SYSTEM_PROMPTS[mode];
    
    // Process images with vision API if it's an image
    if (body.file.contentType.startsWith('image/')) {
      try {
        const imageBuffer = await readFile(body.file.path);
        const base64Image = imageBuffer.toString('base64');
        
        const completion = await openai.chat.completions.create({
          // Updated model to the current version that supports vision
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: systemPrompt 
            },
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: `Analyze this image according to the ${mode} mode.` 
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${body.file.contentType};base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
        });

        // Return the analysis result
        return NextResponse.json({
          success: true,
          analysisResult: {
            fileId: body.file.id,
            content: "Image content",
            summary: completion.choices[0]?.message?.content || 'No analysis available',
            analysisType: 'vision'
          }
        });
      } catch (error) {
        console.error('Error processing image with Vision API:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to process image' },
          { status: 500 }
        );
      }
    }

    // For text-based files, extract content
    const fileContent = await extractTextFromFile(body.file.path, body.file.contentType);
    
    // For non-image files, ensure we got content
    if (!fileContent && !body.file.contentType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract content from file' },
        { status: 500 }
      );
    }

    // For text-based files, process with OpenAI
    const analysisPrompt = `Analyze the following content from ${body.file.filename} according to the ${mode} mode:\n\n${fileContent}`;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: analysisPrompt }
      ],
      max_tokens: 1000,
    });

    // Extract the response
    return NextResponse.json({
      success: true,
      analysisResult: {
        fileId: body.file.id,
        content: fileContent || undefined,
        summary: completion.choices[0]?.message?.content || 'No analysis available',
        analysisType: 'text'
      }
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process file' },
      { status: 500 }
    );
  }
}