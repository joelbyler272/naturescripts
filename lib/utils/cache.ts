/**
 * Simple caching layer using Upstash Redis (production) or in-memory (dev).
 *
 * Designed for short-lived caches of per-user data (health context, tier, limits)
 * to reduce redundant Supabase RPC calls on every API request.
 */

import { Redis } from '@upstash/redis';

// ---- Redis instance (shared with rateLimit.ts via singleton) ----

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  }
  return null;
}

// ---- In-memory fallback (dev only) ----

const memoryCache = new Map<string, { value: string; expiresAt: number }>();

// ---- Public API ----

const CACHE_PREFIX = 'ns_cache:';

/**
 * Get a cached value. Returns null on miss or error.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const r = getRedis();
    if (r) {
      const value = await r.get<T>(`${CACHE_PREFIX}${key}`);
      return value ?? null;
    }

    // In-memory fallback
    const entry = memoryCache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return JSON.parse(entry.value) as T;
    }
    if (entry) memoryCache.delete(key);
    return null;
  } catch {
    return null; // fail-open: cache miss on error
  }
}

/**
 * Set a cached value with TTL in seconds.
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  try {
    const r = getRedis();
    if (r) {
      await r.set(`${CACHE_PREFIX}${key}`, JSON.stringify(value), { ex: ttlSeconds });
      return;
    }

    // In-memory fallback
    memoryCache.set(key, {
      value: JSON.stringify(value),
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  } catch {
    // Silently ignore cache write failures
  }
}

/**
 * Delete a cached value (e.g., on profile update or tier change).
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    const r = getRedis();
    if (r) {
      await r.del(`${CACHE_PREFIX}${key}`);
      return;
    }
    memoryCache.delete(key);
  } catch {
    // Silently ignore
  }
}

/**
 * Invalidate all cache entries for a user (e.g., after Stripe webhook updates tier).
 * Uses key pattern: ns_cache:user:{userId}:*
 */
export async function cacheInvalidateUser(userId: string): Promise<void> {
  try {
    const r = getRedis();
    if (r) {
      // Scan and delete user-specific keys
      const keys: string[] = [];
      let cursor: number | string = 0;
      do {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await r.scan(cursor as number, { match: `${CACHE_PREFIX}user:${userId}:*`, count: 100 });
        cursor = result[0];
        keys.push(...(result[1] as string[]));
      } while (cursor !== 0 && cursor !== '0');

      if (keys.length > 0) {
        await r.del(...keys);
      }
      return;
    }

    // In-memory fallback: delete all keys matching the user prefix
    const prefix = `user:${userId}:`;
    const keysToDelete: string[] = [];
    memoryCache.forEach((_v, k) => {
      if (k.startsWith(prefix)) keysToDelete.push(k);
    });
    keysToDelete.forEach(k => memoryCache.delete(k));
  } catch {
    // Silently ignore
  }
}

// ---- Convenience helpers for common lookups ----

/** Cache key for user health context */
export function healthContextKey(userId: string): string {
  return `user:${userId}:health_context`;
}

/** Cache key for user tier */
export function userTierKey(userId: string): string {
  return `user:${userId}:tier`;
}

/** Default TTLs */
export const CACHE_TTL = {
  HEALTH_CONTEXT: 300,  // 5 minutes — changes rarely
  USER_TIER: 300,       // 5 minutes — changes on subscription events
  CONSULTATION_LIMIT: 60, // 1 minute — changes each consultation
} as const;
