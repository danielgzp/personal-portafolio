import { createClient } from "@/lib/supabase/server"
import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const client = await createClient()
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const { data: session, error: dbError } = await supabase
      .from("chat_sessions")
      .select(`
        id,
        created_at,
        updated_at,
        chat_messages (
          id,
          model,
          user_query,
          ai_response,
          rag_context_used,
          prompt_tokens,
          completion_tokens,
          generation_time_ms,
          error_message,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (dbError) {
      console.error(`[GET /api/admin/sessions/${id}] Database error:`, dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Sort messages chronologically
    if (session.chat_messages) {
      session.chat_messages.sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }

    return NextResponse.json({ session })
  } catch (error: any) {
    console.error(`[GET /api/admin/sessions] Unhandled error:`, error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const client = await createClient()
    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const { error: dbError } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", id)

    if (dbError) {
      console.error(`[DELETE /api/admin/sessions/${id}] Database error:`, dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`[DELETE /api/admin/sessions] Unhandled error:`, error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
