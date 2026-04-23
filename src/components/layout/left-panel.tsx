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
import { Button } from "@/components/ui/button"
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
import { motion } from "framer-motion"
import { DownloadIcon, Mail, MailIcon, MapPin } from "lucide-react"
import Link from "next/link"
import { LinkPreview } from "../ui/link-preview"
import link from "next/link"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

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

const EDUCATION_ITEMS = [
  {
    id: 1,
    degree: "Técnico Superior en Informática",
    institution: "Instituto Universitario Jesús Obrero",
    period: "Diciembre 2019 — Enero 2023",
    description: "Extensión Barquisimeto, Venezuela.",
  },
]

const SKILLS = [
  {
    icon: ReactIcon,
    name: "React",
  },
  {
    icon: NextjsIcon,
    name: "Next.js",
  },
  {
    icon: NodejsIcon,
    name: "Node.js",
  },
  {
    icon: TailwindIcon,
    name: "Tailwind CSS",
  },
  {
    icon: JavascriptIcon,
    name: "JavaScript",
  },
  {
    icon: TypescriptIcon,
    name: "TypeScript",
  },
  {
    icon: ShadcnIcon,
    name: "Shadcn/UI",
  },
  {
    icon: MotionIcon,
    name: "Framer Motion",
  },
  {
    icon: ZustandIcon,
    name: "Zustand",
  },
  {
    icon: ZodIcon,
    name: "Zod",
  },
  {
    icon: SupabaseIcon,
    name: "Supabase",
  },
  {
    icon: DockerIcon,
    name: "Docker",
  },
  {
    icon: EslintIcon,
    name: "ESLint",
  },
  {
    icon: FigmaIcon,
    name: "Figma",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const links = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/danielgzp",
    icon: LinkedinIcon,
  },
  {
    name: "GitHub",
    url: "https://github.com/danielgzp",
    icon: GithubIcon,
  },
  {
    name: "Email",
    url: "mailto:danielgzp01@gmail.com",
    icon: MailIcon,
  },
]

export function LeftPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* Minimalist Grid card */}
      <div className="absolute inset-0 z-0 h-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50 dark:opacity-30" />
      {/* Radial gradient mask to fade out the grid smoothly */}
      <div className="absolute inset-0 z-0 bg-background [mask-image:radial-gradient(ellipse_100%_90%_at_50%_0%,transparent_15%,black)]" />
      <ScrollArea className="relative z-10 h-full w-full">
        <div className="mx-auto flex h-full flex-col gap-8 p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-4 lg:space-y-6"
          >
            <Avatar className="size-18 border lg:size-24">
              <AvatarImage src="/images/avatar.jpg" alt="Daniel González" />
              <AvatarFallback className="bg-muted/50 text-xl font-bold text-muted-foreground lg:text-2xl">
                DG
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Daniel González</h1>
              <h2 className="text-xl font-semibold text-foreground lg:text-xl">Frontend Engineer</h2>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>Cabudare, Venezuela</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4 leading-relaxed text-balance text-foreground"
          >
            <p className="text-pretty">
              Soy desarrollador de software con más de 3 años de experiencia, enfocado principalmente en el ecosistema
              de React y Next.js. Me considero un perfil muy orientado a producto; mi meta no es solo hacer código
              limpio, si no entender bien el negocio para construir arquitecturas que escalen y resuelvan problemas
              reales. Me apasiona tomar un proyecto desde que es una idea hasta llevarlo a producción.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-foreground uppercase">Tecnologías Core</h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((tech, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="mr-0.5 h-6 border-dashed bg-card px-2 py-1 [&>svg]:size-4"
                >
                  <tech.icon />
                  {tech.name}
                </Badge>
              ))}
            </div>

            {/* <ThreeDMarqueeDemo /> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Experiencia Laboral</h3>
            <Timeline defaultValue={EXPERIENCE_ITEMS.length + 1}>
              {EXPERIENCE_ITEMS.map((item, index) => (
                <TimelineItem key={item.id} step={item.id} className="[&:not(:last-child)]:!pb-6">
                  <TimelineSeparator />
                  <TimelineIndicator />
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                    className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur transition-colors hover:bg-card/75"
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
                            className="rounded-full border border-border/50 bg-secondary/30 px-2 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase shadow-none hover:bg-secondary/50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TimelineContent>
                  </motion.div>
                </TimelineItem>
              ))}
            </Timeline>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">Educación</h3>
            <Timeline defaultValue={EDUCATION_ITEMS.length + 1}>
              {EDUCATION_ITEMS.map((edu, index) => (
                <TimelineItem key={edu.id} step={edu.id} className="[&:not(:last-child)]:!pb-6">
                  <TimelineSeparator />
                  <TimelineIndicator />
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex flex-col"
                  >
                    <TimelineHeader className="w-full pb-0">
                      <div className="flex flex-col">
                        <TimelineTitle className="text-base font-bold text-foreground">{edu.degree}</TimelineTitle>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{edu.institution}</span>
                          <span className="text-border">•</span>
                          <span className="font-mono text-xs">{edu.period}</span>
                        </div>
                      </div>
                    </TimelineHeader>
                    <TimelineContent className="space-y-4 leading-relaxed text-muted-foreground">
                      <p className="text-sm">{edu.description}</p>
                    </TimelineContent>
                  </motion.div>
                </TimelineItem>
              ))}
            </Timeline>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-auto flex w-full flex-row justify-center gap-2 border-t border-border/50 pt-6 sm:justify-start"
          >
            <Button
              className="mr-2 flex flex-1 gap-2 transition-all hover:scale-105 hover:shadow-lg sm:w-auto lg:flex-initial"
              size="lg"
              asChild
            >
              <Link href="/CV-2026-DanielGonzález.pdf" target="_blank" rel="noopener noreferrer">
                <DownloadIcon className="size-4" />
                Descargar CV
              </Link>
            </Button>

            {links.map((link, idx) => (
              <Button
                asChild
                className="size-10 shrink-0 rounded-full transition-all hover:scale-110 hover:shadow-lg active:scale-95"
                key={idx}
                variant="outline"
              >
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <link.icon className="size-4" />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </Button>
            ))}
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  )
}
