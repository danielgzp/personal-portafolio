"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Cpu, Clock, Coins, Database, User, Bot, ArrowLeft, AlertCircle, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

import { Session } from "./types"

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
    return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
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
              <h1 className="text-xl font-bold tracking-tight text-foreground">Detalle de la Conversación</h1>
              <p className="font-mono text-xs text-muted-foreground">ID: {session.id}</p>
            </div>
          </div>
          <div className="text-left font-mono text-xs text-muted-foreground sm:text-right">
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
                <span className="font-mono text-xs font-semibold text-muted-foreground/80">
                  # {index + 1} — {formatDate(message.created_at)}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {message.model && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-[10px]">
                      <Sparkles className="size-3" />
                      {formatModelName(message.model)}
                    </Badge>
                  )}
                  {message.generation_time_ms !== null && (
                    <Badge variant="outline" className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="size-3" />
                      {(message.generation_time_ms / 1000).toFixed(2)} s
                    </Badge>
                  )}
                  {(message.prompt_tokens !== null || message.completion_tokens !== null) && (
                    <Badge variant="outline" className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Coins className="size-3" />
                      Tokens: {(message.prompt_tokens || 0) + (message.completion_tokens || 0)}
                    </Badge>
                  )}
                  {message.rag_context_used && (
                    <Badge
                      variant="outline"
                      className="dark:text-emerald-450 flex items-center gap-1 border border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600 dark:bg-emerald-500/20"
                    >
                      <Database className="size-3" />
                      RAG Activo
                    </Badge>
                  )}
                </div>
              </div>

              {/* User Query Block */}
              {message.user_query && (
                <div className="flex justify-end pl-12">
                  <div className="flex max-w-3xl items-start gap-3">
                    <div className="rounded-2xl rounded-tr-sm border border-primary/20 bg-primary px-4 py-3 text-sm text-primary-foreground shadow-xs">
                      {message.user_query}
                    </div>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="size-4.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message if any */}
              {message.error_message && (
                <div className="flex justify-start pr-12">
                  <div className="flex max-w-3xl items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <AlertCircle className="size-4.5" />
                    </div>
                    <Card className="border-destructive/30 bg-destructive/5">
                      <CardContent className="px-4 py-3 font-mono text-xs text-destructive">
                        Error: {message.error_message}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* AI Response Block */}
              {message.ai_response && (
                <div className="flex justify-start pr-12">
                  <div className="flex max-w-3xl items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="size-4.5" />
                    </div>
                    <div className="prose-xs prose max-w-none rounded-2xl border border-border/50 bg-card/50 px-4 py-3 text-sm text-foreground shadow-xs backdrop-blur-xs dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.ai_response}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <Card className="border border-border/40 bg-card/20 shadow-xs">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Esta sesión de chat no tiene mensajes registrados.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export function SessionDetailSheet({
  session,
  isOpen,
  onOpenChange,
}: {
  session: Session | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col border-l border-border bg-background/95 p-0 shadow-2xl backdrop-blur-xl data-[side=right]:sm:max-w-2xl data-[side=right]:md:max-w-3xl data-[side=right]:lg:max-w-4xl data-[side=right]:xl:max-w-[50vw]"
      >
        {session && (
          <div className="flex h-full flex-col overflow-hidden">
            <SheetHeader className="border-b border-border/50 bg-muted/20 p-6">
              <div className="space-y-2">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                  <span className="rounded-lg bg-muted p-1.5 text-muted-foreground">
                    <Calendar className="size-4" />
                  </span>
                  Detalle del Chat
                </SheetTitle>
                <SheetDescription className="font-mono text-xs break-all text-muted-foreground select-all">
                  ID Sesión: {session.id}
                </SheetDescription>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <SessionDetail session={session} hideHeader={true} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
