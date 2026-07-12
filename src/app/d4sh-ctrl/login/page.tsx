"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/lang/routing"
import { m, useReducedMotion } from "framer-motion"
import { NextIntlClientProvider } from "next-intl"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const reduceMotion = useReducedMotion()

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
    <div className="flex min-h-screen w-full justify-center bg-background px-4 items-start pt-24 md:pt-36">
      <m.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)" }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={reduceMotion ? { duration: 0.2 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-4xl border border-border/50 bg-card p-8 shadow-md"
      >
        <div className="flex flex-col gap-6">
          <h1 className="text-center font-heading text-2xl font-bold tracking-tight text-foreground">
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
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-center text-destructive">{error}</p>
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

          <div className="flex justify-center border-t border-border/50 pt-4">
            <NextIntlClientProvider locale="es">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                Volver al portafolio
              </Link>
            </NextIntlClientProvider>
          </div>
        </div>
      </m.div>
    </div>
  )
}
