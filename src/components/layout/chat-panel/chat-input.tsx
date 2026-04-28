"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { useRef } from "react"
import { Textarea } from "../../ui/textarea"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const submitRef = useRef<HTMLButtonElement>(null)

  // Submit con Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading && submitRef.current) {
        submitRef.current.click()
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col overflow-hidden rounded-xl border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <Textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Pregúntale a la IA sobre Daniel..."
        className="min-h-[60px] w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:border-inherit focus-visible:ring-0! sm:leading-6"
        spellCheck={false}
        rows={1}
      />
      <div className="flex items-center justify-between bg-muted/40 px-3 py-2">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Presiona</span>
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
            <span className="text-xs">↵</span> Enter
          </kbd>
          <span className="hidden sm:inline">para enviar</span>
        </p>

        <Button ref={submitRef} type="submit" size="sm" className="h-8 gap-1.5" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Enviar</span>
        </Button>
      </div>
    </form>
  )
}
