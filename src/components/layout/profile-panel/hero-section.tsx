import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { CTASection } from "./cta-section"
import { sectionVariants, SPRING_SOFT, SPRING_INTERACTIVE, SPRING_TAP } from "@/lib/animations"

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
    borderColor: "var(--primary)",
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

  return (
    <m.div
      variants={sectionVariants}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="flex flex-col space-y-4 lg:space-y-6"
    >
      <m.div
        variants={avatarVariants}
        whileHover={reduceMotion ? {} : "hover"}
        whileTap={reduceMotion ? {} : "tap"}
        className="w-fit"
      >
        <Avatar className="size-18 border lg:size-20 xl:size-24 cursor-pointer transition-colors duration-300">
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
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-3xl xl:text-4xl">Daniel González</h1>
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
