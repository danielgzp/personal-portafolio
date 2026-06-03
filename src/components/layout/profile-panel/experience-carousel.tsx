"use client"

// Swiper CSS — imported in the JS bundle to bypass PostCSS @import limitations
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/pagination"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { EffectFade, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Separator } from "@/components/ui/separator"
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

interface ExperienceCarouselProps {
  items: ExperienceItem[]
}

export function ExperienceCarousel({ items }: ExperienceCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const t = useTranslations("profile.experience")

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 overflow-hidden">
      {/*
        EffectFade behaves beautifully with autoHeight={true}.
      */}
      <Swiper
        className="exp-swiper w-full"
        modules={[EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoHeight={true}
        speed={500}
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
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              // h-auto lets each card size to its natural content, transitioning dynamically via autoHeight
              className="flex h-auto min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-4 shadow-sm backdrop-blur-sm"
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

              <Separator className="bg-border/50" />

              {/* Description */}
              <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {item.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="h-5 rounded-full border-dashed border-border bg-secondary px-2 text-[11px] font-medium text-secondary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
