"use client";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ReasoningUIPart, SourceUrlUIPart, TextUIPart, UIMessage } from "ai";
import { motion } from "framer-motion";
import { BotIcon, CheckIcon, CopyIcon, UserIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Streamdown } from "streamdown";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);

  const textContent = useMemo(() => {
    const textParts = message.parts.filter(
      (part): part is TextUIPart => part.type === "text"
    );

    const textFromParts = textParts.map((part) => part.text).join("\n").trim();
    if (textFromParts) return textFromParts;

    // Backward compatibility if message came in old shape.
    const legacyContent = (message as { content?: string }).content;
    return legacyContent ?? "";
  }, [message]);

  const reasoningParts = useMemo(
    () =>
      message.parts.filter(
        (part): part is ReasoningUIPart => part.type === "reasoning"
      ),
    [message]
  );

  const reasoningText = reasoningParts.map((part) => part.text).join("\n\n").trim();
  const reasoningStreaming = reasoningParts.some((part) => part.state === "streaming");

  const sourceUrlParts = useMemo(
    () =>
      message.parts.filter(
        (part): part is SourceUrlUIPart => part.type === "source-url"
      ),
    [message]
  );

  const handleCopy = async () => {
    if (!textContent) return;

    await navigator.clipboard.writeText(textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "w-full flex items-start gap-4 mb-6", 
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "size-8 shrink-0 border shadow-sm mt-1",
        isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground border-primary"
      )}>
        {isUser ? <UserIcon className="size-4" /> : <BotIcon className="size-4" />}
      </Avatar>

      <Message 
        from={message.role} 
        className={cn(
          "w-fit max-w-[85%] sm:max-w-[75%]", 
          !isUser && "md:max-w-[100%]"
        )}
      >
        <MessageContent
          className={cn(
            "px-4 py-3 shadow-sm text-[15px]",
            isUser
              ? "bg-blue-600 text-white rounded-2xl rounded-tr-[4px] w-fit"
              : "bg-card border border-border/40 text-foreground rounded-2xl rounded-tl-[4px] w-fit"
          )}
        >
          {!!sourceUrlParts.length && (
            <Sources>
              <SourcesTrigger count={sourceUrlParts.length} />
              <SourcesContent>
                {sourceUrlParts.map((source) => (
                  <Source
                    href={source.url}
                    key={source.sourceId}
                    title={source.title ?? source.url}
                  />
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
            <div className="whitespace-pre-wrap leading-relaxed break-words">
              {textContent}
            </div>
          ) : (
            <div className="leading-relaxed prose dark:prose-invert prose-slate prose-p:leading-relaxed prose-pre:p-0">
              <MessageResponse>{textContent}</MessageResponse>
            </div>
          )}
        </MessageContent>

        {!isUser && !!textContent && (
          <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100 flex justify-end mt-1">
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
  );
}

export function ChatMessageThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full flex items-start gap-4 mb-6 flex-row"
    >
      <Avatar className="size-8 shrink-0 border shadow-sm mt-1 bg-primary text-primary-foreground border-primary">
        <BotIcon className="size-4" />
      </Avatar>

      <Message from="assistant" className="w-fit max-w-[85%] sm:max-w-[75%] md:max-w-[100%]">
        <MessageContent className="px-5 py-4 shadow-sm bg-card border border-border/40 text-foreground rounded-2xl rounded-tl-[4px] w-fit min-h-[48px] min-w-[64px] flex items-center justify-center">
          <div className="flex space-x-1.5 items-center h-full">
            <motion.div
              className="size-1.5 bg-foreground/40 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="size-1.5 bg-foreground/40 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
            />
            <motion.div
              className="size-1.5 bg-foreground/40 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            />
          </div>
        </MessageContent>
      </Message>
    </motion.div>
  );
}
