import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client with service role key.
 * Used for privileged operations in the backend.
 * Uses environment variables for Supabase URL and Service Role Key.
 */
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)