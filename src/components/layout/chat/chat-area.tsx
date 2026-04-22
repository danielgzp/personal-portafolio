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
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { NoiseBackground } from "@/components/ui/noise-background"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { LeftPanel } from "../left-panel"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"

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

  const currentPlaceholder = useTypingEffect(PLACEHOLDERS)
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
    <div className="relative flex size-full flex-col overflow-hidden bg-background/40">
      {/* Refined Mobile Header with Drawer - Minimalist & Sober */}
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <Avatar className="size-10 border border-border/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <AvatarImage src="/avatar-placeholder.jpg" />
            <AvatarFallback className="bg-muted text-[10px] font-medium">DG</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-base leading-tight font-semibold tracking-tight text-foreground">
              Daniel González
            </span>
            <span className="text-xs font-medium text-muted-foreground">Frontend Engineer</span>
          </div>
        </div>
        <div className="gap-2\1 -mr-2 flex flex-row items-center">
          <ThemeSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="size-5 text-muted-foreground" strokeWidth={2} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] p-0 sm:max-w-sm">
              <SheetTitle className="sr-only">Resumen</SheetTitle>
              <LeftPanel />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <DottedGlowBackground
        className="-z-10"
        opacity={0.35}
        gap={34}
        radius={0.9}
        colorLightVar="--muted-foreground"
        colorDarkVar="--muted-foreground"
        glowColorLightVar="--primary"
        glowColorDarkVar="--primary"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(var(--primary),0.08),transparent)]" />

      <Conversation className="relative mx-auto size-full max-w-5xl">
        {messages.length === 0 ? (
          <ConversationEmptyState className="size-auto p-4">
            <EmptyState setInput={setInput} />
          </ConversationEmptyState>
        ) : (
          <ScrollArea className="p-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && <ChatMessageThinking />}
          </ScrollArea>
        )}
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto mt-auto w-full max-w-3xl px-4 pt-2 pb-6 md:pb-8">
        <PromptInput
          onSubmit={handleSubmit}
          globalDrop
          multiple
          inputGroupClassName="bg-card border border-border/50 shadow-[0_0_2rem_0] shadow-primary/5 transition-shadow hover:shadow-primary/10 pt-4"
        >
          <PromptInputBody>
            <PromptInputTextarea
              className="min-h-12 px-4 py-0 text-base lg:min-h-10"
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
    </div>
  )
}
