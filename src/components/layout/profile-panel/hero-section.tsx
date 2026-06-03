"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, MovingBorder } from "@/components/ui/moving-border"
import { sectionVariants, SPRING_INTERACTIVE, SPRING_SOFT, SPRING_TAP } from "@/lib/animations"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { MapPin, SparklesIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { CTASection } from "./cta-section"

// Avatar: spring physics with slight rotate + tactile scale feedback
const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: SPRING_SOFT,
  },
  hover: {
    scale: 1.05,
    rotate: 2,
    transition: SPRING_INTERACTIVE,
  },
  tap: {
    scale: 0.96,
    rotate: -1,
    transition: SPRING_TAP,
  },
}

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("profile")

  return (
    <m.div
      variants={sectionVariants}
      className="flex flex-col space-y-4 lg:space-y-6"
    >
      <m.div
        variants={avatarVariants}
        whileHover={reduceMotion ? {} : "hover"}
        whileTap={reduceMotion ? {} : "tap"}
        className="relative w-fit cursor-pointer"
      >
        {/* Diffuse radial glow orb — sits behind the border ring */}
        <div
          className="absolute -inset-3 -z-10 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* Solid primary ring — 3 px padding creates the visible border */}

        <Avatar className="size-18 border-2 border-primary/75 p-0.5 transition-colors duration-300 lg:size-20 xl:size-24">
          <AvatarImage src="/images/avatar.jpg" asChild>
            <Image
              src="/images/avatar.jpg"
              className="size-full object-cover"
              alt="Daniel González"
              width={96}
              height={96}
              priority
              loading="eager"
            />
          </AvatarImage>
          <AvatarFallback className="bg-muted/50 text-xl font-bold text-muted-foreground lg:text-xl xl:text-2xl">
            DG
          </AvatarFallback>
        </Avatar>
      </m.div>

      <div className="flex w-full flex-col gap-2">
        {/* Name + availability tag inline */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-3xl xl:text-4xl">Daniel González</h1>
          <div>
            <Button
              borderRadius="1.75rem"
              duration={5000}
              containerClassName="h-7 w-fit min-w-max lg:h-8"
              className="flex items-center gap-2 border-primary/10 bg-card px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm lg:text-sm"
              borderClassName="h-12 w-16 bg-[radial-gradient(var(--primary)_40%,transparent_60%)]"
            >
              <SparklesIcon className="size-3 text-primary" />
              {t("available")}
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground lg:text-lg xl:text-xl">Frontend Engineer</h2>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          <span>Cabudare, Venezuela</span>
        </div>
      </div>
      <CTASection variants={sectionVariants} reduceMotion={reduceMotion} showBorder={false} />
    </m.div>
  )
}
