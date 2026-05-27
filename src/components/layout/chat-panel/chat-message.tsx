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
import { LoaderFive } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import type { ReasoningUIPart, SourceUrlUIPart, TextUIPart, UIMessage } from "ai"
import { m } from "framer-motion"
import { useTranslations } from "next-intl"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useMemo, useState } from "react"

interface ChatMessageProps {
  message: UIMessage
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const t = useTranslations("chat.actions")
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
    <m.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("relative flex w-full items-start", isUser ? "ml-auto flex-row-reverse" : "mb-2 flex-row")}
    >
      <Message from={message.role}>
        <MessageContent className="backdrop-blur-2xl backdrop-saturate-150 group-[.is-assistant]:bg-card/50">
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
            <div className="prose-chat">{textContent}</div>
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
              label={t("copy_response")}
              onClick={handleCopy}
              tooltip={t("copy_response")}
              className="size-8 rounded-full bg-accent hover:bg-accent/80"
            >
              <div className="relative flex items-center justify-center">
                <CheckIcon
                  className={cn(
                    "absolute size-3.5 text-green-500 transition-all duration-300",
                    isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                />
                <CopyIcon
                  className={cn(
                    "size-3.5 transition-all duration-300",
                    isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                  )}
                />
              </div>
            </MessageAction>
          </MessageActions>
        )}
      </Message>
    </m.div>
  )
}

export function ChatMessageThinking() {
  const t = useTranslations("chat.messages")

  return (
    <m.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-4 flex w-full flex-row items-start gap-2"
    >
      <Message from="assistant" className="w-fit max-w-[85%] sm:max-w-[75%] md:max-w-full">
        <MessageContent className="flex min-h-9 w-fit min-w-16 items-center justify-center rounded-xl! border bg-card/50 px-4 py-0 text-foreground shadow-sm lg:min-h-10 lg:px-5">
          {/* <div className="flex h-full items-center space-x-1.5">
            <m.div
              className="size-1.5 rounded-full bg-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <m.div
              className="size-1.5 rounded-full bg-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
            />
            <m.div
              className="size-1.5 rounded-full bg-foreground/40"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            />
          </div> */}
          {/* <LoaderOne /> */}
          <LoaderFive text={t("thinking")} />
        </MessageContent>
      </Message>
    </m.div>
  )
}
