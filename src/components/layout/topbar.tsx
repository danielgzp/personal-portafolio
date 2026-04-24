"use client"

import { type Variants, m, LayoutGroup, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import type { TabType } from "@/app/page"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Module-level variants — defined once, never recreated on re-renders.
// Each variant carries its own transition for asymmetric easing:
//   hide → fast ease-in  (quick dismissal, non-distracting)
//   show → slower ease-out (deliberate reveal, user needs to read it)
const headerVariants: Variants = {
  visible: {
    y: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] }, // ease-in
  },
  hidden: {
    y: "-100%",
    transition: { duration: 0.2, ease: "easeInOut" }, // ease-in
  },
}

// Tab pill spring — module-level so it's not inlined per render
const pillTransition = { type: "spring", damping: 28, stiffness: 300 } as const

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
    const scrollId = activeTab === "chat" ? "chat-scroll-container" : "profile-scroll-container"
    const el = document.getElementById(scrollId)
    if (!el) return

    let lastScrollY = el.scrollTop

    const handleScroll = () => {
      const currentScrollY = el.scrollTop
      // Hide when scrolling down more than 50px, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setHidden(false)
      }
      lastScrollY = currentScrollY
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [activeTab])

  return (
    // LazyMotion is provided by the parent page.tsx — no need for a wrapper here.
    <m.header
      variants={headerVariants}
      initial={false}
      animate={hidden && !reduceMotion ? "hidden" : "visible"}
      style={{ willChange: "transform" }}
      className="fixed top-0 z-50 flex h-14 w-screen shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2 backdrop-blur-lg lg:hidden"
    >
      <div className="flex w-full items-center justify-between gap-4">
        {onTabChange ? (
          <LayoutGroup id="topbar-tabs">
            <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabType)}>
              <TabsList className="relative rounded-full bg-muted/50 px-2 py-0.5">
                <TabsTrigger
                  value="profile"
                  className="relative rounded-full data-active:bg-transparent! data-active:shadow-none! dark:data-active:bg-transparent!"
                >
                  {activeTab === "profile" && (
                    <m.div
                      layoutId="topbar-active-tab"
                      className="absolute inset-0 rounded-full bg-background shadow-sm"
                      style={{ willChange: "transform" }}
                      transition={pillTransition}
                    />
                  )}
                  <span className="relative z-10">Resumen</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="relative rounded-full data-active:bg-transparent! data-active:shadow-none! dark:data-active:bg-transparent!"
                >
                  {activeTab === "chat" && (
                    <m.div
                      layoutId="topbar-active-tab"
                      className="absolute inset-0 rounded-full bg-background shadow-sm"
                      style={{ willChange: "transform" }}
                      transition={pillTransition}
                    />
                  )}
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
          <ThemeSwitcher />
        </div>
      </div>
    </m.header>
  )
}
