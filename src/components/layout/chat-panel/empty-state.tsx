"use client"

import { m } from "framer-motion"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import {
  Briefcase,
  Boxes,
  Code2,
  User,
  Bot,
  Rocket,
  Palette,
  GitFork,
  TrendingUp,
  Lightbulb,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react"

const getIconForHeading = (heading: string) => {
  const h = heading.toLowerCase()
  if (h.includes("experience") || h.includes("experiencia")) return <Briefcase />
  if (h.includes("architecture") || h.includes("arquitectura")) return <Boxes />
  if (h.includes("tech")) return <Code2 />
  if (h.includes("summary") || h.includes("resumen")) return <User />
  if (h.includes("ai") || h.includes("ia") || h.includes("integración")) return <Bot />
  if (h.includes("project") || h.includes("proyecto")) return <Rocket />
  if (h.includes("design")) return <Palette />
  if (h.includes("state") || h.includes("estado")) return <GitFork />
  if (h.includes("scale") || h.includes("escala")) return <TrendingUp />
  if (h.includes("vision") || h.includes("visión")) return <Lightbulb />
  if (h.includes("leader") || h.includes("lider")) return <Shield />
  if (h.includes("challenge") || h.includes("reto")) return <Zap />
  return <Sparkles />
}

interface EmptyStateProps {
  setInput: (input: string) => void
}

export function EmptyState({ setInput }: EmptyStateProps) {
  const t = useTranslations("chat.empty_state")

  const [shuffledSuggestions, setShuffledSuggestions] = useState<
    Array<{ heading: string; message: string; icon: React.ReactNode }>
  >([])

  useEffect(() => {
    const rawSuggestions = t.raw("suggestions") as { heading: string; message: string }[]
    const mapped = rawSuggestions.map((item) => ({
      ...item,
      icon: getIconForHeading(item.heading),
    }))

    // Mezcla aleatoria usando Fisher-Yates para asegurar índices verdaderamente aleatorios
    const shuffled = [...mapped]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    const timeout = setTimeout(() => {
      setShuffledSuggestions(shuffled)
    }, 0)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.5, // Retrasamos su entrada un poco
      },
    },
  }

  const aiWords = t("title_explore_ai")
    .split(" ")
    .map((w) => ({
      text: w,
      className:
        "bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent drop-shadow-sm",
    }))

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-8 overflow-x-hidden lg:gap-y-12">
      {/* Hero Header */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-col items-center gap-6 text-center lg:gap-8"
      >
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary ring-1 ring-primary/10 md:size-14"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent" />
          <Sparkles className="size-6 md:size-7" strokeWidth={1.5} />
        </m.div>

        <div className="max-w-4xl space-y-6">
          <m.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-3xl font-bold tracking-wide text-foreground sm:text-4xl md:text-5xl`}
          >
            <span className="sm:hidden">{t("title_ai")} </span>
            <span className="hidden sm:inline">{t("title_explore")} </span>
            <span className="mt-2 inline-block sm:mt-0">
              <TypewriterEffect words={aiWords} className="text-left" />
            </span>
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            <span className="sm:hidden">{t("description_mobile")}</span>
            <span className="hidden sm:inline">{t("description_desktop")}</span>
          </m.p>
        </div>
      </m.div>

      {/* Quick Actions (Marquees) */}
      <m.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-4 overflow-hidden py-4"
      >
        <m.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 100, damping: 20 },
            },
          }}
          className="w-full"
        >
          {shuffledSuggestions.length > 0 && (
            <InfiniteMovingCards items={shuffledSuggestions} direction="left" speed="slow" onItemClick={setInput} />
          )}
        </m.div>
      </m.div>
    </div>
  )
}
