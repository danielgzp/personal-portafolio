"use client"

import { Topbar } from "@/components/layout/topbar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useMediaQuery } from "@/hooks/use-media-query"
import { m, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { ChatPanel } from "../components/layout/chat-panel"
import { ProfilePanel } from "../components/layout/profile-panel"

// True easeInOut (cubic-bezier): starts and ends softly — no jarring snap.
// willChange:transform on the panels pre-promotes GPU layers before the
// animation starts, eliminating the first-frame jank on mobile.
const SLIDE_TRANSITION = {
  duration: 0.35,
  ease: [0.4, 0, 0.3, 1] as [number, number, number, number],
}

export type TabType = "chat" | "profile"

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const isProfile = activeTab === "profile"
  const reduceMotion = useReducedMotion()

  // Only animate after explicit user interaction — prevents the isMobile
  // hydration (false → true) from triggering a slide animation on load.
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleTabChange = (tab: TabType) => {
    if (!hasInteracted) setHasInteracted(true)
    setActiveTab(tab)
  }

  // Instant jump on first load / reduced-motion; tween on user interactions.
  const slideTransition = !hasInteracted || reduceMotion ? { duration: 0 } : SLIDE_TRANSITION

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-background">
      <Topbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/*
          Both panels stay mounted at all times → chat state is preserved
          when the user switches tabs and comes back.

          On mobile: panels are absolute-positioned and slide left/right.
            - Profile: z-20 so it's on top on initial load (correct default).
            - Chat: starts off-screen at x:100%, slides in when active.
          On desktop (lg): panels become relative and flex side-by-side;
            x is always 0 so the slide logic is inert.
        */}
      <div className="relative flex size-full flex-1 overflow-hidden lg:flex-row">
        {/* ── Profile Panel ── slides out to the LEFT when Chat is active */}
        <m.section
          className="absolute inset-0 z-20 flex h-full w-full flex-col border-r border-border/40 bg-sidebar lg:relative lg:inset-auto lg:z-auto lg:order-1 lg:w-[40%]"
          initial={false}
          animate={{ x: isMobile && !isProfile ? "-100%" : 0 }}
          transition={slideTransition}
          style={{ pointerEvents: isMobile && !isProfile ? "none" : "auto", willChange: "transform" }}
        >
          <ProfilePanel />
          <div className="absolute top-4 right-4 z-50 hidden lg:block">
            <ThemeSwitcher />
          </div>
        </m.section>

        {/* ── Chat Panel ── slides in from the RIGHT when Chat is active */}
        <m.section
          className="absolute inset-0 z-10 flex h-full w-full flex-1 flex-col bg-background lg:relative lg:inset-auto lg:z-auto lg:order-2"
          initial={false}
          animate={{ x: isMobile && isProfile ? "100%" : 0 }}
          transition={slideTransition}
          style={{ pointerEvents: isMobile && isProfile ? "none" : "auto", willChange: "transform" }}
        >
          <ChatPanel />
        </m.section>
      </div>
    </main>
  )
}
