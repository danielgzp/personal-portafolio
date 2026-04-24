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
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { useTypingEffect } from "@/hooks/use-typing-effect"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Sparkles as SparklesIcon } from "lucide-react"
import { useState } from "react"
import { ChatMessage, ChatMessageThinking } from "./chat-message"
import { EmptyState } from "./empty-state"

const COMMANDS = [
  { command: "/skills", description: "Lista de tecnologías" },
  { command: "/experiencia", description: "Trayectoria profesional" },
  { command: "/contacto", description: "Cómo contactar" },
  { command: "/clear", description: "Limpiar conversación" },
]

const PLACEHOLDERS = [
  "¿Qué quieres saber sobre mí o mis proyectos?",
  "Pregúntame sobre mi experiencia profesional...",
  "¿Qué tecnologías utilizas?",
  "Háblame de tu portafolio...",
  "Escribe un comando como /skills...",
]

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [model, setModel] = useState("gemini-3-flash-preview")

  const models = [
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  ]

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  })

  const currentPlaceholder = useTypingEffect(PLACEHOLDERS, {
    typingSpeed: 30,
    deletingSpeed: 15,
    pauseBeforeType: 250,
  })
  const isChatStarted = messages.length > 0

  const isLoading = status === "submitted" || status === "streaming"

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (message: PromptInputMessage, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const hasText = !!message.text.trim()
    const hasFiles = message.files.length > 0

    if (!hasText && !hasFiles) return

    setInput("")

    await sendMessage(
      {
        text: message.text,
        files: message.files,
      },
      {
        body: {
          model,
          useWebSearch,
        },
      }
    )
  }

  return (
    // <NoiseBackground
    //   containerClassName="h-full w-full rounded-none border-none shadow-none p-0"
    //   className="h-full w-full"
    //   noiseIntensity={0.02}
    //   speed={0.15}
    //   gradientColors={["var(--primary)", "var(--chart-2)", "var(--chart-3)"]}
    // >
    // <div className="relative flex size-full flex-col bg-background/40 backdrop-blur-3xl">
    <section className="relative z-10 flex size-full flex-col overflow-hidden bg-accent dark:bg-background">
      <DottedGlowBackground
        className="-z-10"
        opacity={0.35}
        gap={34}
        radius={0.9}
        colorLightVar="--foreground"
        colorDarkVar="--foreground"
        glowColorLightVar="--primary"
        glowColorDarkVar="--primary"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(var(--primary),0.08),transparent)]" />
      {/* <EmptyState setInput={setInput} /> */}
      {/* <ConversationEmptyState className="overflow-y-auto p-4">
        <EmptyState setInput={setInput} />
      </ConversationEmptyState> */}
      <div
        id="chat-scroll-container"
        className="flex-1 overflow-y-auto mask-[linear-gradient(to_bottom,black_80%,transparent)] pt-14 pb-4 lg:pt-4"
      >
        <Conversation className="mx-auto w-full max-w-3xl p-0">
          {messages.length === 0 ? (
            <ConversationEmptyState className="p-0">
              <EmptyState setInput={setInput} />
            </ConversationEmptyState>
          ) : (
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState className="p-0">
                  <EmptyState setInput={setInput} />
                </ConversationEmptyState>
              ) : (
                <ConversationContent className="p-0">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && <ChatMessageThinking />}
                </ConversationContent>
              )}
            </ConversationContent>
          )}
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pt-2 pb-4 md:pb-8">
        <PromptInput
          onSubmit={handleSubmit}
          globalDrop
          multiple
          inputGroupClassName="bg-card border border-border/50 shadow-sm lg:shadow-[0_0_30px_0] shadow-foreground/5 transition-shadow hover:shadow-foreground/10 pt-4"
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
            <PromptInputTools className="scrollbar-none flex-1 overflow-x-auto pr-2">
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value)
                }}
                value={model}
              >
                <PromptInputSelectTrigger className="h-8 max-w-[160px] truncate rounded-full border-none bg-accent/40 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:ring-0 md:max-w-xs">
                  <SparklesIcon className="mr-1.5 size-3.5 fill-primary/10 text-primary/70" />
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent className="min-w-[160px] rounded-2xl border border-border/40 bg-background/90 p-1.5 shadow-xl backdrop-blur-xl">
                  {models.map((model) => (
                    <PromptInputSelectItem
                      key={model.id}
                      value={model.id}
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:bg-primary/10 focus:text-primary"
                    >
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
