"use client"

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
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { UnderlinedTitle } from "@/components/ui/underlined-title"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { Building2, MapPin } from "lucide-react"

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
  achievements?: string[]
  skills: string[]
}

// Individual experience item elegant entrance
const cardVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: (idx: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: idx * 0.1 },
  }),
}

export function ExperienceSection() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("profile.experience")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  // Conditional rendering — only the active layout is mounted in the DOM.
  // This prevents Swiper from registering listeners on desktop and
  // framer-motion timeline animations from running on mobile.
  const isMobile = useMediaQuery("(max-width: 639px)")

  const experienceItems = t.raw("items") as ExperienceItem[]

  return (
    <m.div variants={sectionVariants} className="space-y-4">
      <UnderlinedTitle>{t("title")}</UnderlinedTitle>

      {/* Conditionally render only the active layout for the current breakpoint */}

      {isMobile ? (
        <ExperienceCarousel items={experienceItems} />
      ) : (
        <Timeline defaultValue={experienceItems.length + 1}>
          {experienceItems.map((item, idx) => (
            <TimelineItem key={item.id} step={item.id} className="group/timeline-item not-last:pb-6! max-sm:ms-0!">
              {/* Clean separator path using native component */}
              <TimelineSeparator className="group-last/timeline-item:block! group-last/timeline-item:bg-border max-sm:-left-4" />

              {/* Native indicator component with ping animation for current job */}
              <TimelineIndicator
                className={cn("bg-background transition-all duration-300 group-hover/timeline-item:border-primary", {
                  "border-primary! shadow-[0_0_14px] shadow-primary/75": idx === 0,
                })}
              />

              <m.div
                variants={cardVariants}
                initial={reduceMotion ? "visible" : "hidden"}
                whileInView="visible"
                whileHover={reduceMotion ? {} : "hover"}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                custom={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative flex flex-col gap-2 pb-4 opacity-100 transition-opacity duration-300"
              >
                <TimelineHeader className="w-full pb-0">
                  <div className="flex w-full flex-col sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                    <div className="flex flex-col gap-y-2.5">
                      <TimelineTitle
                        className={cn(
                          "text-lg leading-none font-bold tracking-tight transition-colors sm:text-xl",
                          "text-foreground"
                        )}
                      >
                        {item.role}
                      </TimelineTitle>

                      <div className="flex flex-wrap items-center gap-x-2 text-base">
                        <span className="font-medium">{item.company}</span>
                        <span>•</span>
                        <span className="text-muted-foreground">{item.location}</span>
                      </div>
                    </div>

                    <TimelineDate className="mt-0.5 mb-0! flex items-center gap-1.5 rounded-full border border-border/50 bg-card/90 px-3 py-1 text-xs font-medium text-muted-foreground sm:text-[13px]">
                      {idx === 0 && (
                        <span className="relative flex size-2">
                          <span className="absolute size-2 animate-ping rounded-full bg-primary/50" />
                          <span className="size-full rounded-full bg-primary" />
                        </span>
                      )}
                      {item.date}
                    </TimelineDate>
                  </div>
                </TimelineHeader>

                <TimelineContent className="mt-3 space-y-4 leading-relaxed text-muted-foreground">
                  <p className="text-sm/6 xl:text-base/6">{item.description}</p>

                  {item.achievements && item.achievements.length > 0 && (
                    <ol className="flex flex-col gap-2.5">
                      {item.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="relative pl-5 text-sm/6 before:absolute before:top-2.5 before:left-1 before:size-1.5 before:rounded-full before:bg-muted-foreground/60 xl:text-base/6"
                        >
                          {achievement}
                        </li>
                      ))}
                    </ol>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="borde h-6 rounded-full border border-dashed bg-card px-2.5 text-xs font-medium text-secondary-foreground transition-colors"
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
      )}
    </m.div>
  )
}
