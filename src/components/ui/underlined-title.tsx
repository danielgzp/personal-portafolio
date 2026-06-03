import { cn } from "@/lib/utils"

interface UnderlinedTitleProps {
  children: React.ReactNode
  className?: string
}

// Base UI component: section heading with a gradient underline that glows.
// Three-layer technique: wide outer glow + tight inner glow + sharp line on top.
export function UnderlinedTitle({ children, className }: UnderlinedTitleProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase xl:text-base">{children}</h3>
      {/* Underline container — overflow-visible so glow bleeds outside the line bounds */}
      <div className="relative h-0.5 w-24 overflow-visible">
        {/* Layer 1: wide diffuse outer glow */}
        <div className="absolute inset-x-0 -inset-y-1.5 rounded-full bg-linear-to-r from-primary/25 to-transparent blur-md" />
        {/* Layer 2: tight inner glow — brighter, narrower spread */}
        <div className="absolute inset-0 -inset-y-px rounded-full bg-linear-to-r from-primary/70 to-transparent blur-[3px]" />
        {/* Layer 3: crisp sharp line on top */}
        <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary via-primary/60 to-transparent" />
      </div>
    </div>
  )
}
