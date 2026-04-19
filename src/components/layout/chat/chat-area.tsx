"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputButton,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from "@/components/ai-elements/prompt-input";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from "ai";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";
import { ChatMessage, ChatMessageThinking } from "./chat-message";
import { EmptyState } from "./empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatArea() {
  const [input, setInput] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [model, setModel] = useState("gemini-3-flash-preview");

  const models = [
    { id: "gemini-3-flash-preview", name: "Gemini 3 Flash" },
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" }
  ];

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }

  const handleSubmit = async (
    message: PromptInputMessage,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const hasText = !!message.text.trim();
    const hasFiles = message.files.length > 0;

    if (!hasText && !hasFiles) return;

    await sendMessage(
      {
        text: message.text,
        files: message.files
      },
      {
        body: {
          model,
          useWebSearch
        }
      }
    );
    setInput("");
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto py-6 px-4 md:px-8">
      {/* Header separador en móvil */}
      <div className="md:hidden h-12 flex flex-shrink-0 items-center justify-center border-b mb-4">
        <h1 className="font-semibold text-sm text-foreground">AI Tech Lead</h1>
      </div>

      
        <Conversation className="">
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <EmptyState setInput={setInput} />
            </ConversationEmptyState>
          ) : (
            <ConversationContent>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <ChatMessageThinking />
              )}
            </ConversationContent>
          )}
          <ConversationScrollButton />
        </Conversation>
      
      

      <div className="pt-4 mt-auto border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 w-full shrink-0">
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          globalDrop
          multiple
        >
          
          <PromptInputBody>
            <PromptInputTextarea
              onChange={handleInputChange}
              value={input}
              
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                tooltip={{ content: "Search the web", shortcut: "⌘K" }}
                variant={useWebSearch ? "default" : "ghost"}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((model) => (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input.trim() && !isLoading} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
