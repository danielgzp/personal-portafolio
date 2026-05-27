"use client"

import { cn } from "@/lib/utils"
import {
  Briefcase,
  Boxes,
  Code2,
  User,
  Bot,
  Rocket,
  Palette,
  GitFork,
  TrendingUp,
  Lightbulb,
  Shield,
  Zap,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import React, { useEffect, useState } from "react"

// Helper function to map translated category headings to appropriate Lucide icons in both English and Spanish
const getIconForHeading = (heading: string): LucideIcon => {
  const h = heading.toLowerCase()
  if (h.includes("experience") || h.includes("experiencia")) return Briefcase
  if (h.includes("architecture") || h.includes("arquitectura")) return Boxes
  if (h.includes("tech")) return Code2
  if (h.includes("summary") || h.includes("resumen")) return User
  if (h.includes("ai") || h.includes("ia")) return Bot
  if (h.includes("project") || h.includes("proyecto")) return Rocket
  if (h.includes("design")) return Palette
  if (h.includes("state") || h.includes("estado")) return GitFork
  if (h.includes("scale") || h.includes("escala")) return TrendingUp
  if (h.includes("vision") || h.includes("visión")) return Lightbulb
  if (h.includes("leader") || h.includes("lider")) return Shield
  if (h.includes("challenge") || h.includes("reto")) return Zap
  return Sparkles
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  onItemClick,
}: {
  items: {
    heading: string
    message: string
  }[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
  onItemClick?: (message: string) => void
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  const [start, setStart] = useState(false)

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      if (scrollerRef.current.getAttribute("data-cloned") === "true") return
      scrollerRef.current.setAttribute("data-cloned", "true")

      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards")
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse")
      }
    }
  }
  const getSpeed = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--gap", "1.5rem")
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s")
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s")
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s")
      }
    }
  }

  useEffect(() => {
    addAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("scroller relative z-20 w-full overflow-hidden", "mask-x-from-90% mask-x-to-100%", className)}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-2",
          start && "animate-scroll",
          pauseOnHover && "hover:paused"
        )}
      >
        {items.map((item, idx) => {
          const Icon = getIconForHeading(item.heading)
          return (
            <button
              onClick={() => onItemClick?.(item.message)}
              className="group flex w-70 shrink-0 cursor-pointer flex-col gap-2.5 rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:w-[320px] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
              key={idx}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-primary">
                  {item.heading}
                </span>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20">
                  <Icon className="size-4 transition-transform duration-300 group-hover:rotate-6" />
                </div>
              </div>
              <p className="text-[13px] leading-relaxed font-normal text-muted-foreground transition-colors group-hover:text-foreground/80">
                {item.message}
              </p>
            </button>
          )
        })}
      </ul>
    </div>
  )
}
