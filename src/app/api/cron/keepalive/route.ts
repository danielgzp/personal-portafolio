import { NextResponse } from "next/server"
import { timingSafeEqual } from "crypto"
import { supabase } from "@/lib/supabase"

/**
 * Vercel Cron Job to keep Supabase database active.
 * Prevents the project from being paused due to inactivity.
 */

// M3: Use constant-time comparison to prevent timing attacks on the cron secret
function verifyCronSecret(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET
  if (!authHeader || !secret) return false
  const provided = authHeader.replace("Bearer ", "")
  if (provided.length !== secret.length) return false
  return timingSafeEqual(Buffer.from(provided), Buffer.from(secret))
}

export async function GET(request: Request) {
  // Check for Vercel Cron Authorization header
  if (!verifyCronSecret(request.headers.get("authorization"))) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    // Simple query to keep the database active
    const { error } = await supabase.from("documents").select("id").limit(1)

    if (error) {
      console.error("Supabase Keep-Alive Error:", error)
      // M2: Do not expose internal error details in the response
      return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
    }

    // L2: Remove internal data from the response to avoid leaking document IDs
    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive successful",
    })
  } catch (err) {
    console.error("Unexpected error in cron job:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
