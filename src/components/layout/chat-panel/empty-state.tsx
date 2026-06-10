"use client"

import { m, type Variants } from "framer-motion"
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

// ─── Animation Variants ──────────────────────────────────────────────────────
//
// Single orchestration tree: the root container controls ALL staggering.
// Avoids 7 independent timers firing in parallel with competing delays.
//
// Principles applied (emilkowal-animations):
//  • polish-stagger-children   — one parent, staggered children
//  • ease-spring-natural       — spring for elements entering the stage
//  • timing-300ms-max          — UI animations ≤ 300ms; only the marquee reveal
//                                is 350ms because it's a large layout reveal
//  • transform-never-scale-zero — icon enters from scale(0.85), never 0
//  • strategy-purpose-required — removed redundant wrapper m.div around cards

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // Drive the whole sequence from this single stagger cascade
      staggerChildren: 0.12,
      delayChildren: 0,
    },
  },
}

// Icon orb — spring enter from slightly below + scale
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    // Spring feels organic for circular icons (ease-spring-natural)
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
}

// Heading — fast ease-out slide up (timing-300ms-max)
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] }, // strong ease-out
  },
}

// Description — pure fade, no movement (it's secondary content)
const descriptionVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
}

// Cards marquee — slides up from a subtle offset; slightly longer because
// the content is wide and needs to feel like a "reveal" (350ms is acceptable
// for a marketing-style entrance, per strategy-marketing-exception)
const cardsVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
  },
}

// ─────────────────────────────────────────────────────────────────────────────

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

    // Fisher-Yates shuffle for truly random ordering on every mount
    const shuffled = [...mapped]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShuffledSuggestions(shuffled)
  }, [t])

  const aiWordsDesktop = t("title_explore_ai")
    .split(" ")
    .map((w) => ({
      text: w,
      className:
        "bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent drop-shadow-sm",
    }))

  return (
    // Root orchestrator — a single "show" cascade fans out to all children
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col items-center justify-center gap-y-8 overflow-x-hidden lg:gap-y-12"
    >
      {/* ── Hero Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6 text-center lg:gap-8">
        {/* Icon orb */}
        <m.div
          variants={iconVariants}
          className="relative flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary ring-1 ring-primary/10 md:size-14"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent" />
          <Sparkles className="size-6 md:size-7" strokeWidth={1.5} />
        </m.div>

        <div className="max-w-4xl space-y-6">
          {/* Heading */}
          <m.h2
            variants={headingVariants}
            className="text-3xl leading-[1.2] font-extrabold tracking-tight text-foreground sm:text-4xl sm:leading-[1.2]"
          >
            <span className="block bg-linear-to-br from-foreground via-foreground/75 to-primary/10 bg-clip-text text-center text-transparent drop-shadow-sm sm:hidden">
              {t("title_ai")}
            </span>
            <span className="hidden sm:inline">{t("title_explore")} </span>
            <span className="mt-2 hidden sm:mt-0 sm:inline-block">
              <TypewriterEffect
                words={aiWordsDesktop}
                className="text-left text-3xl font-extrabold tracking-tight lg:text-4xl"
              />
            </span>
          </m.h2>

          {/* Description */}
          <m.p variants={descriptionVariants} className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            <span className="sm:hidden">{t("description_mobile")}</span>
            <span className="hidden sm:inline">{t("description_desktop")}</span>
          </m.p>
        </div>
      </div>

      {/* ── Quick Actions (Marquee) ─────────────────────────────────────── */}
      {shuffledSuggestions.length > 0 && (
        <m.div variants={cardsVariants} className="w-full overflow-hidden py-4">
          <InfiniteMovingCards items={shuffledSuggestions} direction="left" speed="slow" onItemClick={setInput} />
        </m.div>
      )}
    </m.div>
  )
}
