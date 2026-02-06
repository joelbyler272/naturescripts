/**
 * Simple in-memory rate limiter
 *
 * Note: This works for single-instance deployments. For multi-instance
 * deployments, replace with Redis-based rate limiting (e.g., Upstash).
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 10 });
 *   const { success, remaining } = limiter.check(userId);
 */

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;  // Milliseconds until reset
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;  // Milliseconds until reset
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

export function createRateLimiter(config: RateLimitConfig) {
  const storeKey = `${config.windowMs}-${config.maxRequests}`;

  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
  }

  const store = stores.get(storeKey)!;

  // Clean up expired entries periodically
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (entry.resetTime <= now) {
        store.delete(key);
      }
    });
  }, config.windowMs);

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(identifier);

      // If no entry or expired, create new one
      if (!entry || entry.resetTime <= now) {
        store.set(identifier, {
          count: 1,
          resetTime: now + config.windowMs,
        });
        return {
          allowed: true,
          remaining: config.maxRequests - 1,
          retryAfter: 0,
        };
      }

      // Check if over limit
      if (entry.count >= config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          retryAfter: entry.resetTime - now,
        };
      }

      // Increment count
      entry.count++;
      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        retryAfter: 0,
      };
    },

    reset(identifier: string): void {
      store.delete(identifier);
    },
  };
}

// Pre-configured rate limiters for common use cases
export const apiRateLimiters = {
  // Stripe checkout: 5 requests per minute per user
  stripeCheckout: createRateLimiter({ windowMs: 60000, maxRequests: 5 }),

  // Stripe portal: 10 requests per minute per user
  stripePortal: createRateLimiter({ windowMs: 60000, maxRequests: 10 }),

  // Auth endpoints: 10 requests per minute per IP
  auth: createRateLimiter({ windowMs: 60000, maxRequests: 10 }),

  // Consultation chat: 20 requests per minute per user
  consultationChat: createRateLimiter({ windowMs: 60000, maxRequests: 20 }),

  // Consultation protocol: 10 requests per minute per user
  consultationProtocol: createRateLimiter({ windowMs: 60000, maxRequests: 10 }),
};

/**
 * Simple rate limit function for API routes
 * Uses a global store keyed by endpoint + identifier
 */
const globalStore = new Map<string, RateLimitEntry>();

export function applyRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const entry = globalStore.get(key);

  // If no entry or expired, create new one
  if (!entry || entry.resetTime <= now) {
    globalStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfter: 0,
    };
  }

  // Check if over limit
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: entry.resetTime - now,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    retryAfter: 0,
  };
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
