"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/lang/routing"
import { type Variants, m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { ArrowLeft } from "lucide-react"

// Stagger children transition variants for clean entry
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.08,
    },
  },
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

export default function NotFound() {
  const t = useTranslations("not_found")

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4">
      {/* Interactive premium background gradient */}
      <BackgroundGradientAnimation interactive={true} />

      {/* Main glassmorphism card - More minimalist & elegant */}
      <m.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex w-full max-w-lg flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl backdrop-blur-xl lg:p-10 dark:border-white/5 dark:bg-black/30"
      >
        {/* Sleek and architectural 404 number */}
        <m.h1
          variants={childVariants}
          className="font-mono text-7xl font-semibold tracking-tight text-foreground/90 select-none sm:text-8xl"
        >
          {t("subtitle")}
        </m.h1>

        {/* Heading - Minimalist, clear spacing */}
        <m.h2 variants={childVariants} className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {t("heading")}
        </m.h2>

        {/* Description - Sleek text width and color */}
        <m.p variants={childVariants} className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-sm">
          {t("description")}
        </m.p>

        {/* Go back action button */}
        <m.div variants={childVariants} className="mt-6 w-full">
          <Button
            asChild
            size="lg"
            variant="default"
            className="group w-full rounded-full px-6 py-5 text-xs font-semibold shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/10 sm:w-auto"
          >
            <Link href="/">
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              {t("button")}
            </Link>
          </Button>
        </m.div>
      </m.div>
    </div>
  )
}
