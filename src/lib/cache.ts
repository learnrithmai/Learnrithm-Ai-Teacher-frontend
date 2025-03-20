// Simple in-memory cache implementation
// In production, use Redis or another distributed cache

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class Cache {
  private store = new Map<string, CacheEntry<any>>();
  
  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or null if not found or expired
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    const now = Date.now();
    
    // Return null if entry doesn't exist or has expired
    if (!entry || now > entry.expiry) {
      if (entry) this.store.delete(key); // Clean up expired entry
      return null;
    }
    
    return entry.value;
  }
  
  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlSeconds - Time-to-live in seconds
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000
    });
    
    // Clean up cache if it's getting too large (more than 1000 entries)
    if (this.store.size > 1000) {
      this.cleanup();
    }
  }
  
  /**
   * Delete a value from the cache
   * @param key - Cache key
   */
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
  
  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key);
      }
    }
  }
}

// Export singleton instance
export const cache = new Cache();