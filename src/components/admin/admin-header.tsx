"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LogOut, LayoutDashboard, MessageSquare } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/d4sh-ctrl/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/d4sh-ctrl"
            className="flex items-center gap-2 font-semibold tracking-tight text-foreground hover:opacity-85"
          >
            <LayoutDashboard className="size-5" />
            <span>Admin Panel</span>
            <span className="rounded-full bg-muted/30 px-2 py-0.5 text-xs font-normal text-muted-foreground">
              Analytics
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/?tab=chat">
            <Button variant="ghost" className="flex cursor-pointer items-center gap-2 hover:bg-muted/30">
              <MessageSquare className="size-4" />
              <span className="hidden sm:inline">Ir al chat</span>
            </Button>
          </Link>
          <ThemeSwitcher />
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 hover:bg-destructive/5! hover:text-destructive"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
