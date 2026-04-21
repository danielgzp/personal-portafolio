"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
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
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { GlobeIcon, Sparkles as SparklesIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useTypingEffect } from "@/hooks/use-typing-effect"
import { ChatMessage, ChatMessageThinking } from "./chat-message"
import { EmptyState } from "./empty-state"
import { ScrollArea } from "@/components/ui/scroll-area"

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

export function ChatArea() {
  const [input, setInput] = useState("")
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [model, setModel] = useState("gemini-3-flash-preview")

  const currentPlaceholder = useTypingEffect(PLACEHOLDERS)

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
    <div className="relative flex size-full h-full w-full flex-col bg-background/50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary),0.15),transparent)]" />
      {/* Header separador en móvil */}
      <div className="mb-4 flex h-12 flex-shrink-0 items-center justify-center border-b md:hidden">
        <h1 className="text-sm font-semibold text-foreground">AI Tech Lead</h1>
      </div>

      <Conversation className="mx-auto h-full max-w-5xl flex-1 px-4 md:px-8">
        {messages.length === 0 ? (
          <ConversationEmptyState>
            <EmptyState setInput={setInput} />
          </ConversationEmptyState>
        ) : (
          <ConversationContent>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && <ChatMessageThinking />}
          </ConversationContent>
        )}
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-4xl px-4 pt-4 pb-8 md:px-8">
        <PromptInput
          onSubmit={handleSubmit}
          globalDrop
          multiple
          inputGroupClassName="bg-card border border-border/50 shadow-[0_0_2rem_0] shadow-foreground/5 transition-shadow hover:shadow-foreground/10 pt-4"
        >
          <PromptInputBody>
            <PromptInputTextarea
              className="min-h-10 px-5 py-0 text-foreground md:text-base"
              onChange={handleInputChange}
              value={input}
              placeholder={currentPlaceholder}
              autoFocus
            />
          </PromptInputBody>
          <PromptInputFooter className="px-5 pt-2 pb-4">
            <PromptInputTools>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value)
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <SparklesIcon className="mr-1.5 size-3.5" />
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent className="p-1">
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
              className="shrink-0 rounded-full p-2 transition-colors"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
