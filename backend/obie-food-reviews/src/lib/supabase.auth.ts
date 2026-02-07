import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for authentication in backend.
 * Configured to not persist sessions or auto-refresh tokens.
 * Uses environment variables for Supabase URL and Anon Key.
 */
export const supabaseAuth = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
  }
);