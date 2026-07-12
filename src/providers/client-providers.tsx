"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { LazyMotion, domAnimation } from "framer-motion"
import { ThemeProvider } from "./theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LazyMotion features={domAnimation} strict>
          <TooltipProvider>{children}</TooltipProvider>
        </LazyMotion>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
