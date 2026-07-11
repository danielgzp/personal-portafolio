"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Cpu,
  Clock,
  Coins,
  Database,
  User,
  Bot,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Message = {
  id: number
  model: string | null
  user_query: string | null
  ai_response: string | null
  rag_context_used: boolean | null
  prompt_tokens: number | null
  completion_tokens: number | null
  generation_time_ms: number | null
  error_message: string | null
  created_at: string
}

type Session = {
  id: string
  created_at: string
  updated_at: string
  chat_messages?: Message[]
}

interface SessionDetailProps {
  session: Session
  hideHeader?: boolean
}

export function SessionDetail({ session, hideHeader = false }: SessionDetailProps) {
  const messages = session.chat_messages || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatModelName = (modelId: string | null) => {
    if (!modelId) return "Unknown Model"
    const parts = modelId.split("/")
    const name = parts[parts.length - 1]
    return name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      {!hideHeader && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="size-9 cursor-pointer">
              <Link href="/d4sh-ctrl">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Detalle de la Conversación
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                ID: {session.id}
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-mono text-left sm:text-right">
            <div>Iniciado: {formatDate(session.created_at)}</div>
            <div>Última act: {formatDate(session.updated_at)}</div>
          </div>
        </div>
      )}
 
      {/* Conversation Thread */}
      <div className="space-y-8">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={message.id || index} className="space-y-3">
              {/* Interaction Index / Metadata Header */}
              <div className="flex items-center justify-between border-b border-border/35 pb-2">
                <span className="text-xs font-semibold text-muted-foreground/80 font-mono">
                  # {index + 1} — {formatDate(message.created_at)}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {message.model && (
                    <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                      <Cpu className="size-3" />
                      {formatModelName(message.model)}
                    </Badge>
                  )}
                  {message.generation_time_ms !== null && (
                    <Badge variant="outline" className="text-[10px] flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3" />
                      {message.generation_time_ms} ms
                    </Badge>
                  )}
                  {(message.prompt_tokens !== null || message.completion_tokens !== null) && (
                    <Badge variant="outline" className="text-[10px] flex items-center gap-1 text-muted-foreground">
                      <Coins className="size-3" />
                      Tokens: {(message.prompt_tokens || 0) + (message.completion_tokens || 0)}
                    </Badge>
                  )}
                  {message.rag_context_used && (
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-450 border border-emerald-500/20 flex items-center gap-1">
                      <Database className="size-3" />
                      RAG Activo
                    </Badge>
                  )}
                </div>
              </div>

              {/* User Query Block */}
              {message.user_query && (
                <div className="flex justify-end pl-12">
                  <div className="flex items-start gap-3 max-w-3xl">
                    <div className="rounded-2xl bg-muted/60 px-4 py-3 text-foreground/90 text-sm shadow-xs border border-border/20">
                      {message.user_query}
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <User className="size-4.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message if any */}
              {message.error_message && (
                <div className="flex justify-start pr-12">
                  <div className="flex items-start gap-3 max-w-3xl">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <AlertCircle className="size-4.5" />
                    </div>
                    <Card className="border-destructive/30 bg-destructive/5">
                      <CardContent className="px-4 py-3 text-destructive text-xs font-mono">
                        Error: {message.error_message}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* AI Response Block */}
              {message.ai_response && (
                <div className="flex justify-start pr-12">
                  <div className="flex items-start gap-3 max-w-3xl">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="size-4.5" />
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-card/50 px-4 py-3 text-foreground text-sm shadow-xs backdrop-blur-xs prose dark:prose-invert prose-xs max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.ai_response}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <Card className="border border-border/40 bg-card/20 shadow-xs">
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              Esta sesión de chat no tiene mensajes registrados.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
