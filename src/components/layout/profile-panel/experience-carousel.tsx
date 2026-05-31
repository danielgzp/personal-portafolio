"use client"

// Swiper CSS — imported in the JS bundle to bypass PostCSS @import limitations
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

import { Badge } from "@/components/ui/badge"
import { EASE_PREMIUM } from "@/lib/animations"
import { m, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { EffectFade, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

interface ExperienceItem {
  id: number
  role: string
  company: string
  location: string
  date: string
  description: string
  skills: string[]
}

// Card entrance — subtle rise on first render
const slideVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_PREMIUM, delay: i * 0.05 },
  }),
}

interface ExperienceCarouselProps {
  items: ExperienceItem[]
}

export function ExperienceCarousel({ items }: ExperienceCarouselProps) {
  const reduceMotion = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className="w-full min-w-0 overflow-hidden flex flex-col gap-3">
      {/*
        EffectFade requires allowTouchMove:true and behaves beautifully with autoHeight={true}.
      */}
      <Swiper
        className="exp-swiper w-full"
        modules={[EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoHeight={true}
        speed={reduceMotion ? 0 : 500}
        slidesPerView={1}
        spaceBetween={24}
        allowTouchMove
        grabCursor
        onSlideChange={(s) => setActiveIdx(s.activeIndex)}
        pagination={{
          clickable: true,
          // renderBullet — Swiper's official custom pagination API
          // Returns an HTML string; Swiper injects it into the pagination el
          renderBullet: (index, className) => {
            const isActive = index === activeIdx
            return `<span class="${className} exp-bullet${isActive ? " exp-bullet--active" : ""}"></span>`
          },
        }}
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item.id}>
            <m.div
              variants={slideVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              custom={idx}
              // h-auto lets each card size to its natural content, transitioning dynamically via autoHeight
              className="flex h-auto min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-4 backdrop-blur-sm"
            >
              {/* Role + company */}
              <div className="flex min-w-0 flex-col gap-0.5">
                <h4 className="truncate text-sm font-bold tracking-tight text-foreground">{item.role}</h4>
                <span className="truncate text-xs font-medium text-muted-foreground">{item.company}</span>
              </div>

              {/* Location & date */}
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="truncate text-xs font-semibold text-foreground">{item.location}</span>
                <time className="shrink-0 text-xs font-medium text-muted-foreground italic">{item.date}</time>
              </div>

              {/* Divider */}
              <div className="h-px shrink-0 bg-border/30" />

              {/* Description */}
              <p className="line-clamp-3 text-xs/5 text-muted-foreground">{item.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {item.skills.map((skill, sIdx) => (
                  <Badge
                    key={sIdx}
                    variant="secondary"
                    className="h-5 rounded-full border-dashed border-border bg-secondary px-2 text-[10px] font-medium text-secondary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </m.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
