"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/d4sh-ctrl")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Glassmorphism card matching modern portfolio aesthetics */}
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/40 dark:bg-black/40 p-8 shadow-xl backdrop-blur-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Panel de Control
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-white/50 dark:bg-neutral-950/50"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-white/50 dark:bg-neutral-950/50"
          />

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4 text-current" />
                Iniciando...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
