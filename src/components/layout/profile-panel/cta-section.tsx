"use client"

import { GithubIcon, LinkedinIcon } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SPRING_INTERACTIVE } from "@/lib/animations"
import { m, Variants } from "framer-motion"
import { DownloadIcon, MailIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface CTAProps {
  variants: Variants
  reduceMotion: boolean | null
  className?: string
  showBorder?: boolean
}

const CV_OPTIONS = [
  { filename: "CV_2026_DanielGonzalez.pdf", flag: "🇪🇸", href: "/CV_2026_DanielGonzalez.pdf" },
  { filename: "CV_EN_2026_DanielGonzalez.pdf", flag: "🇺🇸", href: "/CV_EN_2026_DanielGonzalez.pdf" },
] as const

const links = [
  { name: "LinkedIn", url: "https://linkedin.com/in/danielgzp", icon: LinkedinIcon },
  { name: "GitHub", url: "https://github.com/danielgzp", icon: GithubIcon },
  { name: "Email", url: "mailto:danielgzp01@gmail.com", icon: MailIcon },
]

export function CTASection({ variants, reduceMotion, className, showBorder = true }: CTAProps) {
  const t = useTranslations("profile")

  return (
    <m.div
      variants={variants}
      className={`flex w-full flex-row items-center justify-center gap-1.5 sm:justify-start sm:gap-2 ${
        showBorder ? "border-t border-border/50 pt-6" : ""
      } ${className || ""}`}
    >
      {/* CV Download button with language dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex h-9 w-full flex-1 gap-1.5 px-3 text-xs transition-all duration-200 hover:scale-[1.03] hover:border-primary hover:shadow-md active:scale-[0.97] sm:h-10 sm:w-auto sm:px-4 sm:text-sm lg:flex-initial xl:px-5"
            size="lg"
          >
            <m.span
              className="inline-flex"
              animate={reduceMotion ? {} : { y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              <DownloadIcon className="size-4 xl:size-4.5" />
            </m.span>
            {t("download_cv")}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-72">
          {CV_OPTIONS.map(({ filename, flag, href }) => (
            <DropdownMenuItem key={filename} asChild>
              <Link href={href} target="_blank" rel="noopener noreferrer" prefetch={false}>
                <span className="text-base leading-none">{flag}</span>
                <span>{filename}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Premium Spring-driven Social Link Buttons */}
      {links.map((link, idx) => (
        <m.div
          key={idx}
          whileHover={reduceMotion ? {} : { scale: 1.05, rotate: 2, y: -3 }}
          whileTap={reduceMotion ? {} : { scale: 0.95, rotate: -1, y: -1 }}
          transition={SPRING_INTERACTIVE}
          className="group shrink-0"
        >
          <Button
            asChild
            className="size-9 shrink-0 rounded-full border-2 border-dashed border-border bg-card shadow-md transition-colors duration-300 group-hover:border-primary sm:size-10 sm:border"
            variant="secondary"
            size="icon-lg"
          >
            <Link href={link.url} target="_blank" rel="noopener noreferrer">
              <link.icon className="size-4 xl:size-4.5" />
              <span className="sr-only">{link.name}</span>
            </Link>
          </Button>
        </m.div>
      ))}
    </m.div>
  )
}
