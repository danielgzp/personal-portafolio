"use client"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import { type Variants, m, useReducedMotion } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { CTASection } from "./cta-section"

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCE_ITEMS = [
  {
    id: 1,
    company: "Essertech LLC",
    role: "Lead Frontend Developer",
    location: "Cabudare, Venezuela",
    date: "Marzo 2025 — Actualidad",
    description:
      "Lideré el desarrollo end-to-end de un ERP para ISP. Creé el System Design con estándares Pixel Perfect y definí la arquitectura modular. Integré IA para acelerar el desarrollo en un 45%.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI", "System Design"],
  },
  {
    id: 2,
    company: "Essertech LLC",
    role: "Junior Frontend Developer",
    location: "Cabudare, Venezuela",
    date: "Agosto 2023 — Marzo 2025",
    description:
      "Desarrollé una plataforma financiera en tiempo real, optimicé la UI/UX y rendimiento de un SaaS existente, y construí desde cero un marketplace multi-tenant global.",
    skills: ["React", "Next.js", "Zustand", "Supabase", "i18n"],
  },
  {
    id: 3,
    company: "Grupo Corporativo Marna",
    role: "Software Developer",
    location: "Barquisimeto, Venezuela",
    date: "Agosto 2022 — Noviembre 2022",
    description:
      "Mejoré la usabilidad, rediseñé la interfaz e internacionalicé un sistema de citas para spas. También desarrollé su landing page comercial.",
    skills: ["PHP", "PostgreSQL", "HTML5", "CSS"],
  },
]

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

// ─── Ease curve used by Vercel, Linear, Framer's own site.
// Starts gentle, surges mid-curve, lands softly — feels intentional, not robotic.
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as [number, number, number, number]

// Level 1: top-level page stagger
const pageVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.05,
    },
  },
}

// Level 2: each section fades + rises with a short, snappy movement
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_PREMIUM },
  },
}

// Avatar: spring physics for an organic, weighted feel
const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
}

// Individual experience card — used with whileInView
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_PREMIUM },
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
}

// Stagger wrapper for badges (tight cadence = waterfall feel)
const badgesVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfilePanel() {
  const reduceMotion = useReducedMotion()
  const motionState = reduceMotion ? "visible" : "hidden"

  // Ref to the scroll viewport — used as IntersectionObserver root so that
  // whileInView triggers relative to the panel's scroll position, not the window.
  const containerRef = useRef<Element | null>(null)
  useEffect(() => {
    containerRef.current = document.getElementById("profile-scroll-container")
  }, [])

  return (
    <div className="relative size-full bg-background">
      {/* Minimalist grid */}
      <div className="absolute inset-0 z-0 h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50 dark:opacity-40" />
      {/* Radial fade mask */}
      <div className="absolute inset-0 z-0 bg-background mask-[radial-gradient(ellipse_100%_90%_at_50%_0%,transparent_15%,black)]" />

      <ScrollArea type="always" className="relative z-10 size-full" viewportId="profile-scroll-container">
        {/*
          Single m.div orchestrator — all sections below are direct children
          so pageVariants.staggerChildren controls the cascade timing.
          LazyMotion context is provided by the parent page.tsx.
        */}
        <m.div
          className="mx-auto flex h-full flex-col gap-8 p-6 pt-20 md:p-12"
          variants={pageVariants}
          initial={motionState}
          animate="visible"
        >
          {/* ── Hero ── */}
          <m.div variants={sectionVariants} className="flex flex-col space-y-4 lg:space-y-6">
            <m.div variants={avatarVariants} initial={false}>
              <Avatar className="size-18 border lg:size-24">
                <AvatarImage src="/images/avatar.jpg" alt="Daniel González" asChild>
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
            <CTASection
              variants={sectionVariants}
              reduceMotion={reduceMotion}
              containerRef={containerRef}
              showBorder={false}
            />
          </m.div>

          {/* ── Top CTA ── */}

          {/* ── Bio ── */}
          <m.div variants={sectionVariants} className="leading-relaxed text-foreground">
            <p className="text-sm text-pretty lg:md:text-base">
              Soy desarrollador de software con más de 3 años de experiencia, enfocado principalmente en el ecosistema
              de React y Next.js. Me considero un perfil muy orientado a producto; mi meta no es solo hacer código
              limpio, si no entender bien el negocio para construir arquitecturas que escalen y resuelvan problemas
              reales. Me apasiona tomar un proyecto desde que es una idea hasta llevarlo a producción.
            </p>
          </m.div>

          {/* ── Skills ── */}
          <m.div variants={sectionVariants} className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Tecnologías Core</h3>
            {/* Nested stagger — badges cascade in like a waterfall */}
            <m.div variants={badgesVariants} className="flex flex-wrap gap-1.5 lg:gap-2">
              {SKILLS.map((tech) => (
                <m.div key={tech.name} variants={badgeVariants}>
                  <Badge variant="outline" className="mr-0.5 h-6.5 border-dashed bg-card px-2 py-1 [&>svg]:size-4">
                    <tech.icon />
                    {tech.name}
                  </Badge>
                </m.div>
              ))}
            </m.div>
          </m.div>

          {/* ── Experience ── */}
          {/* Section title is part of the cascade; cards use whileInView
              so they animate in as the user scrolls down, not all at once. */}
          <m.div variants={sectionVariants} className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Experiencia Laboral</h3>
            <Timeline defaultValue={EXPERIENCE_ITEMS.length + 1}>
              {EXPERIENCE_ITEMS.map((item, idx) => (
                <TimelineItem key={item.id} step={item.id} className="not-last:pb-6!">
                  <TimelineSeparator />
                  <TimelineIndicator />
                  <m.div
                    variants={cardVariants}
                    initial={reduceMotion ? "visible" : "hidden"}
                    whileInView="visible"
                    viewport={{
                      once: true,
                      root: containerRef as React.RefObject<Element>,
                      amount: 0.15,
                      margin: "0px 0px -40px 0px",
                    }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/90 p-6 shadow-sm transition-colors hover:bg-card/50"
                  >
                    <TimelineHeader className="w-full pb-0">
                      <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="flex flex-col">
                          <TimelineTitle className="text-base font-bold text-foreground">{item.company}</TimelineTitle>
                          <span className="text-sm font-medium text-muted-foreground">{item.role}</span>
                        </div>
                        <div className="flex flex-col sm:text-right">
                          <span className="text-sm font-bold text-foreground">{item.location}</span>
                          <TimelineDate className="!mb-0 !text-sm !font-medium text-muted-foreground italic">
                            {item.date}
                          </TimelineDate>
                        </div>
                      </div>
                    </TimelineHeader>
                    <TimelineContent className="space-y-4 leading-relaxed text-muted-foreground">
                      <p className="text-sm">{item.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="h-6 rounded-full border border-dashed border-border px-2.5 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TimelineContent>
                  </m.div>
                </TimelineItem>
              ))}
            </Timeline>
          </m.div>

          {/* ── CTA Footer ── */}
          <CTASection
            variants={sectionVariants}
            reduceMotion={reduceMotion}
            containerRef={containerRef}
            className="mt-auto"
          />
        </m.div>
      </ScrollArea>
    </div>
  )
}
