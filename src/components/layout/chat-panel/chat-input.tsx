"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useRef } from "react";
import { Textarea } from "../../ui/textarea";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  console.log("input", input);
  const submitRef = useRef<HTMLButtonElement>(null);
  
  // Submit con Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && submitRef.current) {
        submitRef.current.click();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring border rounded-xl"
    >
      <Textarea
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Pregúntale a la IA sobre Daniel..."
        className="min-h-[60px] w-full resize-none bg-transparent placeholder:text-muted-foreground focus-visible:ring-0! focus-visible:border-inherit  text-sm sm:leading-6"
        spellCheck={false}
        rows={1}
      />
      <div className="flex items-center justify-between px-3 py-2 bg-muted/40">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="hidden sm:inline">Presiona</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">↵</span> Enter
          </kbd>
          <span className="hidden sm:inline">para enviar</span>
        </p>

        <Button 
          ref={submitRef}
          type="submit" 
          size="sm" 
          className="h-8 gap-1.5" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Enviar
          </span>
        </Button>
      </div>
    </form>
  );
}
