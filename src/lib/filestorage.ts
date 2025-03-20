import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { FileMetadata } from '@/types/file';

// Configure storage paths
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB max file size

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Save uploaded file to disk
export async function saveFile(file: File, userId?: string): Promise<FileMetadata> {
  // Generate unique ID for the file
  const fileId = uuidv4();
  
  // Create user directory if provided
  const userDir = userId ? path.join(UPLOAD_DIR, userId) : UPLOAD_DIR;
  if (userId && !fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  
  // Define file path
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = path.join(userDir, `${fileId}-${sanitizedFilename}`);
  
  // Read file data
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Write file to disk
  fs.writeFileSync(filePath, buffer);
  
  // Create and return metadata
  const metadata: FileMetadata = {
    id: fileId,
    filename: file.name,
    contentType: file.type,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    userId,
    path: filePath
  };
  
  // Save metadata
  const metaFilePath = `${filePath}.meta.json`;
  fs.writeFileSync(metaFilePath, JSON.stringify(metadata, null, 2));
  
  return metadata;
}

// Get file by ID
export function getFileById(fileId: string, userId?: string): FileMetadata | null {
  // Search in the appropriate directory
  const searchDir = userId ? path.join(UPLOAD_DIR, userId) : UPLOAD_DIR;
  
  try {
    // List all files in the directory
    const files = fs.readdirSync(searchDir);
    
    // Find file that starts with the given ID
    const targetFile = files.find(file => file.startsWith(`${fileId}-`) && !file.endsWith('.meta.json'));
    
    if (!targetFile) {
      return null;
    }
    
    // Check if metadata file exists
    const metaFilePath = path.join(searchDir, `${targetFile}.meta.json`);
    if (fs.existsSync(metaFilePath)) {
      const metadata = JSON.parse(fs.readFileSync(metaFilePath, 'utf8')) as FileMetadata;
      return metadata;
    }
    
    // If no metadata file, generate one
    const filePath = path.join(searchDir, targetFile);
    const stats = fs.statSync(filePath);
    
    const metadata: FileMetadata = {
      id: fileId,
      filename: targetFile.substring(fileId.length + 1),
      contentType: 'application/octet-stream',
      size: stats.size,
      uploadedAt: stats.birthtime.toISOString(),
      userId,
      path: filePath
    };
    
    return metadata;
  } catch (error) {
    console.error('Error retrieving file:', error);
    return null;
  }
}

// Delete file by ID
export function deleteFile(fileId: string, userId?: string): boolean {
  // Get the file metadata
  const metadata = getFileById(fileId, userId);
  
  if (!metadata) {
    return false;
  }
  
  try {
    // Delete the actual file
    fs.unlinkSync(metadata.path);
    
    // Delete the metadata file
    const metaFilePath = `${metadata.path}.meta.json`;
    if (fs.existsSync(metaFilePath)) {
      fs.unlinkSync(metaFilePath);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}