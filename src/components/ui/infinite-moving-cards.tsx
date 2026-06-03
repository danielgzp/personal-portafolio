"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"

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
    icon?: React.ReactNode
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
        onClick={(e) => {
          const button = (e.target as HTMLElement).closest("button")
          if (button) {
            const message = button.getAttribute("data-message")
            if (message) {
              onItemClick?.(message)
            }
          }
        }}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:paused"
        )}
      >
        {items.map((item) => {
          return (
            <button
              type="button"
              data-message={item.message}
              className="group flex h-28 w-[280px] shrink-0 cursor-pointer flex-col gap-1 rounded-2xl border border-border/50 bg-background/40 px-4 py-3.5 text-left shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-background/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:w-[320px] lg:gap-2 lg:px-5 lg:py-4 dark:border-white/10 dark:bg-white/3 dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.04)]"
              key={item.heading}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-primary lg:text-base">
                  {item.heading}
                </span>
                {item.icon && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20 lg:size-7 [&>svg]:size-3.5 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:group-hover:rotate-6 lg:[&>svg]:size-4">
                    {item.icon}
                  </div>
                )}
              </div>
              <p className="line-clamp-2 text-[13px] leading-relaxed font-normal text-muted-foreground transition-colors group-hover:text-foreground/80 lg:text-[15px]">
                {item.message}
              </p>
            </button>
          )
        })}
      </ul>
    </div>
  )
}
