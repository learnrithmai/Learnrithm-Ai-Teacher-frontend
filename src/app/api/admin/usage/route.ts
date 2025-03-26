import { NextResponse } from 'next/server';
import { getUsageStats } from '@/lib/api';
import { ENV } from '@/types/envSchema';

export async function GET(request: Request): Promise<Response | void> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  if (token !== ENV.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getUsageStats();
  return NextResponse.json(stats);
}