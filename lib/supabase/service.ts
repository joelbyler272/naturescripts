import { createClient } from '@supabase/supabase-js';

/**
 * Service role client for server-side operations (webhooks, admin).
 * NEVER expose the service role key to the client.
 */
export function createServiceClient() {
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
