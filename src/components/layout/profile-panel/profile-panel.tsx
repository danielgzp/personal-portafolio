import { ScrollArea } from "@/components/ui/scroll-area"
import { m, useReducedMotion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CTASection } from "./cta-section"
import { ExperienceSection } from "./experience-section"
import { HeroSection } from "./hero-section"
import { TechnologiesSection } from "./technologies-section"
import { sectionVariants } from "@/lib/animations"

export function ProfilePanel() {
  const t = useTranslations("profile")
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative size-full bg-background">
      {/* Minimalist grid */}
      <div className="absolute inset-0 z-0 h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50 dark:opacity-40" />
      {/* Radial fade mask */}
      <div className="absolute inset-0 z-0 bg-background mask-[radial-gradient(ellipse_100%_90%_at_50%_0%,transparent_15%,black)]" />

      <ScrollArea viewportId="profile-scroll-container" className="relative z-10 size-full">
        {/*
            Keep pt-20 on mobile & md to prevent fixed Topbar (h-14) overlap,
            reverting to pt-12 (via lg:pt-12) only on desktop screens where
            the Topbar is hidden.
         */}
        <div className="mx-auto flex h-full flex-col gap-8 p-6 pt-20 md:p-12 md:pt-20 lg:p-8 lg:pt-12 xl:p-12 xl:pt-12">
          {/* ── Hero ── */}
          <HeroSection />

          {/* ── Bio ── */}
          <m.div
            variants={sectionVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="leading-relaxed text-foreground"
          >
            <p className="text-sm text-pretty md:text-base">{t("about")}</p>
          </m.div>

          {/* ── Technologies ── */}
          <TechnologiesSection />

          {/* ── Experience ── */}
          <ExperienceSection />

          {/* ── CTA Footer ── */}
          <CTASection variants={sectionVariants} reduceMotion={reduceMotion} className="mt-auto" />
        </div>
      </ScrollArea>
    </div>
  )
}
