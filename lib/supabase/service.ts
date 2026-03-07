import { createClient } from '@supabase/supabase-js';

/**
 * Error thrown when required Supabase service environment variables are missing.
 * Re-thrown through catch blocks so admin pages can display a diagnostic message.
 */
export class ServiceClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceClientError';
  }
}

/**
 * Service role client for server-side operations (webhooks, admin).
 * NEVER expose the service role key to the client.
 */
export function createServiceClient() {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missing.length > 0) {
    throw new ServiceClientError(
      `Missing required environment variable(s): ${missing.join(', ')}. Add them to .env.local and restart the dev server.`
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
