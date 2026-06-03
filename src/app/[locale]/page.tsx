import { PanelLayout } from "@/components/layout/panel-layout"

/**
 * Root page — intentionally a Server Component.
 * All interactive state (tabs, media query, animations) lives in PanelLayout,
 * which carries the only "use client" boundary for this route.
 */
export default function Page() {
  return <PanelLayout />
}
