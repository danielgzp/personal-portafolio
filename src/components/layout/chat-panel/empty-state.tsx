"use client"

import { m, type Variants } from "framer-motion"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { BackgroundGradient } from "@/components/ui/background-gradient"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { EASE_PREMIUM } from "@/lib/animations"
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
      // Slightly slower stagger for a more sequential, elegant reveal
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

// Eyebrow badge — smooth blur + scale reveal
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_PREMIUM },
  },
}

// Heading — dramatic blur reveal
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
}

// Description — soft fade in with blur
const descriptionVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
}

// Cards marquee — slides up from a subtle offset with blur
const cardsVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_PREMIUM },
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

  return (
    // Root orchestrator — a single "show" cascade fans out to all children
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex w-full flex-col items-center justify-center gap-y-8 overflow-x-hidden py-8 lg:gap-y-12"
    >
      {/* ── Hero Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6 text-center lg:gap-8">
        {/* Eyebrow badge */}
        <m.div variants={iconVariants}>
          <BackgroundGradient
            containerClassName="rounded-full"
            className="inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-md"
          >
            <Sparkles className="size-4" />
            <span>{t("title_ai")}</span>
          </BackgroundGradient>
        </m.div>

        <div className="max-w-3xl space-y-5">
          {/* Heading */}
          <m.h2
            variants={headingVariants}
            className="text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            <span className="bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t("title_explore")}
            </span>{" "}
            <span className="relative inline-block">
              {/* Backlight / Aura effect */}
              <span
                className="absolute inset-0 animate-pulse bg-linear-to-br from-primary to-primary/50 bg-clip-text font-semibold text-transparent opacity-50 blur-md"
                aria-hidden="true"
              >
                {t("title_explore_ai")}
              </span>
              {/* Main text */}
              <span className="relative z-10 bg-linear-to-br from-primary via-primary/90 to-primary/50 bg-clip-text font-semibold text-transparent">
                {t("title_explore_ai")}
              </span>
            </span>
          </m.h2>

          {/* Description */}
          <m.p
            variants={descriptionVariants}
            className="mx-auto max-w-2xl text-sm text-balance text-muted-foreground sm:text-base"
          >
            <span className="sm:hidden">{t("description_mobile")}</span>
            <span className="hidden sm:inline">{t("description_desktop")}</span>
          </m.p>
        </div>
      </div>

      {/* ── Quick Actions (Marquee) ─────────────────────────────────────── */}
      <m.div variants={cardsVariants} className="min-h-[120px] w-full overflow-hidden py-4">
        {shuffledSuggestions.length > 0 && (
          <InfiniteMovingCards items={shuffledSuggestions} direction="left" speed="slow" onItemClick={setInput} />
        )}
      </m.div>
    </m.div>
  )
}
