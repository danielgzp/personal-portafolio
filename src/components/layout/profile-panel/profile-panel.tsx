import { ScrollArea } from "@/components/ui/scroll-area"
import { m, useReducedMotion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CTASection } from "./cta-section"
import { ExperienceSection } from "./experience-section"
import { HeroSection } from "./hero-section"
import { TechnologiesSection } from "./technologies-section"
import { pageVariants, sectionVariants } from "@/lib/animations"

export function ProfilePanel() {
  const t = useTranslations("HomePage")
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative size-full bg-background">
      {/* Minimalist grid */}
      <div className="absolute inset-0 z-0 h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50 dark:opacity-40" />
      {/* Radial fade mask */}
      <div className="absolute inset-0 z-0 bg-background mask-[radial-gradient(ellipse_100%_90%_at_50%_0%,transparent_15%,black)]" />

      <ScrollArea className="relative z-10 size-full">
        <m.div
          className="mx-auto flex h-full flex-col gap-8 p-6 pt-20 md:p-12"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Hero ── */}
          <HeroSection />

          {/* ── Bio ── */}
          <m.div variants={sectionVariants} className="leading-relaxed text-foreground">
            <p className="text-sm text-pretty lg:md:text-base">
              Soy desarrollador de software con más de 3 años de experiencia, enfocado principalmente en el ecosistema
              de React y Next.js. Me considero un perfil muy orientado a producto; mi meta no es solo hacer código
              limpio, si no entender bien el negocio para construir arquitecturas que escalen y resuelvan problemas
              reales. Me apasiona tomar un proyecto desde que es una idea hasta llevarlo a producción.
            </p>
          </m.div>

          {/* ── Technologies ── */}
          <TechnologiesSection />

          {/* ── Experience ── */}
          <ExperienceSection />

          {/* ── CTA Footer ── */}
          <CTASection variants={sectionVariants} reduceMotion={reduceMotion} className="mt-auto" />
        </m.div>
      </ScrollArea>
    </div>
  )
}
