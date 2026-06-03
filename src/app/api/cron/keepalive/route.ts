import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * Vercel Cron Job to keep Supabase database active.
 * Prevents the project from being paused due to inactivity.
 */

export async function GET(request: Request) {
  // Check for Vercel Cron Authorization header
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    // Simple query to keep the database active
    const { data, error } = await supabase.from("documents").select("id").limit(1)

    if (error) {
      console.error("Supabase Keep-Alive Error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive successful",
      data,
    })
  } catch (err) {
    console.error("Unexpected error in cron job:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
