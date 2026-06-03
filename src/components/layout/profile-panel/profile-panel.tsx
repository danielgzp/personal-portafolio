import { m, useReducedMotion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CTASection } from "./cta-section"
import { ExperienceSection } from "./experience-section"
import { HeroSection } from "./hero-section"
import { TechnologiesSection } from "./technologies-section"
import { pageVariants, sectionVariants } from "@/lib/animations"
import { UnderlinedTitle } from "@/components/ui/underlined-title"

export function ProfilePanel() {
  const t = useTranslations("profile")
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative size-full bg-background">
      {/* Minimalist grid */}
      <div className="absolute inset-0 z-0 h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50 dark:opacity-40" />
      {/* Radial fade mask */}
      <div className="absolute inset-0 z-0 bg-background mask-[radial-gradient(ellipse_100%_90%_at_50%_0%,transparent_15%,black)]" />

      {/*
          Keep pt-20 on mobile & md to prevent fixed Topbar (h-14) overlap,
          reverting to pt-12 (via lg:pt-12) only on desktop screens where
          the Topbar is hidden.
       */}
      <m.div
        id="profile-scroll-container"
        variants={pageVariants}
        initial={reduceMotion ? "visible" : "hidden"}
        animate="visible"
        className="relative z-10 mx-auto flex size-full min-h-full flex-col gap-4 overflow-y-auto p-6 pt-20 sm:gap-y-6 md:p-12 md:pt-20 lg:gap-y-8 lg:gap-y-10 lg:p-8 lg:pt-12 xl:p-12 xl:pt-12"
      >
        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Bio ── */}
        <m.div variants={sectionVariants} className="flex flex-col gap-3">
          <UnderlinedTitle>{t("about_title")}</UnderlinedTitle>
          <p className="text-sm leading-relaxed text-pretty text-foreground md:text-base">
            {t.rich("about", {
              highlight: (chunks) => <span className="font-medium text-primary/65">{chunks}</span>,
            })}
          </p>
        </m.div>

        {/* ── Technologies ── */}
        <TechnologiesSection />

        {/* ── Experience ── */}
        <m.div variants={sectionVariants} className="w-full min-w-0">
          <ExperienceSection />
        </m.div>

        {/* ── CTA Footer ── */}
        <CTASection variants={sectionVariants} reduceMotion={reduceMotion} className="mt-auto" />
      </m.div>
    </div>
  )
}
