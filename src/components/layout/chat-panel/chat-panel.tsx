"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useRef, useCallback, useState, useEffect } from "react"
import { ChatMessage, ChatMessageThinking } from "./chat-message"
import { EmptyState } from "./empty-state"
import ChatInput, { ChatInputHandle } from "./chat-input"
import { cn } from "@/lib/utils"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, X } from "lucide-react"

/**
 * Known error codes returned by our API.
 * These map directly to the i18n keys under "chat.errors".
 */
type ChatErrorCode = "rate_limit" | "token_limit" | "auth_error" | "service_unavailable" | "generic"

/**
 * Try to extract a structured error code from the useChat error.
 *
 * When the API returns a JSON body like { error: "rate_limit", message: "..." },
 * the useChat hook wraps it in an Error object. The message might contain
 * the raw JSON or just the status text. We try to parse it and fall back
 * to "generic" if we can't determine the specific error type.
 */
function parseErrorCode(error: Error): ChatErrorCode {
  const msg = error.message || ""

  // The error message from useChat may contain the JSON body directly
  try {
    const parsed = JSON.parse(msg)
    if (parsed?.error && typeof parsed.error === "string") {
      return parsed.error as ChatErrorCode
    }
  } catch {
    // Not JSON — check for known patterns in the message text
  }

  // Fallback: check for HTTP status codes or known keywords
  if (msg.includes("429") || msg.toLowerCase().includes("rate")) return "rate_limit"
  if (msg.includes("token") || msg.includes("context")) return "token_limit"
  if (msg.includes("401") || msg.includes("403")) return "auth_error"
  if (msg.includes("503") || msg.includes("502")) return "service_unavailable"

  return "generic"
}

// const COMMANDS = [
//   { command: "/skills", description: "Lista de tecnologías" },
//   { command: "/experiencia", description: "Trayectoria profesional" },
//   { command: "/contacto", description: "Cómo contactar" },
//   { command: "/clear", description: "Limpiar conversación" },
// ]

export function ChatPanel() {
  const tErrors = useTranslations("chat.errors")
  const tActions = useTranslations("chat.actions")

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err) => {
      console.error("[ChatPanel] useChat error:", err)
    },
  })

  // Track whether the user has dismissed the current error banner.
  // Resets automatically when a new (different) error occurs.
  const [dismissedError, setDismissedError] = useState<Error | null>(null)
  const showError = error && error !== dismissedError

  const isChatStarted = messages.length > 0

  const isLoading = status === "submitted" || status === "streaming"

  const chatInputRef = useRef<ChatInputHandle | null>(null)
  const setInputFromRef = useCallback((v: string) => chatInputRef.current?.setInput(v), [])

  // Derive the translated error message from the error code
  const errorMessage = error ? tErrors(parseErrorCode(error)) : null

  return (
    <section className="relative z-10 flex size-full flex-col overflow-hidden bg-transparent">
      <BackgroundGradientAnimation containerClassName="absolute inset-0 -z-10" />
      {/* <DottedGlowBackground
        className="-z-10"
        opacity={0.35}
        gap={50}
        radius={0.9}
        colorLightVar="--foreground"
        colorDarkVar="--foreground"
        glowColorLightVar="--primary"
        glowColorDarkVar="--primary"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(var(--primary),0.08),transparent)]" /> */}
      {/* <div
        id="chat-scroll-container"
        className="flex-1 overflow-y-auto mask-[linear-gradient(to_bottom,black_80%,transparent)] pt-14 pb-4 lg:pt-4"
      > */}
      <Conversation>
        <ConversationContent
          scrollClassName="mask-b-from-95% mask-b-to-100%"
          className={cn("mx-auto w-full max-w-5xl px-2 pt-18 lg:px-4 lg:pt-4", { "h-full": messages.length === 0 })}
        >
          {messages.length === 0 ? (
            <ConversationEmptyState className="p-0">
              <EmptyState setInput={setInputFromRef} />
            </ConversationEmptyState>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  // Mark the last assistant message as actively streaming
                  // so Streamdown's isAnimating and caret are properly activated
                  isStreaming={isLoading && idx === messages.length - 1 && msg.role === "assistant"}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && <ChatMessageThinking />}
            </div>
          )}
          {messages.length > 0 && <div className="h-0.5 shrink-0" aria-hidden="true" />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Error banner — slides in above the input when an API error occurs */}
      <AnimatePresence>
        {showError && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive backdrop-blur-sm"
            role="alert"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button
              onClick={() => setDismissedError(error)}
              className="shrink-0 rounded-md p-1 transition-colors hover:bg-destructive/20"
              aria-label={tActions("dismiss")}
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatInput ref={chatInputRef} sendMessage={sendMessage} status={status} isChatStarted={isChatStarted} />
    </section>
  )
}

