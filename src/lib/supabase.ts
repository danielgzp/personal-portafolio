import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"

/**
 * Server-side Supabase client using the service role key.
 * Only used in API routes and server-side scripts — never exposed to the browser.
 */
export const supabase = createClient(supabaseUrl, supabaseKey)
