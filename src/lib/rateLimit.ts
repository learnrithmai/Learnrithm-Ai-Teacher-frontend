// Simple in-memory rate limiting
// In production, use Redis or another distributed store

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

// Store rate limit data in memory
const rateLimitStore: RateLimitStore = {};

/**
 * Check and apply rate limit
 * @param identifier - User identifier (IP address)
 * @param action - The action being rate limited
 * @param limit - Maximum number of requests allowed
 * @param windowSeconds - Time window in seconds
 * @returns boolean - true if rate limited, false otherwise
 */
export async function rateLimit(
  identifier: string,
  action: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<boolean> {
  const now = Date.now();
  const key = `${identifier}:${action}`;
  const windowMs = windowSeconds * 1000;
  
  // Initialize or reset expired entry
  if (!rateLimitStore[key] || now > rateLimitStore[key].resetTime) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs
    };
  }
  
  // Increment and check
  rateLimitStore[key].count++;
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up on each request
    cleanupRateLimits();
  }
  
  return rateLimitStore[key].count > limit;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimits(): void {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (now > rateLimitStore[key].resetTime) {
      delete rateLimitStore[key];
    }
  }
}