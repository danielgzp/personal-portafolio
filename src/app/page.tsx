import { ChatArea } from "@/components/layout/chat/chat-area";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Page() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      {/* PANEL IZQUIERDO: Estático / CV (40%) */}
      <aside className="hidden lg:flex lg:w-[40%] flex-col border-r bg-muted/20 p-8 overflow-y-auto">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold tracking-tight">Daniel González</h1>
          <p className="text-sm text-muted-foreground">Lead Frontend Developer</p>
          <div className="mt-4 rounded border px-3 py-1 text-xs">Panel CV En Construcción</div>
        </div>
      </aside>

      {/* PANEL DERECHO: Agente Interactivo AI (60%) */}
      <section className="flex-1 flex flex-col h-full bg-background relative">
        <ChatArea />
        <div className="absolute right-4 top-4 z-50">
              <ThemeSwitcher />
            </div>
      </section>
    </main>
  );
}
