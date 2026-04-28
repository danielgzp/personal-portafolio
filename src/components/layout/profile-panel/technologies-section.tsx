import {
  DockerIcon,
  EslintIcon,
  FigmaIcon,
  JavascriptIcon,
  MotionIcon,
  NextjsIcon,
  NodejsIcon,
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
import { sectionVariants, EASE_PREMIUM, SPRING_BOUNCY, SPRING_SNAPPY } from "@/lib/animations"

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
  { icon: DockerIcon, name: "Docker" },
  { icon: EslintIcon, name: "ESLint" },
  { icon: FigmaIcon, name: "Figma" },
]

// Tech icon specific animation
const iconVariants: Variants = {
  hover: {
    scale: 1.2,
    rotate: 12,
    transition: SPRING_BOUNCY,
  },
}

// Stagger wrapper for badges (tight cadence = waterfall feel)
const badgesVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

// Individual skill badge
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_PREMIUM },
  },
  hover: {
    y: -2,
    scale: 1.04,
    transition: SPRING_SNAPPY,
  },
  tap: {
    scale: 0.95,
  },
}

export function TechnologiesSection() {
  const reduceMotion = useReducedMotion()

  return (
    <m.div variants={sectionVariants} className="space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Tecnologías Core</h3>
      {/* Nested stagger — badges cascade in like a waterfall */}
      <m.div variants={badgesVariants} className="flex flex-wrap gap-1.5 lg:gap-2">
        {SKILLS.map((tech) => (
          <m.div
            key={tech.name}
            variants={badgeVariants}
            whileHover={reduceMotion ? {} : "hover"}
            whileTap={reduceMotion ? {} : "tap"}
          >
            <Badge
              variant="outline"
              className="mr-0.5 h-6.5 cursor-default border-dashed bg-card px-2 py-1 select-none"
            >
              <m.span variants={iconVariants} className="flex [&>svg]:size-4">
                <tech.icon />
              </m.span>
              {tech.name}
            </Badge>
          </m.div>
        ))}
      </m.div>
    </m.div>
  )
}
