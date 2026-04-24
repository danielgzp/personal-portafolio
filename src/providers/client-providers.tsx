"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "./theme-provider"
import { LazyMotion, domAnimation } from "framer-motion"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <TooltipProvider>{children}</TooltipProvider>
      </LazyMotion>
    </ThemeProvider>
  )
}
