"use client"

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
import { sectionVariants, EASE_PREMIUM } from "@/lib/animations"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

// Swiper reads browser-only APIs — must be loaded client-side only to avoid
// hydration mismatches that crash the entire React tree on mobile.
const ExperienceCarousel = dynamic(() => import("./experience-carousel").then((m) => m.ExperienceCarousel), {
  ssr: false,
})

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
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

export function ExperienceSection() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("profile.experience")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const experienceItems = t.raw("items") as ExperienceItem[]

  return (
    <m.div
      variants={sectionVariants}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="space-y-4"
    >
      <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Experiencia Laboral</h3>

      {/* ── Mobile: touch-friendly Swiper carousel (hidden on sm+) ── */}
      <div className="block sm:hidden">
        <ExperienceCarousel items={experienceItems} />
      </div>

      {/* ── Desktop/Tablet: animated vertical timeline (hidden on mobile) ── */}

      <Timeline defaultValue={experienceItems.length + 1} className="hidden sm:block">
        {experienceItems.map((item, idx) => (
          <TimelineItem key={item.id} step={item.id} className="not-last:pb-6! max-sm:ms-0!">
            {/* Animated separator path with subtle glow on hover */}
            <div className="absolute self-start overflow-hidden bg-border/10 group-last/timeline-item:hidden group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5 max-sm:-left-4">
              <m.div
                variants={lineVariants}
                initial={reduceMotion ? "visible" : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                custom={idx}
                style={{ transformOrigin: "top" }}
                className="absolute inset-0 bg-border/30"
              />
              <m.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: hoveredIdx === idx ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                style={{ transformOrigin: "top" }}
                className="absolute inset-0 bg-gradient-to-b from-primary via-primary/50 to-transparent"
              />
            </div>

            {/* Animated timeline indicator dot with interactive scaling and styling on hover */}
            <m.div
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={idx}
              animate={hoveredIdx === idx ? "hover" : "visible"}
              variants={{
                ...dotVariants,
                hover: {
                  scale: 1.2,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                },
              }}
              className={`absolute z-10 flex size-4 items-center justify-center rounded-full border bg-background transition-colors duration-300 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 max-sm:-left-4 ${
                hoveredIdx === idx ? "border-primary" : "border-border/40"
              }`}
            >
              <m.div
                animate={{
                  scale: hoveredIdx === idx ? 1.25 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="size-1.5 rounded-full bg-primary"
              />
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
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/90 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/70 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] sm:p-6 dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]"
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
              <Separator />

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
