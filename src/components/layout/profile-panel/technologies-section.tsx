import {
  DockerIcon,
  EslintIcon,
  FigmaIcon,
  JavascriptIcon,
  MotionIcon,
  NextjsIcon,
  NodejsIcon,
  PostgreSQLIcon,
  ReactIcon,
  ShadcnIcon,
  SupabaseIcon,
  TailwindIcon,
  TypescriptIcon,
  ZodIcon,
  ZustandIcon,
} from "@/assets/icons"
import { Badge } from "@/components/ui/badge"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { sectionVariants, EASE_PREMIUM, SPRING_BOUNCY, SPRING_INTERACTIVE, SPRING_TAP } from "@/lib/animations"
import { useTranslations } from "next-intl"
import { UnderlinedTitle } from "@/components/ui/underlined-title"

const SKILLS = [
  { icon: ReactIcon, name: "React" },
  { icon: NextjsIcon, name: "Next.js" },
  { icon: NodejsIcon, name: "Node.js" },
  { icon: TailwindIcon, name: "Tailwind CSS" },
  { icon: JavascriptIcon, name: "JavaScript" },
  { icon: TypescriptIcon, name: "TypeScript" },
  { icon: ShadcnIcon, name: "Shadcn/UI" },
  { icon: MotionIcon, name: "Framer Motion" },
  { icon: ZustandIcon, name: "Zustand" },
  { icon: ZodIcon, name: "Zod" },
  { icon: SupabaseIcon, name: "Supabase" },
  { icon: PostgreSQLIcon, name: "PostgreSQL" },
  { icon: DockerIcon, name: "Docker" },
  { icon: EslintIcon, name: "ESLint" },
  { icon: FigmaIcon, name: "Figma" },
]

// Tech icon specific animation
const iconVariants: Variants = {
  hover: {
    scale: 1.15,
    rotate: 8,
    transition: SPRING_BOUNCY,
  },
}

// Individual skill badge — enters with a slow, floating reveal staggered by index
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 16 },
  visible: (idx: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_PREMIUM, delay: idx * 0.07 },
  }),
  hover: {
    scale: 1.05,
    rotate: 2,
    y: -3,
    transition: SPRING_INTERACTIVE,
  },
  tap: {
    scale: 0.96,
    rotate: -1,
    y: -1,
    transition: SPRING_TAP,
  },
}

export function TechnologiesSection() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("profile")

  return (
    <m.div variants={sectionVariants} className="space-y-4">
      <UnderlinedTitle>{t("core_technologies")}</UnderlinedTitle>
      {/* Each badge controls its own entrance — staggered by index via custom prop */}
      <div className="flex flex-wrap gap-1.5 lg:gap-2">
        {SKILLS.map((tech, idx) => (
          <m.div
            key={tech.name}
            variants={badgeVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={idx}
            whileHover={reduceMotion ? {} : "hover"}
            whileTap={reduceMotion ? {} : "tap"}
            className="group"
          >
            <Badge
              variant="outline"
              className="mr-0.5 h-6.5 cursor-default border-dashed bg-card px-2 py-1 transition-colors duration-300 select-none group-hover:border-primary xl:gap-x-1.5 xl:px-2.5 xl:py-1.5 xl:text-sm"
            >
              <m.span variants={iconVariants} className="flex [&>svg]:size-4 xl:[&>svg]:size-4.5">
                <tech.icon />
              </m.span>
              {tech.name}
            </Badge>
          </m.div>
        ))}
      </div>
    </m.div>
  )
}
