"use client"

import { motion } from "framer-motion"
import { Sparkles, Code2, Briefcase, FileText } from "lucide-react"

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
      message: "¿Qué tecnologías prefiere usar en 2026?",
      icon: <Sparkles className="size-4" />,
    },
    {
      heading: "Resumen",
      message: "Dame un resumen rápido de su perfil profesional.",
      icon: <FileText className="size-4" />,
    },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex max-w-md flex-col items-center gap-2 text-center"
      >
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Hola, soy el Agente de Daniel</h2>
        <p className="text-base text-muted-foreground">
          Conozco todo sobre su carrera, experiencia en código y habilidades blandas. Hazme cualquier pregunta o elige
          una sugerencia para empezar.
        </p>
      </motion.div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            key={suggestion.heading}
          >
            <button
              onClick={() => setInput(suggestion.message)}
              className="flex h-full w-full cursor-pointer flex-col items-start gap-1 rounded-xl border p-4 text-left shadow-sm transition-colors hover:bg-muted/50 active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-muted-foreground">{suggestion.icon}</span>
                {suggestion.heading}
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{suggestion.message}</p>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
