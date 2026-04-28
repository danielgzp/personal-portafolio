import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { sectionVariants, EASE_PREMIUM } from "@/lib/animations"

const EXPERIENCE_ITEMS = [
  {
    id: 1,
    company: "Essertech LLC",
    role: "Lead Frontend Developer",
    location: "Cabudare, Venezuela",
    date: "Mayo 2025 — Actualidad",
    description:
      "Lideré el desarrollo end-to-end de un ERP para ISP. Definí la arquitectura modular y creé un System Design con estándares Pixel-Perfect. Integré asistentes de IA, acelerando el ciclo de desarrollo en un 45%.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI", "System Design"],
  },
  {
    id: 2,
    company: "Essertech LLC",
    role: "Junior Frontend Developer",
    location: "Cabudare, Venezuela",
    date: "Agosto 2023 — Mayo 2025",
    description:
      "Desarrollé un sistema finanzas a medida en tiempo real, optimicé el rendimiento de un ecosistema SaaS y trabajé en el desarrollo de un marketplace multi-tenant global con internacionalización robusta.",
    skills: ["React", "Next.js", "Zustand", "Supabase", "i18n"],
  },
  {
    id: 3,
    company: "Grupo Corporativo Marna",
    role: "Software Developer",
    location: "Barquisimeto, Venezuela",
    date: "Agosto 2022 — Noviembre 2022",
    description:
      "Rediseñé la interfaz y mejoré la usabilidad de un sistema de citas para spas, implementando su internacionalización. Además, desarrollé la landing page comercial para su distribución.",
    skills: ["PHP", "PostgreSQL", "HTML5", "CSS"],
  },
]

// Individual experience card — used with whileInView
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_PREMIUM },
  },
}

// Section title is part of the cascade; cards use whileInView
// so they animate in as the user scrolls down, not all at once.

export function ExperienceSection() {
  const reduceMotion = useReducedMotion()

  return (
    <m.div variants={sectionVariants} className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Experiencia Laboral</h3>
      <Timeline defaultValue={EXPERIENCE_ITEMS.length + 1}>
        {EXPERIENCE_ITEMS.map((item) => (
          <TimelineItem key={item.id} step={item.id} className="not-last:pb-6!">
            <TimelineSeparator />
            <TimelineIndicator />
            <m.div
              variants={cardVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
                margin: "0px 0px -40px 0px",
              }}
              transition={{ delay: item.id - 1 * 0.08 }}
              className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/90 p-6 shadow-sm transition-colors hover:bg-card/50"
            >
              <TimelineHeader className="w-full pb-0">
                <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex flex-col">
                    <TimelineTitle className="text-base font-bold text-foreground">{item.role}</TimelineTitle>
                    <span className="text-base font-medium text-muted-foreground">{item.company}</span>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <span className="text-base font-medium text-foreground">{item.location}</span>
                    <TimelineDate className="mb-0! text-base! font-normal text-muted-foreground italic">
                      {item.date}
                    </TimelineDate>
                  </div>
                </div>
              </TimelineHeader>
              <TimelineContent className="space-y-4 leading-relaxed text-muted-foreground">
                <p className="text-base">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="h-6 rounded-full border border-dashed border-border px-2.5 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TimelineContent>
            </m.div>
          </TimelineItem>
        ))}
      </Timeline>
    </m.div>
  )
}
