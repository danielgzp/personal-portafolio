"use client"

import { motion } from "framer-motion"
import { Sparkles, Code2, Briefcase, FileText, ArrowRight } from "lucide-react"

interface EmptyStateProps {
  setInput: (input: string) => void
}

export function EmptyState({ setInput }: EmptyStateProps) {
  const suggestions = [
    {
      heading: "Experiencia",
      message: "¿Cuál es la experiencia de Daniel liderando equipos frontend?",
      icon: <Briefcase className="size-5" />,
    },
    {
      heading: "Arquitectura",
      message: "¿Cómo estructura Daniel los proyectos grandes en Next.js?",
      icon: <Code2 className="size-5" />,
    },
    {
      heading: "Tech Stack",
      message: "¿Qué tecnologías prefiere usar en 2026?",
      icon: <Sparkles className="size-5" />,
    },
    {
      heading: "Resumen",
      message: "Dame un resumen rápido de su perfil profesional.",
      icon: <FileText className="size-5" />,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_theme(colors.primary.DEFAULT/15%)] ring-1 ring-primary/20 backdrop-blur-xl"
        >
          <Sparkles className="size-8" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Conoce a Daniel <br className="hidden sm:block" /> a la velocidad de la IA
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-muted-foreground/80 md:text-xl">
            Conozco su carrera, experiencia en código y habilidades blandas.
            <br className="hidden sm:block" />
            Hazme cualquier pregunta o elige una sugerencia para empezar.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {suggestions.map((suggestion) => (
          <motion.button
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={suggestion.heading}
            onClick={() => setInput(suggestion.message)}
            className="group relative flex h-full w-full cursor-pointer flex-col items-start gap-3 rounded-2xl border border-border/50 bg-card/40 p-5 text-left shadow-sm backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-card/80"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {suggestion.icon}
                </div>
                <span className="text-sm font-semibold text-foreground/90">{suggestion.heading}</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:-translate-x-1 group-hover:text-primary group-hover:opacity-100" />
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
              {suggestion.message}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
