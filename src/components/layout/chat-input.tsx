import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';

export default function ChatInput() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat() as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Smart Auto-scroll: Only scroll if the user is already near the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleQuickQuestion = (question: string) => {
    append({ role: 'user', content: question });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-border/40 absolute bottom-0 w-full left-0">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center bg-muted/30 border border-border/50 hover:border-border/80 focus-within:border-primary/50 focus-within:bg-background transition-all rounded-2xl shadow-sm overflow-hidden"
          >
            <Input
              value={input || ''}
              onChange={handleInputChange}
              placeholder="Pregúntale algo a la IA de Daniel... (ej. /habilidades)"
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 h-14 px-5 text-sm"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input?.trim()}
              size="icon"
              className="mr-2 size-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              <Send className="size-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              AI Powered Portfolio
            </span>
          </div>
        </div>
      </div>
  )
}
