"use client"

import { cn } from "@/lib/utils"
import { m } from "framer-motion"
import type { CSSProperties, JSX } from "react"
import { useMemo } from "react"

export interface TextShimmerProps {
  children: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({ children, as = "p", className, duration = 2, spread = 2 }: TextShimmerProps) => {
  // Use the pre-defined m components instead of creating new ones via motion.create()
  // This avoids the "Cannot create components during render" error and is faster.
  const MotionTag = (m[as as keyof typeof m] as typeof m.p) ?? m.p

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread])

  return (
    <MotionTag
      animate={{ backgroundPosition: "0% center" }}
      className={cn(
        "relative inline-block bg-size-[250%_100%,auto] bg-clip-text text-transparent",
        "[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
        } as CSSProperties
      }
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
    >
      {children}
    </MotionTag>
  )
}

export const TextShimmer = ShimmerComponent
export const Shimmer = ShimmerComponent
