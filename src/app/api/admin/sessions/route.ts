import { createClient } from "@/lib/supabase/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 1. Authenticate user
    const client = await createClient()
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Fetch sessions and messages using the service_role key to bypass RLS policies
    const { data: sessions, error: dbError } = await supabase
      .from("chat_sessions")
      .select(`
        id,
        created_at,
        updated_at,
        chat_messages (
          id,
          model,
          created_at,
          user_query,
          ai_response,
          rag_context_used,
          prompt_tokens,
          completion_tokens,
          generation_time_ms,
          error_message
        )
      `)
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("[GET /api/admin/sessions] Database error:", dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // 3. Format sessions with aggregate statistics
    const formattedSessions = (sessions || []).map((session) => {
      const messages = session.chat_messages || []
      const messageCount = messages.length
      const models = Array.from(new Set(messages.map((m: any) => m.model).filter(Boolean)))

      // Sort messages by created_at descending to find the last activity
      const sortedMessages = [...messages].sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      const lastActivity = sortedMessages[0]?.created_at || session.created_at
      const lastUserQuery = sortedMessages.find((m: any) => m.user_query)?.user_query || ""

      return {
        id: session.id,
        created_at: session.created_at,
        updated_at: session.updated_at,
        message_count: messageCount,
        last_activity: lastActivity,
        last_user_query: lastUserQuery,
        models,
        chat_messages: messages, // Include the messages for detail usage if needed, or keeping it compact
      }
    })

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error: any) {
    console.error("[GET /api/admin/sessions] Unhandled error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
