/**
 * Rate limiter with Upstash Redis (production) or in-memory fallback (dev).
 *
 * In production on Vercel, serverless instances don't share memory,
 * so we use Upstash Redis for distributed rate limiting.
 * Falls back to in-memory for local development when env vars aren't set.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // Milliseconds until reset
}

// ---- Redis-backed rate limiter (production) ----

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

// Cache of Ratelimit instances keyed by config
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(maxRequests: number, windowMs: number): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  const key = `${maxRequests}:${windowMs}`;
  if (!upstashLimiters.has(key)) {
    upstashLimiters.set(key, new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
      analytics: false,
      prefix: 'ns_rl',
    }));
  }
  return upstashLimiters.get(key)!;
}

// ---- In-memory fallback (development only) ----

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();
let lastCleanup = 0;

function memoryRateLimit(
  storeKey: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Lazy cleanup every 60 seconds
  if (now - lastCleanup > 60000) {
    lastCleanup = now;
    memoryStore.forEach((v, k) => {
      if (v.resetTime <= now) memoryStore.delete(k);
    });
  }

  const entry = memoryStore.get(storeKey);

  if (!entry || entry.resetTime <= now) {
    memoryStore.set(storeKey, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfter: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfter: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, retryAfter: 0 };
}

// ---- Public API ----

/**
 * Apply rate limiting for an API route.
 * Uses Upstash Redis in production, falls back to in-memory in dev.
 */
export async function applyRateLimit(
  key: string,
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(maxRequests, windowMs);

  if (limiter) {
    const result = await limiter.limit(`${key}:${identifier}`);
    return {
      allowed: result.success,
      remaining: result.remaining,
      retryAfter: result.success ? 0 : Math.max(0, result.reset - Date.now()),
    };
  }

  // Fallback: in-memory (single-instance only, for local dev)
  if (process.env.NODE_ENV === 'development') {
    return memoryRateLimit(`${key}:${identifier}`, maxRequests, windowMs);
  }

  // In production without Redis configured, log a warning and allow
  // (fail-open to avoid blocking all traffic if Redis isn't set up yet)
  console.warn('[RATE LIMIT] Upstash Redis not configured in production. Rate limiting disabled.');
  return { allowed: true, remaining: maxRequests, retryAfter: 0 };
}

/**
 * Helper to get client IP from request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}
