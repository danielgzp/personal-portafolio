"use client"

import { Topbar } from "@/components/layout/topbar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useMediaQuery } from "@/hooks/use-media-query"
import { m, useReducedMotion } from "framer-motion"
import { useState, useEffect, useSyncExternalStore } from "react"
import { ChatPanel } from "@/components/layout/chat-panel"
import { ProfilePanel } from "@/components/layout/profile-panel"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { cn } from "@/lib/utils"

// Premium iOS-style drawer easing (emilkowal-animations)
// 500ms duration with a strong deceleration curve for a natural swipe-like feel
const SLIDE_TRANSITION = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
}

export type TabType = "chat" | "profile"

/**
 * Client-only shell that owns all interactive state for the two-panel layout.
 * Keeping this as a dedicated client component lets `page.tsx` remain a
 * React Server Component, avoiding a full-app client boundary at the root.
 */
export function PanelLayout() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isProfile = activeTab === "profile"
  const reduceMotion = useReducedMotion()

  // Only animate after explicit user interaction — prevents the isMobile
  // hydration (false → true) from triggering a slide animation on load.
  const [hasInteracted, setHasInteracted] = useState(false)

  // React 18/19 Modern SSR Bypass: 
  // Avoids the cascading render warning of useEffect by using useSyncExternalStore.
  // It returns false on the server (SSR), and true immediately on the client.
  const isMounted = useSyncExternalStore(
    () => () => {}, // dummy subscribe
    () => true,     // client value
    () => false     // server value
  )

  const handleTabChange = (tab: TabType) => {
    if (!hasInteracted) setHasInteracted(true)
    setActiveTab(tab)
  }

  // Instant jump on first load / reduced-motion; tween on user interactions.
  const slideTransition = !hasInteracted || reduceMotion ? { duration: 0 } : SLIDE_TRANSITION

  // S-4: Pre-promote GPU layer only on mobile where slides actually animate.
  // On desktop the panels are relative siblings — willChange would waste GPU memory.
  const willChange = isMobile ? "transform" : "auto"

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-background">
      <Topbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/*
          Premium mobile transitions:
          Chat (z-20) slides in from the right over Profile (z-10).
          Profile performs a parallax "scale down & blur" effect into the background.
          On desktop, they snap to a standard flex row layout.
        */}
      <div className="relative flex size-full flex-1 overflow-hidden lg:flex-row">
        {/* ── Profile Panel ── scales back & blurs when Chat is active */}
        <m.section
          className="absolute inset-0 z-10 flex h-full w-full flex-col border-r border-border/40 bg-sidebar lg:relative lg:inset-auto lg:z-auto lg:order-1 lg:w-1/2 xl:w-[40%]"
          initial={false}
          animate={{
            x: isMobile && !isProfile ? "-10%" : "0%",
            scale: isMobile && !isProfile ? 0.96 : 1,
            opacity: isMobile && !isProfile ? 0.4 : 1,
            filter: isMobile && !isProfile ? "blur(2px)" : "blur(0px)",
          }}
          transition={slideTransition}
          style={{ pointerEvents: isMobile && !isProfile ? "none" : "auto", willChange }}
        >
          <ProfilePanel />
          {/*
              Floating switchers on desktop wrapped in a premium glassmorphic pill
              to isolate them and prevent visual text overlapping on scroll.
           */}
          <div className="absolute top-4 right-4 z-50 hidden flex-row items-center gap-1 rounded-full border border-border/40 bg-background/80 p-1 shadow-xs backdrop-blur-lg lg:flex dark:bg-card/80">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </m.section>

        {/* ── Chat Panel ── slides in from the RIGHT over the Profile */}
        <m.section
          className={cn(
            "absolute inset-0 z-20 flex h-full w-full flex-1 flex-col bg-background shadow-2xl lg:relative lg:inset-auto lg:z-auto lg:order-2 lg:w-1/2 lg:flex-initial lg:shadow-none xl:w-[60%]",
            !isMounted && "max-lg:hidden" // Prevent SSR FOUC: totally hidden in mobile until hydrated
          )}
          initial={false}
          animate={{ x: isMobile && isProfile ? "100%" : "0%" }}
          transition={slideTransition}
          style={{ pointerEvents: isMobile && isProfile ? "none" : "auto", willChange }}
        >
          <ChatPanel />
        </m.section>
      </div>
    </main>
  )
}
