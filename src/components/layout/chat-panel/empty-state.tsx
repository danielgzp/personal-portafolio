"use client"

import { m } from "framer-motion"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
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

export function Typewriter({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayedText(text.slice(0, i))
        if (i > text.length) clearInterval(interval)
      }, 30) // Velocidad de escritura: 30ms por letra
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span className={className}>
      {displayedText}
      {/* Mantenemos el ancho ocupado por el resto del texto para evitar saltos de diseño molestos */}
      <span className="opacity-0">{text.slice(displayedText.length)}</span>
    </span>
  )
}

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

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-8 overflow-x-hidden lg:gap-y-12">
      {/* Hero Header */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="flex flex-col items-center gap-4 text-center lg:gap-6"
      >
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="sm:hidden">
              <Typewriter
                text={t("title_ai")}
                delay={200}
                className="bg-linear-to-br from-foreground via-foreground/75 to-primary/10 bg-clip-text text-transparent drop-shadow-sm"
              />
            </span>
            <span className="hidden sm:inline">
              <Typewriter text={t("title_explore")} delay={0} />
              <br className="hidden sm:block" />
              <Typewriter
                text={t("title_explore_ai")}
                delay={1300}
                className="bg-linear-to-b from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-sm"
              />
            </span>
          </h2>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
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
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
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
