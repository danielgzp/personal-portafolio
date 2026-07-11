"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LogOut, LayoutDashboard } from "lucide-react"
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
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/d4sh-ctrl" className="flex items-center gap-2 font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 hover:opacity-85">
            <LayoutDashboard className="size-5 text-neutral-600 dark:text-neutral-400" />
            <span>Admin Panel</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-normal">
              Analytics
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 cursor-pointer"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
