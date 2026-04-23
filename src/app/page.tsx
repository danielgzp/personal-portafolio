"use client"

import { ChatArea } from "@/components/layout/chat/chat-area"
import { LeftPanel } from "@/components/layout/left-panel"
import { Topbar } from "@/components/layout/topbar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useState } from "react"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

export type TabType = "chat" | "profile"

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isProfile = activeTab === "profile"

  // Only animate the flip after the user has explicitly changed a tab.
  // This prevents the initial isMobile hydration (false→true) from
  // triggering the 3D flip animation on first load.
  const [hasInteracted, setHasInteracted] = useState(false)

  // Skip the spring entirely when the OS has prefers-reduced-motion enabled.
  const reduceMotion = useReducedMotion()

  const handleTabChange = (tab: TabType) => {
    if (!hasInteracted) setHasInteracted(true)
    setActiveTab(tab)
  }

  const flipTransition =
    reduceMotion || !hasInteracted
      ? { duration: 0 }
      : { duration: 0.75, type: "spring" as const, damping: 22, stiffness: 110 }

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-background">
        <Topbar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main 3D Container Wrapper — perspective in style to avoid CSS recalc */}
        <div className="relative flex size-full flex-1 flex-col lg:flex-row" style={{ perspective: "2000px" }}>
          <m.div
            className="relative flex size-full w-full flex-col lg:flex-row"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            initial={false}
            animate={{ rotateY: isMobile && isProfile ? 180 : 0 }}
            transition={flipTransition}
          >
            {/* Back on Mobile (rotated 180deg) | Left on Desktop */}
            <section
              className="absolute inset-0 z-10 flex h-full w-full flex-col border-r border-border/40 bg-sidebar lg:relative lg:z-auto lg:order-1 lg:w-[40%]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: isMobile ? "rotateY(180deg)" : "none",
                pointerEvents: isMobile && !isProfile ? "none" : "auto",
              }}
            >
              <LeftPanel />
              <div className="absolute top-4 right-4 z-50 hidden lg:block">
                <ThemeSwitcher />
              </div>
            </section>

            {/* Front on Mobile (0deg) | Right on Desktop */}
            <section
              className="absolute inset-0 z-20 flex h-full w-full flex-1 flex-col bg-background lg:relative lg:z-auto lg:order-2"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: isMobile ? "rotateY(0deg)" : "none",
                pointerEvents: isMobile && isProfile ? "none" : "auto",
              }}
            >
              <ChatArea />
            </section>
          </m.div>
        </div>
      </main>
    </LazyMotion>
  )
}
