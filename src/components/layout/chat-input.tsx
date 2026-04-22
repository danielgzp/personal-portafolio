import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function ChatInput() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat() as any
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Smart Auto-scroll: Only scroll if the user is already near the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleQuickQuestion = (question: string) => {
    append({ role: "user", content: question })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="absolute bottom-0 left-0 w-full border-t border-border/40 bg-background/80 p-4 backdrop-blur-xl md:p-6">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm transition-all focus-within:border-primary/50 focus-within:bg-background hover:border-border/80"
        >
          <Input
            value={input || ""}
            onChange={handleInputChange}
            placeholder="Pregúntale algo a la IA de Daniel... (ej. /habilidades)"
            className="h-14 flex-1 border-0 bg-transparent px-5 text-sm shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            disabled={isLoading || !input?.trim()}
            size="icon"
            className="mr-2 size-10 rounded-xl bg-primary text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <Send className="size-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
        <div className="mt-2 text-center">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            AI Powered Portfolio
          </span>
        </div>
      </div>
    </div>
  )
}
