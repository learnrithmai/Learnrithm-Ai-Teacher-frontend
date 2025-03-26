// Simple in-memory cache for API responses

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// Cache storage
const cache: Record<string, CacheEntry> = {};

// Cache TTL (time-to-live) in milliseconds - 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

// Generate a cache key from the request
interface Message {
  role: string;
  content: string;
}

export function generateCacheKey(messages: Message[], model: string, mode?: string): string {
  // Create a deterministic string from the request
  const lastUserMessage = [...messages]
    .reverse()
    .find(m => m.role === 'user')?.content || '';
  
  // Use last user message + model + mode as the cache key
  return `${lastUserMessage.slice(0, 100)}-${model}-${mode || 'default'}`;
}

// Get a cached response if it exists and is fresh
export function getCachedResponse(cacheKey: string): unknown | null {
  const entry = cache[cacheKey];
  
  // Check if entry exists and is not expired
  if (entry && (Date.now() - entry.timestamp) < CACHE_TTL) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return entry.data;
  }
  
  console.log(`Cache miss for key: ${cacheKey}`);
  return null;
}

// Store a response in the cache
export function setCachedResponse(cacheKey: string, data: unknown): void {
  cache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
  console.log(`Cached response for key: ${cacheKey}`);
}