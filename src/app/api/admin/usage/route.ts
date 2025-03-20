import { NextResponse } from 'next/server';
import { getUsageStats } from '@/lib/api';

export function GET(request: Request) {
  // In production, add authentication check here
  const authHeader = request.headers.get('authorization');
  
  // Simple auth check - replace with proper auth in production
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get token from header
  const token = authHeader.split(' ')[1];
  
  // Check if token is valid (use a secure method in production)
  if (token !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Return usage stats
  return NextResponse.json(getUsageStats());
}