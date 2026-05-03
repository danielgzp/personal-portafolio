import { Button } from "@/components/ui/button"
import { GithubIcon, LinkedinIcon } from "@/assets/icons"
import { m, Variants } from "framer-motion"
import { MailIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { SPRING_INTERACTIVE, SPRING_TAP } from "@/lib/animations"

interface CTAProps {
  variants: Variants
  reduceMotion: boolean | null
  className?: string
  showBorder?: boolean
}

const links = [
  { name: "LinkedIn", url: "https://linkedin.com/in/danielgzp", icon: LinkedinIcon },
  { name: "GitHub", url: "https://github.com/danielgzp", icon: GithubIcon },
  { name: "Email", url: "mailto:danielgzp01@gmail.com", icon: MailIcon },
]

export function CTASection({ variants, reduceMotion, className, showBorder = true }: CTAProps) {
  const t = useTranslations("profile")
  const locale = useLocale()

  const cvRef = locale === "en" ? "/CV_EN_2026_DanielGonzalez.pdf" : "/CV_2026_DanielGonzalez.pdf"

  return (
    <m.div
      variants={variants}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className={`flex w-full flex-row justify-center gap-2 sm:justify-start ${
        showBorder ? "border-t border-border/50 pt-6" : ""
      } ${className || ""}`}
    >
      {/* Premium Spring-driven CV Button with subtle breathing icon cue */}
      <m.div
        whileHover={reduceMotion ? {} : { scale: 1.05, rotate: 1, y: -3 }}
        whileTap={reduceMotion ? {} : { scale: 0.95, rotate: -0.5, y: -1 }}
        transition={SPRING_INTERACTIVE}
        className="flex flex-1 sm:flex-initial group"
      >
        <Button
          className="mr-2 flex w-full flex-1 gap-2 transition-colors duration-300 hover:shadow-md sm:w-auto lg:flex-initial group-hover:border-primary"
          size="lg"
          asChild
        >
          <Link href={cvRef} target="_blank" rel="noopener noreferrer" prefetch={false}>
            <m.span
              className="inline-flex"
              animate={reduceMotion ? {} : { y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              <DownloadIcon className="size-4" />
            </m.span>
            {t("download_cv")}
          </Link>
        </Button>
      </m.div>

      {/* Premium Spring-driven Social Link Buttons */}
      {links.map((link, idx) => (
        <m.div
          key={idx}
          whileHover={reduceMotion ? {} : { scale: 1.05, rotate: 2, y: -3 }}
          whileTap={reduceMotion ? {} : { scale: 0.95, rotate: -1, y: -1 }}
          transition={SPRING_INTERACTIVE}
          className="shrink-0 group"
        >
          <Button
            asChild
            className="shrink-0 rounded-full border border-dashed border-border bg-card shadow-md transition-colors duration-300 group-hover:border-primary"
            variant="secondary"
            size="icon-lg"
          >
            <Link href={link.url} target="_blank" rel="noopener noreferrer">
              <link.icon className="size-4" />
              <span className="sr-only">{link.name}</span>
            </Link>
          </Button>
        </m.div>
      ))}
    </m.div>
  )
}
