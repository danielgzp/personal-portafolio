"use client"

import { BackgroundGradient } from "@/components/ui/background-gradient"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

function Typewriter({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
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

interface EmptyStateProps {
  setInput: (input: string) => void
}

const words = [
  {
    text: "Asistente Virtual",
    className:
      "bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-primary! drop-shadow-sm text-xl",
  },
]

export function EmptyState({ setInput }: EmptyStateProps) {
  const suggestions = [
    {
      heading: "Experiencia",
      message: "¿Cuál es la experiencia de Daniel liderando equipos frontend?",
    },
    {
      heading: "Arquitectura",
      message: "¿Cómo estructura Daniel los proyectos grandes en Next.js?",
    },
    {
      heading: "Tech Stack",
      message: "¿Qué tecnologías prefiere usar actualmente?",
    },
    {
      heading: "Resumen",
      message: "Dame un resumen rápido de su perfil profesional.",
    },
  ]

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
    <div className="items-center justify-center p-4 pb-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex max-w-3xl flex-col items-center gap-4 text-center lg:mb-12 lg:gap-6"
      >
        {/* <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.4 }}
          className="relative"
        >
          <BackgroundGradient
            className="relative z-10 flex items-center justify-center rounded-full  p-3 text-primary/75 shadow-2xl"
            containerClassName="p-0"
          >
            <Sparkles className="size-6" strokeWidth={1.5} />
          </BackgroundGradient>
        </motion.div> */}

        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-pretty text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="sm:hidden">
              <Typewriter
                text="Asistente Virtual"
                delay={200}
                className="bg-linear-to-br from-foreground via-foreground/75 to-primary/10 bg-clip-text text-transparent drop-shadow-sm"
              />
              {/* <TypewriterEffectSmooth words={words} /> */}
            </span>
            <span className="hidden sm:inline">
              <Typewriter text="Conoce a Daniel" delay={0} />
              <br className="hidden sm:block" />
              <Typewriter text="a la velocidad de la " delay={700} />
              <Typewriter
                text="Inteligencia Artificial"
                delay={1400}
                className="bg-linear-to-b from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-sm"
              />
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            <span className="sm:hidden">
              Asistente entrenado con su perfil profesional y experiencia. Elige un tema para empezar.
            </span>
            <span className="hidden sm:inline">
              Soy un asistente entrenado con su perfil profesional, código y experiencia. <br /> Pregúntame sobre sus
              habilidades o elige un tema para empezar.
            </span>
          </motion.p>
        </div>
      </motion.div>

      {/* Quick Actions (Pills / Cards) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-3xl flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4"
      >
        {suggestions.map((suggestion) => (
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 0 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            key={suggestion.heading}
            onClick={() => setInput(suggestion.message)}
            className="flex w-full items-center justify-center rounded-xl border border-border/60 bg-linear-to-b from-card via-card/75 to-card/25 px-4 py-3 text-center text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-lg transition-all hover:cursor-pointer hover:border-primary/40 hover:from-primary/5 hover:to-primary/10 hover:text-primary hover:shadow-lg sm:h-20 sm:justify-start sm:rounded-2xl sm:px-6 sm:text-left sm:text-base"
          >
            {suggestion.message}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
