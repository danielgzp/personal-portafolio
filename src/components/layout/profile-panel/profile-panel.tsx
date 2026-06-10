import { m, useReducedMotion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CTASection } from "./cta-section"
import { ExperienceSection } from "./experience-section"
import { HeroSection } from "./hero-section"
import { TechnologiesSection } from "./technologies-section"
import { pageVariants, sectionVariants } from "@/lib/animations"
import { UnderlinedTitle } from "@/components/ui/underlined-title"
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

export function ProfilePanel() {
  const t = useTranslations("profile")
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative size-full bg-background">
      {/* Minimalist grid */}

      {/*
          Keep pt-20 on mobile & md to prevent fixed Topbar (h-14) overlap,
          reverting to pt-12 (via lg:pt-12) only on desktop screens where
          the Topbar is hidden.
       */}
      {/* <BackgroundGradientAnimation containerClassName="absolute inset-0" /> */}
      {/* <DottedGlowBackground
        className=""
        opacity={0.75}
        gap={40}
        radius={0.5}
        colorLightVar="--foreground"
        colorDarkVar="--foreground"
        glowColorLightVar="--primary"
        glowColorDarkVar="--primary"
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(var(--primary),0.08),transparent)]" /> */}
      <m.div
        id="profile-scroll-container"
        variants={pageVariants}
        initial={reduceMotion ? "visible" : "hidden"}
        animate="visible"
        className="relative z-10 mx-auto flex size-full min-h-full flex-col gap-y-8 overflow-y-auto p-6 pt-18 md:p-12 md:pt-20 lg:p-8 lg:pt-12 xl:p-12 xl:pt-12"
      >
        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Bio ── */}
        <m.div variants={sectionVariants} className="flex flex-col gap-3">
          <UnderlinedTitle>{t("about_title")}</UnderlinedTitle>
          <p className="text-sm leading-relaxed text-pretty text-foreground md:text-base xl:text-base">
            {t.rich("about", {
              highlight: (chunks) => <span className="font-semibold text-primary">{chunks}</span>,
            })}
          </p>
        </m.div>

        {/* ── Technologies ── */}
        <TechnologiesSection />

        {/* ── Experience ── */}
        <div className="w-full min-w-0">
          <ExperienceSection />
        </div>

        {/* ── CTA Footer ── */}
        <CTASection variants={sectionVariants} reduceMotion={reduceMotion} className="mt-auto" />
      </m.div>
    </div>
  )
}
