import { cn } from "@/lib/utils"
import React from "react"
import { m } from "motion/react"

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  animate?: boolean
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  }
  return (
    <div className={cn("group relative p-[1px]", containerClassName)}>
      <m.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-[1] rounded-full opacity-30 blur-lg transition duration-500 will-change-transform group-hover:opacity-60",
          "bg-linear-to-r from-primary/20 via-primary/80 to-primary/20"
        )}
      />

      <m.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-[1] rounded-full opacity-80 will-change-transform",
          "bg-linear-to-r from-primary/20 via-primary/60 to-primary/20"
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  )
}
