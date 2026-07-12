import { createClient } from "@/lib/supabase/server"
import { supabase } from "@/lib/supabase"
import { redirect, notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { SessionDetail } from "@/components/admin/session-detail"
import { AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminSessionDetailPage({ params }: PageProps) {
  // 1. Authenticate user server-side
  const client = await createClient()
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser()

  if (authError || !user) {
    redirect("/d4sh-ctrl/login")
  }

  const { id } = await params

  // 2. Fetch session and its messages
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

  // 3. Handle database error
  if (dbError) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200/50 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <h2 className="font-semibold">Error al cargar la sesión</h2>
              <p className="text-sm mt-0.5">{dbError.message}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    notFound()
  }

  // 4. Sort messages chronologically
  if (session.chat_messages) {
    session.chat_messages.sort(
      (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <SessionDetail session={session} />
      </main>
    </div>
  )
}
