import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
// Secret key (sb_secret_...) bypasses RLS — use only in server-side API routes.
// Never expose to the browser. See: https://supabase.com/docs/guides/getting-started/api-keys
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "placeholder-key"

/**
 * Server-side Supabase client using the secret key.
 * Only used in API routes and server-side scripts — never exposed to the browser.
 * For client-side code, use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY instead.
 */
export const supabase = createClient(supabaseUrl, supabaseKey)
