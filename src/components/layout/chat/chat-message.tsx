"use client"

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning"
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ReasoningUIPart, SourceUrlUIPart, TextUIPart, UIMessage } from "ai"
import { motion } from "framer-motion"
import { BotIcon, CheckIcon, CopyIcon, UserIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Streamdown } from "streamdown"

interface ChatMessageProps {
  message: UIMessage
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [isCopied, setIsCopied] = useState(false)

  const textContent = useMemo(() => {
    const textParts = message.parts.filter((part): part is TextUIPart => part.type === "text")

    const textFromParts = textParts
      .map((part) => part.text)
      .join("\n")
      .trim()
    if (textFromParts) return textFromParts

    // Backward compatibility if message came in old shape.
    const legacyContent = (message as { content?: string }).content
    return legacyContent ?? ""
  }, [message])

  const reasoningParts = useMemo(
    () => message.parts.filter((part): part is ReasoningUIPart => part.type === "reasoning"),
    [message]
  )

  const reasoningText = reasoningParts
    .map((part) => part.text)
    .join("\n\n")
    .trim()
  const reasoningStreaming = reasoningParts.some((part) => part.state === "streaming")

  const sourceUrlParts = useMemo(
    () => message.parts.filter((part): part is SourceUrlUIPart => part.type === "source-url"),
    [message]
  )

  const handleCopy = async () => {
    if (!textContent) return

    await navigator.clipboard.writeText(textContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full items-start gap-2 lg:max-w-[90%]",
        isUser ? "ml-auto flex-row-reverse" : "mb-2 flex-row"
      )}
    >
      <Avatar
        className={cn(
          "grop[.is-user]:bg-primary grop[.is-user]:text-primary-foreground hidden size-8 shrink-0 items-center justify-center shadow-sm lg:flex",
          isUser ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
        )}
      >
        {isUser ? <UserIcon className="size-4" /> : <BotIcon className="size-4" />}
      </Avatar>

      <Message from={message.role}>
        <MessageContent className="backdrop-blur-2xl group-[.is-assistant]:bg-card/50">
          {!!sourceUrlParts.length && (
            <Sources>
              <SourcesTrigger count={sourceUrlParts.length} />
              <SourcesContent>
                {sourceUrlParts.map((source) => (
                  <Source href={source.url} key={source.sourceId} title={source.title ?? source.url} />
                ))}
              </SourcesContent>
            </Sources>
          )}

          {!!reasoningText && (
            <Reasoning isStreaming={reasoningStreaming}>
              <ReasoningTrigger />
              <ReasoningContent>{reasoningText}</ReasoningContent>
            </Reasoning>
          )}

          {isUser ? (
            <div className="prose-chat text-foreground">{textContent}</div>
          ) : (
            <div className="prose leading-relaxed prose-slate dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
              <MessageResponse animated isAnimating={isStreaming}>
                {textContent}
              </MessageResponse>
            </div>
          )}
        </MessageContent>

        {!isUser && !!textContent && (
          <MessageActions className="flex justify-end">
            <MessageAction
              aria-label="Copiar respuesta"
              label="Copiar respuesta"
              onClick={handleCopy}
              tooltip="Copiar respuesta"
              className="size-7 rounded-full bg-accent hover:bg-accent/80"
            >
              {isCopied ? <CheckIcon className="size-3.5 text-green-500" /> : <CopyIcon className="size-3.5" />}
            </MessageAction>
          </MessageActions>
        )}
      </Message>
    </motion.div>
  )
}

export function ChatMessageThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-4 flex w-full flex-row items-start gap-2"
    >
      <Avatar className="size-8 shrink-0 items-center justify-center bg-card text-card-foreground shadow-sm">
        <BotIcon className="size-4" />
      </Avatar>

      <Message from="assistant" className="w-fit max-w-[85%] sm:max-w-[75%] md:max-w-[100%]">
        <MessageContent className="flex min-h-10 w-fit min-w-16 items-center justify-center rounded-tl-sm border bg-card px-4 text-foreground shadow-sm lg:min-h-11 lg:px-5">
          <div className="flex h-full items-center space-x-1.5">
            <motion.div
              className="size-1.5 rounded-full bg-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="size-1.5 rounded-full bg-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
            />
            <motion.div
              className="size-1.5 rounded-full bg-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            />
          </div>
        </MessageContent>
      </Message>
    </motion.div>
  )
}
