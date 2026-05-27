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
import { useRef, useCallback } from "react"
import { ChatMessage, ChatMessageThinking } from "./chat-message"
import { EmptyState } from "./empty-state"
import ChatInput, { ChatInputHandle } from "./chat-input"
import { cn } from "@/lib/utils"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

// const COMMANDS = [
//   { command: "/skills", description: "Lista de tecnologías" },
//   { command: "/experiencia", description: "Trayectoria profesional" },
//   { command: "/contacto", description: "Cómo contactar" },
//   { command: "/clear", description: "Limpiar conversación" },
// ]

export function ChatPanel() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err) => {
      console.error("[ChatPanel] useChat error:", err)
    },
  })

  const isChatStarted = messages.length > 0

  const isLoading = status === "submitted" || status === "streaming"

  const chatInputRef = useRef<ChatInputHandle | null>(null)
  const setInputFromRef = useCallback((v: string) => chatInputRef.current?.setInput(v), [])

  return (
    <section className="relative z-10 flex size-full flex-col overflow-hidden bg-transparent">
      {/* <BackgroundGradientAnimation containerClassName="absolute inset-0 -z-10" /> */}
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
      <ChatInput ref={chatInputRef} sendMessage={sendMessage} status={status} isChatStarted={isChatStarted} />
    </section>
  )
}
