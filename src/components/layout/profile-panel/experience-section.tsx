import { Badge } from "@/components/ui/badge"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "@/components/ui/timeline"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { sectionVariants, EASE_PREMIUM, SPRING_INTERACTIVE } from "@/lib/animations"
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

// Draw timeline vertical path down on entry
const lineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: (idx: number) => ({
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: EASE_PREMIUM,
      delay: idx * 0.08,
    },
  }),
}

// Indicator pops in with spring
const dotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (idx: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: idx * 0.08 + 0.12,
    },
  }),
}

// Individual experience card entry and hover elevation
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_PREMIUM, delay: idx * 0.08 },
  }),
  hover: {
    y: -4,
    scale: 1.01,
    transition: SPRING_INTERACTIVE,
  },
}

export function ExperienceSection() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("profile.experience")

  const expirienceItems = t.raw("items") as ExperienceItem[]

  return (
    <m.div
      variants={sectionVariants}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="space-y-4"
    >
      <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Experiencia Laboral</h3>
      <Timeline defaultValue={expirienceItems.length + 1}>
        {expirienceItems.map((item, idx) => (
          <TimelineItem key={item.id} step={item.id} className="not-last:pb-6! max-sm:ms-0!">
            {/* Animated separator path */}
            <m.div
              variants={lineVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={idx}
              style={{ transformOrigin: "top" }}
              className="absolute self-start bg-border/20 group-last/timeline-item:hidden group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5 max-sm:-left-4"
            />
            {/* Animated timeline indicator dot */}
            <m.div
              variants={dotVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={idx}
              className="absolute size-4 rounded-full border border-border/40 bg-background group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 max-sm:-left-4 flex items-center justify-center"
            >
              <div className="size-1.5 rounded-full bg-primary" />
            </m.div>

            <m.div
              variants={cardVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              whileHover={reduceMotion ? {} : "hover"}
              viewport={{
                once: true,
                amount: 0.15,
                margin: "0px 0px -40px 0px",
              }}
              custom={idx}
              className="group flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-card/75 hover:border-border/80 sm:p-6"
            >
              <TimelineHeader className="w-full pb-0">
                <div className="flex w-full flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex flex-col">
                    <TimelineTitle className="text-base font-bold tracking-tight text-foreground">
                      {item.role}
                    </TimelineTitle>
                    <span className="text-sm font-medium text-muted-foreground">{item.company}</span>
                  </div>
                  <div className="mt-1 flex flex-col sm:mt-0 sm:text-right">
                    <span className="text-sm font-semibold text-foreground">{item.location}</span>
                    <TimelineDate className="mt-0.5 mb-0! text-xs font-medium text-muted-foreground italic">
                      {item.date}
                    </TimelineDate>
                  </div>
                </div>
              </TimelineHeader>
              <TimelineContent className="space-y-4 leading-relaxed text-muted-foreground">
                <p className="text-sm/6">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="h-6 rounded-full border-dashed border-border bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition-colors group-hover:bg-secondary/70"
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
