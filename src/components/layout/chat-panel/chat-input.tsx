"use client"

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
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
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/ai/models"
import { useTypingEffect } from "@/hooks/use-typing-effect"
import { useTranslations } from "next-intl"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"

export type ChatInputHandle = {
  setInput: (value: string) => void
}

type ChatHelpers = UseChatHelpers<UIMessage>

type Props = {
  sendMessage: ChatHelpers["sendMessage"]
  status: ChatHelpers["status"]
  isChatStarted: boolean
}

export const ChatInput = forwardRef<ChatInputHandle, Props>(function ChatInput(
  { sendMessage, status, isChatStarted },
  ref
) {
  const tMessages = useTranslations("chat.messages")
  const tActions = useTranslations("chat.actions")
  const tChat = useTranslations("chat")

  const placeholders = tChat.raw("placeholders") as string[]

  const [input, setInput] = useState("")
  const [model, setModel] = useState(DEFAULT_MODEL)

  const currentPlaceholder = useTypingEffect(placeholders, {
    typingSpeed: 30,
    deletingSpeed: 15,
    pauseBeforeType: 250,
    enabled: !isChatStarted,
  })

  const isLoading = status === "submitted" || status === "streaming"

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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
        },
      }
    )
  }

  useEffect(() => {
    if (isDesktop) {
      const timer = setTimeout(() => {
        const textarea = textareaRef.current
        if (textarea) textarea.focus({ preventScroll: true })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isDesktop])

  useImperativeHandle(ref, () => ({
    setInput: (value: string) => {
      setInput(value)
      if (textareaRef.current) {
        textareaRef.current.focus()
        // Wait a microtask to make sure the value is updated so we can set cursor position
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = value.length
          }
        }, 0)
      }
    },
  }))

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4 md:pb-8">
      <PromptInput
        onSubmit={handleSubmit}
        inputGroupClassName="bg-card border border-border/50 shadow-sm lg:shadow-[0_0_38px_0] shadow-foreground/5 transition-shadow hover:shadow-foreground/10 pt-4 rounded-2xl"
      >
        <PromptInputBody>
          <PromptInputTextarea
            ref={textareaRef}
            className="min-h-12 px-4 py-0 lg:min-h-10 lg:text-base"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder={isChatStarted ? tMessages("input_placeholder_active") : currentPlaceholder}
            name="message"
          />
        </PromptInputBody>
        <PromptInputFooter className="flex items-center justify-between px-3 pt-2 pb-3 md:px-4">
          <PromptInputTools className="pr-2">
            <PromptInputSelect onValueChange={(value) => setModel(value)} value={model}>
              <PromptInputSelectTrigger
                aria-label={tActions("select_model")}
                className="h-8 max-w-40 rounded-full bg-accent text-xs font-medium text-muted-foreground transition-colors md:max-w-xs dark:bg-accent/50"
              >
                <PromptInputSelectValue className="truncate" />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent className="bg-background/75" position="popper" side="top">
                {AVAILABLE_MODELS.map((m) => (
                  <PromptInputSelectItem key={m.id} value={m.id}>
                    {m.name}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={(!input.trim() && !isLoading) || status === "submitted"}
            status={status}
            className="ml-2 size-9 shrink-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none md:size-10 md:p-2.5"
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  )
})

export default React.memo(ChatInput)
