import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { rateLimit } from '@/lib/rateLimit';
import { mkdir } from 'fs/promises';

// Define allowed file types
const allowedFileTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Maximum file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimited = await rateLimit(ip, 'file-upload', 10, 60); // 10 uploads per minute
    
    if (rateLimited) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      }, { status: 429 });
    }

    // Get form data with file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`
      }, { status: 400 });
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'File type not supported'
      }, { status: 400 });
    }

    // Generate a unique ID for the file
    const fileId = uuidv4();
    
    // Get file extension from type
    let extension = '';
    if (file.type === 'application/pdf') extension = '.pdf';
    else if (file.type === 'text/plain') extension = '.txt';
    else if (file.type === 'application/msword') extension = '.doc';
    else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') extension = '.docx';
    else if (file.type === 'image/jpeg') extension = '.jpg';
    else if (file.type === 'image/png') extension = '.png';
    else if (file.type === 'image/webp') extension = '.webp';
    else if (file.type === 'text/csv') extension = '.csv';
    else if (file.type === 'application/vnd.ms-excel') extension = '.xls';
    else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') extension = '.xlsx';
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    
    // Save file path
    const fileName = `${fileId}${extension}`;
    const filePath = join(uploadsDir, fileName);
    
    // Convert file to buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Store file metadata in database (simplified here)
    const fileMetadata = {
      id: fileId,
      originalName: file.name,
      type: file.type,
      size: file.size,
      path: filePath,
      uploadedAt: new Date().toISOString()
    };
    
    // In a real application, save this metadata to your database
    
    return NextResponse.json({
      success: true,
      fileId: fileId,
      name: file.name,
      type: file.type,
      size: file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser to handle file uploads
  },
};