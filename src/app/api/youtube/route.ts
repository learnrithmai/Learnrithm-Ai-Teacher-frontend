import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchQuery = request.nextUrl.searchParams.get('q');
  
  if (!searchQuery) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // Use YouTube's embed API to search for educational videos
    const query = `${searchQuery}  tutorial`;
    const response = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    );
    
    const text = await response.text();
    const match = text.match(/"videoId":"([^"]+)"/);
    const videoId = match ? match[1] : null;

    if (videoId) {
      return NextResponse.json({ videoId });
    }

    return NextResponse.json({ error: 'No videos found' }, { status: 404 });
  } catch (error) {
    console.error('YouTube search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}