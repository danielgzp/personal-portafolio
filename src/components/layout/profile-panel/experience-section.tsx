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
import { useTranslations } from "next-intl"

interface ExperienceItem {
  id: number
  role: string
  company: string
  location: string
  date: string
  description: string
  skills: string[]
}

// Individual experience card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_PREMIUM },
  },
}

export function ExperienceSection() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("profile.experience")

  const expirienceItems = t.raw("items") as ExperienceItem[]

  return (
    <m.div variants={sectionVariants} className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Experiencia Laboral</h3>
      <Timeline defaultValue={expirienceItems.length + 1}>
        {expirienceItems.map((item) => (
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
                    <TimelineTitle className="text-sm font-bold text-foreground">{item.role}</TimelineTitle>
                    <span className="text-sm font-medium text-muted-foreground">{item.company}</span>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <span className="text-sm font-semibold text-foreground">{item.location}</span>
                    <TimelineDate className="mb-0! text-sm font-normal text-muted-foreground italic">
                      {item.date}
                    </TimelineDate>
                  </div>
                </div>
              </TimelineHeader>
              <TimelineContent className="space-y-4 leading-relaxed text-muted-foreground">
                <p className="text-sm">{item.description}</p>
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
