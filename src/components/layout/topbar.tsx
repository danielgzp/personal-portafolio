"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { LeftPanel } from "./left-panel"

export function Topbar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = document.getElementById("chat-scroll-container")
    if (!el) return

    let lastScrollY = el.scrollTop

    const handleScroll = () => {
      const currentScrollY = el.scrollTop
      // Ocultar si bajamos más de 50px, mostrar si subimos o estamos hasta arriba
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setHidden(false)
      }
      lastScrollY = currentScrollY
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 z-50 flex h-16 w-screen shrink-0 items-center justify-between border-b border-border/40 bg-sidebar/90 px-4 py-2 backdrop-blur-lg lg:hidden"
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-10 border border-border/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <AvatarImage src="/images/avatar.jpg" />
          <AvatarFallback className="bg-muted text-[10px] font-medium">DG</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base leading-tight font-semibold tracking-tight text-foreground">Daniel González</span>
          <span className="text-xs font-medium text-muted-foreground">Frontend Engineer</span>
        </div>
      </div>
      <div className="-mr-2 flex flex-row items-center gap-0">
        <ThemeSwitcher />
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="size-10">
              <Menu className="size-6 text-muted-foreground" strokeWidth={2} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full! p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">Resumen</SheetTitle>
            <LeftPanel />
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
