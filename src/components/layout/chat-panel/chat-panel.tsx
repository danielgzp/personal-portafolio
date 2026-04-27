"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { Button } from "@/components/ui/button"
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { useTypingEffect } from "@/hooks/use-typing-effect"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { AlertCircleIcon, RefreshCw, Sparkles as SparklesIcon, X } from "lucide-react"
import { useState } from "react"
import { ChatMessage, ChatMessageThinking } from "./chat-message"
import { EmptyState } from "./empty-state"
import { cn } from "@/lib/utils"

// const COMMANDS = [
//   { command: "/skills", description: "Lista de tecnologías" },
//   { command: "/experiencia", description: "Trayectoria profesional" },
//   { command: "/contacto", description: "Cómo contactar" },
//   { command: "/clear", description: "Limpiar conversación" },
// ]

const PLACEHOLDERS = [
  "¿Qué quieres saber sobre mí o mis proyectos?",
  "Pregúntame sobre mi experiencia profesional...",
  "¿Qué tecnologías utilizas?",
  "Háblame de tu portafolio...",
  "Escribe un comando como /skills...",
]

/** Maps structured error codes returned by the API to user-readable messages. */
function getErrorMessage(error: Error | undefined): string {
  if (!error) return ""

  // Try to parse the structured JSON error body sent by the route handler
  try {
    const parsed = JSON.parse(error.message)
    if (parsed?.message) return parsed.message
  } catch {
    // Not a JSON error body — fall through to generic messages below
  }

  const message = error.message.toLowerCase()

  if (message.includes("rate_limit") || message.includes("429")) {
    return "Has alcanzado el límite de solicitudes. Por favor, espera un momento e inténtalo de nuevo."
  }

  if (message.includes("token_limit") || message.includes("token") || message.includes("context length")) {
    return "La conversación es demasiado larga para este modelo. Intenta iniciar una nueva conversación o usa un modelo con mayor contexto."
  }

  if (message.includes("auth_error") || message.includes("401") || message.includes("403")) {
    return "Error de autenticación con el proveedor de IA."
  }

  if (message.includes("service_unavailable") || message.includes("503")) {
    return "El servicio de IA no está disponible en este momento. Inténtalo más tarde."
  }

  // Generic fallback
  return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
}

export function ChatPanel() {
  const [input, setInput] = useState("")
  // const [useWebSearch, setUseWebSearch] = useState(false)
  const [model, setModel] = useState("gemini-2.5-flash")
  const [isDismissed, setIsDismissed] = useState(false)

  const models = [
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    {
      id: "gemini-2.5-flash-lite",
      name: "Gemini 2.5 Flash Lite",
    },
  ]

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err) => {
      // Reset dismiss state so the new error is visible
      setIsDismissed(false)
      console.error("[ChatPanel] useChat error:", err)
    },
  })

  const currentPlaceholder = useTypingEffect(PLACEHOLDERS, {
    typingSpeed: 30,
    deletingSpeed: 15,
    pauseBeforeType: 250,
  })
  const isChatStarted = messages.length > 0

  const isLoading = status === "submitted" || status === "streaming"

  // Derive whether the error banner should be shown
  const hasError = !!error && !isDismissed

  const errorMessage = getErrorMessage(error)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (message: PromptInputMessage, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const hasText = !!message.text.trim()
    const hasFiles = message.files.length > 0

    if (!hasText && !hasFiles) return

    setInput("")
    setIsDismissed(false)

    await sendMessage(
      {
        text: message.text,
        files: message.files,
      },
      {
        body: {
          model,
          // useWebSearch,
        },
      }
    )
  }

  const handleRetry = () => {
    setIsDismissed(false)
    regenerate()
  }

  return (
    <section className="relative z-10 flex size-full flex-col overflow-hidden bg-accent dark:bg-background">
      <DottedGlowBackground
        className="-z-10"
        opacity={0.35}
        gap={50}
        radius={0.9}
        colorLightVar="--foreground"
        colorDarkVar="--foreground"
        glowColorLightVar="--primary"
        glowColorDarkVar="--primary"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(var(--primary),0.08),transparent)]" />

      {/* <div
        id="chat-scroll-container"
        className="flex-1 overflow-y-auto mask-[linear-gradient(to_bottom,black_80%,transparent)] pt-14 pb-4 lg:pt-4"
      > */}
      <Conversation className="">
        <ConversationContent
          scrollClassName="mask-b-from-95% mask-b-to-100%"
          className={cn("mx-auto w-full max-w-3xl px-2 pt-18 lg:px-4 lg:pt-4", { "h-full": messages.length === 0 })}
        >
          {messages.length === 0 ? (
            <ConversationEmptyState className="p-0">
              <EmptyState setInput={setInput} />
            </ConversationEmptyState>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                // Mark the last assistant message as actively streaming
                // so Streamdown's isAnimating and caret are properly activated
                isStreaming={isLoading && idx === messages.length - 1 && msg.role === "assistant"}
              />
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === "user" && <ChatMessageThinking />}
          {messages.length > 0 && <div className="h-0.5 shrink-0" aria-hidden="true" />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-4 pb-4 md:pb-8">
        {/* Error banner — shown when useChat surfaces an error */}
        {hasError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-3 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive backdrop-blur-sm"
          >
            <AlertCircleIcon className="size-4 shrink-0" />
            <p className="flex-1 leading-snug">{errorMessage}</p>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="destructive"
                onClick={handleRetry}
                title="Reintentar"
                aria-label="Reintentar la última solicitud"
              >
                <RefreshCw className="size-3" />
                Reintentar
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsDismissed(true)}
                title="Descartar error"
                aria-label="Descartar mensaje de error"
                size="icon-sm"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        <PromptInput
          onSubmit={handleSubmit}
          globalDrop
          multiple
          inputGroupClassName="bg-card border border-border/50 shadow-sm lg:shadow-[0_0_16px_0] shadow-foreground/5 transition-shadow hover:shadow-foreground/10 pt-4 rounded-2xl"
        >
          <PromptInputBody>
            <PromptInputTextarea
              className="min-h-12 px-4 py-0 lg:min-h-10 lg:text-base"
              onChange={handleInputChange}
              value={input}
              placeholder={isChatStarted ? "Pregúntame algo..." : currentPlaceholder}
              autoFocus
            />
          </PromptInputBody>
          <PromptInputFooter className="flex items-center justify-between px-3 pt-2 pb-3 md:px-4">
            <PromptInputTools className="pr-2">
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value)
                }}
                value={model}
              >
                <PromptInputSelectTrigger
                  aria-label="Select Model"
                  className="h-8 max-w-40 rounded-full bg-accent text-xs font-medium text-muted-foreground transition-colors md:max-w-xs dark:bg-accent/50"
                >
                  <SparklesIcon className="mr-1.5 size-3.5" />
                  <PromptInputSelectValue className="truncate" />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent className="bg-background/75">
                  {models.map((model) => (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={!input.trim() && !isLoading}
              status={status}
              className="ml-2 size-9 shrink-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none md:size-10 md:p-2.5"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </section>
  )
}
