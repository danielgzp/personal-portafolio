import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, MessageCircle, Calendar, Cpu } from "lucide-react"

type Message = {
  id: number
  model: string | null
  created_at: string
  prompt_tokens: number | null
  completion_tokens: number | null
  generation_time_ms: number | null
}

type Session = {
  id: string
  created_at: string
  message_count: number
  models: string[]
  chat_messages?: Message[]
}

interface StatsCardsProps {
  sessions: Session[]
}

export function StatsCards({ sessions }: StatsCardsProps) {
  // 1. Total sessions
  const totalSessions = sessions.length

  // 2. Gather all messages across all sessions
  const allMessages = sessions.flatMap((s) => s.chat_messages || [])
  const totalMessages = allMessages.length

  // 3. Count messages created today
  const today = new Date().toDateString()
  const messagesToday = allMessages.filter((m) => {
    return new Date(m.created_at).toDateString() === today
  }).length

  // 4. Determine the top model used
  const modelCounts: Record<string, number> = {}
  let topModel = "N/A"
  let maxCount = 0

  allMessages.forEach((m) => {
    if (m.model) {
      modelCounts[m.model] = (modelCounts[m.model] || 0) + 1
      if (modelCounts[m.model] > maxCount) {
        maxCount = modelCounts[m.model]
        topModel = m.model
      }
    }
  })

  // Format model name for display (e.g. google/gemini-2.5-flash -> Gemini 2.5 Flash)
  const displayModelName = (modelId: string) => {
    if (modelId === "N/A") return "N/A"
    const parts = modelId.split("/")
    const name = parts[parts.length - 1]
    return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const statItems = [
    {
      title: "Total Sesiones",
      value: totalSessions,
      description: "Conversaciones iniciadas",
      icon: MessageSquare,
      colorClass: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Total Mensajes",
      value: totalMessages,
      description: "Mensajes intercambiados",
      icon: MessageCircle,
      colorClass: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Mensajes Hoy",
      value: messagesToday,
      description: "Interacciones en últimas 24h",
      icon: Calendar,
      colorClass: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Modelo Top",
      value: displayModelName(topModel),
      description: `${maxCount} consultas procesadas`,
      icon: Cpu,
      colorClass: "text-violet-500 bg-violet-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`rounded-xl p-2 ${stat.colorClass}`}>
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
