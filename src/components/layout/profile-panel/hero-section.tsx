import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { CTASection } from "./cta-section"
import { sectionVariants, SPRING_SOFT } from "@/lib/animations"

// Avatar: spring physics for an organic, weighted feel
const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING_SOFT,
  },
}

export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <m.div variants={sectionVariants} className="flex flex-col space-y-4 lg:space-y-6">
      <m.div variants={avatarVariants} initial={false}>
        <Avatar className="size-18 border lg:size-24">
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
          <AvatarFallback className="bg-muted/50 text-xl font-bold text-muted-foreground lg:text-2xl">
            DG
          </AvatarFallback>
        </Avatar>
      </m.div>

      <div className="flex w-full flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Daniel González</h1>
        <h2 className="text-xl font-semibold text-foreground">Frontend Engineer</h2>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          <span>Cabudare, Venezuela</span>
        </div>
      </div>
      <CTASection variants={sectionVariants} reduceMotion={reduceMotion} showBorder={false} />
    </m.div>
  )
}
