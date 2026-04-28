"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { LazyMotion, domAnimation } from "framer-motion"
import { ThemeProvider } from "./theme-provider"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    // TODO: replace with @teispace/next-themes
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <TooltipProvider>{children}</TooltipProvider>
      </LazyMotion>
    </ThemeProvider>
  )
}
