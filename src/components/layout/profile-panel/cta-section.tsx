import { Button } from "@/components/ui/button"
import { GithubIcon, LinkedinIcon } from "@/assets/icons"
import { m, Variants } from "framer-motion"
import { MailIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"

interface CTAProps {
  variants: Variants
  reduceMotion: boolean | null
  containerRef: React.RefObject<Element | null>
  className?: string
  showBorder?: boolean
}

const links = [
  { name: "LinkedIn", url: "https://linkedin.com/in/danielgzp", icon: LinkedinIcon },
  { name: "GitHub", url: "https://github.com/danielgzp", icon: GithubIcon },
  { name: "Email", url: "mailto:danielgzp01@gmail.com", icon: MailIcon },
]

export function CTASection({ variants, reduceMotion, containerRef, className, showBorder = true }: CTAProps) {
  return (
    <m.div
      variants={variants}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        root: containerRef as React.RefObject<Element>,
        amount: 0.5,
      }}
      className={`flex w-full flex-row justify-center gap-2 sm:justify-start ${
        showBorder ? "border-t border-border/50 pt-6" : ""
      } ${className || ""}`}
    >
      <Button
        className="mr-2 flex flex-1 gap-2 transition-all hover:scale-105 hover:shadow-lg sm:w-auto lg:flex-initial"
        size="lg"
        asChild
      >
        <Link href="/CV-2026-DanielGonzalez.pdf" target="_blank" rel="noopener noreferrer" prefetch={false}>
          <DownloadIcon className="size-4" />
          Descargar CV
        </Link>
      </Button>

      {links.map((link, idx) => (
        <Button
          asChild
          className="shrink-0 rounded-full border border-dashed border-border bg-card shadow-lg transition-all hover:scale-110 active:scale-95"
          key={idx}
          variant="secondary"
          size="icon-lg"
        >
          <Link href={link.url} target="_blank" rel="noopener noreferrer">
            <link.icon className="size-4" />
            <span className="sr-only">{link.name}</span>
          </Link>
        </Button>
      ))}
    </m.div>
  )
}
