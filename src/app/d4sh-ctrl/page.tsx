import { createClient } from "@/lib/supabase/server"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCards } from "@/components/admin/stats-cards"
import { SessionsTable } from "@/components/admin/sessions-table"
import { AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // 1. Authenticate user server-side
  const client = await createClient()
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser()

  if (authError || !user) {
    redirect("/d4sh-ctrl/login")
  }

  // 2. Fetch data directly from DB using service_role key to bypass RLS policies
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

  // 3. Handle database error if any
  if (dbError) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200/50 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <h2 className="font-semibold">Error al cargar datos</h2>
              <p className="text-sm mt-0.5">{dbError.message}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 4. Format sessions with aggregate statistics
  const formattedSessions = (sessions || []).map((session) => {
    const messages = session.chat_messages || []
    const messageCount = messages.length
    const models = Array.from(new Set(messages.map((m: any) => m.model).filter(Boolean)))

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
      chat_messages: messages,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Resumen General
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualiza y gestiona las sesiones de chat de tu portafolio.
          </p>
        </div>

        {/* Aggregate Stats Row */}
        <StatsCards sessions={formattedSessions} />

        {/* Sessions Interactive Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Sesiones de Chat
          </h2>
          <SessionsTable sessions={formattedSessions} />
        </div>
      </main>
    </div>
  )
}
