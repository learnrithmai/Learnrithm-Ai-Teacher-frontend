import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { FileUploadResponse } from '@/types/file';

// Define allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

export async function POST(request: Request): Promise<NextResponse<FileUploadResponse>> {
  try {
    // Use formData() instead of json() for file uploads
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
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

    // Create unique file ID and path
    const fileId = uuidv4();
    const fileName = file.name.replace(/\s+/g, '_');
    const uploadDir = join(process.cwd(), 'uploads');
    const filePath = join(uploadDir, `${fileId}-${fileName}`);

    // Create upload directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }

    // Convert file to buffer and save to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create file metadata
    const fileMetadata = {
      id: fileId,
      filename: fileName,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      path: filePath
    };

    // Return success response
    return NextResponse.json(
      { success: true, file: fileMetadata },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}