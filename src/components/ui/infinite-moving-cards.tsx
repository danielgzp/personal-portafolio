"use client"

import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import React, { useEffect, useState } from "react"

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    heading: string
    message: string
  }[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
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
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("scroller relative z-20 w-full overflow-hidden", "mask-x-from-90% mask-x-to-100%", className)}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:paused"
        )}
      >
        {items.map((item, idx) => (
          <button
            className="group flex w-[320px] shrink-0 cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-card! p-6 text-left backdrop-blur-sm transition-all duration-300 hover:bg-card/50 md:w-[400px]"
            key={idx}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 transition-colors group-hover:bg-rose-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase transition-colors group-hover:text-zinc-400">
                {item.heading}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300 transition-colors group-hover:text-white">
              {item.message}
            </p>
          </button>
        ))}
      </ul>
    </div>
  )
}
