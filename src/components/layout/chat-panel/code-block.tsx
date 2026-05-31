import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml } from "shiki"
import { cn } from "@/lib/utils"

type Props = {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = "tsx", className }: Props) {
  const [html, setHtml] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")

    codeToHtml(code, {
      lang: language,
      theme: isDark ? "github-dark" : "github-light",
    })
      .then((out) => {
        if (!cancelled) setHtml(out)
      })
      .catch(() => {
        if (!cancelled) setHtml(`<pre>${escapeHtml(code)}</pre>`)
      })

    return () => {
      cancelled = true
    }
  }, [code, language])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("group bg-code-bg relative my-3 overflow-hidden rounded-xl border border-border", className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">{language}</span>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <Check className="size-3.5" /> Copiado
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copiar
            </>
          )}
        </button>
      </div>
      <div
        className="overflow-x-auto px-4 py-3 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
        dangerouslySetInnerHTML={{ __html: html || `<pre>${escapeHtml(code)}</pre>` }}
      />
    </div>
  )
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
