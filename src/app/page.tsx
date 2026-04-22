import { ChatArea } from "@/components/layout/chat/chat-area"
import { LeftPanel } from "@/components/layout/left-panel"
import { Topbar } from "@/components/layout/topbar"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Page() {
  return (
    <main className="flex h-svh w-full flex-col lg:flex-row">
      <Topbar />
      {/* Left Panel: Static / CV (40%) */}
      <section className="hidden h-full w-[40%] border-r border-border/40 bg-background lg:flex dark:bg-muted/30">
        <LeftPanel />
      </section>

      {/* Right Panel: Interactive AI (60%) */}

      {/* Subtle Theme-Based Glow */}
      {/* <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[30%] left-[50%] h-[40vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-primary/10 blur-[100px]" />
          <div className="absolute top-[70%] left-[50%] h-[30vh] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-primary/5 blur-[120px]" />
        </div> */}

      {/* Minimal Dot Grid (Temporarily removed per user request) */}
      {/* <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_10%,transparent_100%)] bg-[size:32px_32px] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)]" /> */}

      {/* Main Chat Area */}
      <ChatArea />

      <div className="absolute top-4 right-4 z-50 hidden lg:block">
        <ThemeSwitcher />
      </div>
    </main>
  )
}
