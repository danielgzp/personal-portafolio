"use client"

import { type Variants, m, LayoutGroup, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocaleSwitcher } from "../locale-switcher"
import { TabType } from "@/app/[locale]/page"

// Module-level variants — defined once, never recreated on re-renders.
// Each variant carries its own transition for asymmetric easing:
//   hide → fast ease-in  (quick dismissal, non-distracting)
//   show → slower ease-out (deliberate reveal, user needs to read it)
const headerVariants: Variants = {
  visible: {
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] }, // ease-in
  },
  hidden: {
    y: "-100%",
    transition: { duration: 0.3, ease: "easeInOut" }, // ease-in
  },
}

// Tab pill spring — module-level so it's not inlined per render
const pillTransition = { type: "spring", damping: 28, stiffness: 300 } as const

const scrollId = "profile-scroll-container"

interface TopbarProps {
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
}

export function Topbar({ activeTab = "profile", onTabChange }: TopbarProps) {
  const [hidden, setHidden] = useState(false)
  const [prevTab, setPrevTab] = useState(activeTab)
  const reduceMotion = useReducedMotion()

  // When activeTab changes, show the topbar immediately.
  // This is the React-idiomatic way to reset state on prop changes:
  // calling setState during render (not in an effect) makes React discard
  // the current render and re-run with the updated state synchronously,
  // avoiding the cascading-render problem of calling setState inside an effect.
  if (prevTab !== activeTab) {
    setPrevTab(activeTab)
    setHidden(false)
  }

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target || typeof target.scrollTop === "undefined") return

      // Detect if scroll event comes from either profile or chat panel containers
      const isProfileScroll = target.id === scrollId
      const isChatScroll = target.closest?.("[role='log']") || target.getAttribute?.("role") === "log"

      if (!isProfileScroll && !isChatScroll) return

      const currentScrollY = target.scrollTop
      // Hide when scrolling down more than 40px, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        setHidden(true)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 40) {
        setHidden(false)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    return () => window.removeEventListener("scroll", handleScroll, { capture: true })
  }, [activeTab])

  return (
    // LazyMotion is provided by the parent page.tsx — no need for a wrapper here.
    <m.header
      variants={headerVariants}
      initial={false}
      animate={hidden && !reduceMotion ? "hidden" : "visible"}
      style={{ willChange: "transform" }}
      className="fixed top-0 z-50 flex h-14 w-screen shrink-0 items-center justify-between px-4 py-2 lg:hidden"
    >
      <div className="flex w-full items-center justify-between gap-4">
        {onTabChange ? (
          <LayoutGroup id="topbar-tabs">
            <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabType)}>
              <TabsList className="relative rounded-full bg-card/90 px-2 py-1 backdrop-blur-lg group-data-horizontal/tabs:h-9.5">
                <TabsTrigger value="profile" className="relative rounded-full">
                  <span className="relative z-10">Resumen</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="relative rounded-full">
                  <span className="relative z-10">Chat</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </LayoutGroup>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-base leading-tight font-semibold tracking-tight text-foreground">
              Daniel González
            </span>
          </div>
        )}

        <div className="flex shrink-0 items-center">
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </m.header>
  )
}
