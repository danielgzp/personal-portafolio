"use client"

import { motion } from "framer-motion"
import { Sparkles, Code2, Briefcase, FileText, ArrowRight, TerminalIcon } from "lucide-react"
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

export function EmptyState({ setInput }: EmptyStateProps) {
  const suggestions = [
    {
      heading: "Experiencia",
      message: "¿Cuál es la experiencia de Daniel liderando equipos frontend?",
      icon: <Briefcase className="size-4" />,
    },
    {
      heading: "Arquitectura",
      message: "¿Cómo estructura Daniel los proyectos grandes en Next.js?",
      icon: <Code2 className="size-4" />,
    },
    {
      heading: "Tech Stack",
      message: "¿Qué tecnologías prefiere usar actualmente?",
      icon: <TerminalIcon className="size-4" />,
    },
    {
      heading: "Resumen",
      message: "Dame un resumen rápido de su perfil profesional.",
      icon: <FileText className="size-4" />,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 2.2, // Retrasamos su entrada hasta que termine el título
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.4 }}
          className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-[0_0_30px_rgba(var(--primary),0.2)] ring-1 ring-primary/20 backdrop-blur-xl"
        >
          <Sparkles className="size-6" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            <Typewriter text="Conoce a Daniel " delay={200} />
            <br className="hidden sm:block" />
            <Typewriter text="a la velocidad de la " delay={700} />
            <Typewriter
              text="Inteligencia Artificial"
              delay={1400}
              className="bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-sm"
            />
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Soy un asistente entrenado con su perfil profesional, código y experiencia.{" "}
            <br className="hidden sm:block" /> Pregúntame sobre sus habilidades o elige un tema para empezar.
          </motion.p>
        </div>
      </motion.div>

      {/* Grid of Suggestions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {suggestions.map((suggestion) => (
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            key={suggestion.heading}
            onClick={() => setInput(suggestion.message)}
            className="group relative flex h-full w-full cursor-pointer flex-col items-start gap-4 rounded-3xl border border-border/40 bg-card p-6 text-left shadow-[0_0_15px_rgba(0,0,0,0.03)] shadow-lg backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-card/40 hover:shadow-[0_0_25px_rgba(var(--primary),0.08)]"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  {suggestion.icon}
                </div>
                <span className="text-sm font-bold tracking-wide text-foreground/90 uppercase">
                  {suggestion.heading}
                </span>
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-background/50 opacity-0 transition-all group-hover:opacity-100 dark:bg-foreground/10">
                <ArrowRight className="size-4 text-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed font-medium text-muted-foreground transition-colors group-hover:text-foreground/80">
              {suggestion.message}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
