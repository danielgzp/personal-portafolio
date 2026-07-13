/**
 * Script: generates embeddings for the Zustand store document and inserts it into Supabase.
 *
 * Usage:
 *   pnpm exec tsx scripts/insert-zustand-doc.ts
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { embed } from "ai"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

// Load env variables
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY
const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

if (!supabaseUrl || !supabaseServiceKey || !googleApiKey) {
  console.error("Missing required environment variables in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const google = createGoogleGenerativeAI({ apiKey: googleApiKey })
const embeddingModel = google.textEmbeddingModel("gemini-embedding-2")

const ztContent = `
Para la gestión del estado global del lado del cliente en Next.js, Daniel implementa un patrón modular de Zustand basado en el Slice Pattern (Patrón de Rebanadas).
En lugar de centralizar todo el estado en un único archivo monolítico, divide la lógica del negocio en "slices" independientes y cohesivos (por ejemplo, UI, Chat, Sesión) y luego los compone en un único "bound store" global.

Este enfoque asegura:
1. Co-localización: Cada módulo define sus propias interfaces de TypeScript, estado inicial y acciones (actions) en el mismo archivo.
2. Tipado Estricto (Type-Safety): Utiliza tipos e interfaces detallados para prevenir errores de compilación y mejorar el autocompletado en el editor.
3. Rendimiento con Selectores: Emplea selectores específicos en los componentes para evitar renders innecesarios cuando cambian partes del estado no consumidas por ese componente.
4. Middleware de Depuración: Integra 'devtools' para inspeccionar transiciones de estado desde Redux DevTools en tiempo real, y 'persist' para guardar el estado en localStorage/sessionStorage.

A continuación se muestra la estructura recomendada por Daniel para configurar Zustand:

\`\`\`typescript
import { create, StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 1. Definición de tipos y estado para el Slice de Chat
interface ChatState {
  messages: Array<{ id: string; text: string; sender: 'user' | 'assistant' }>
  isStreaming: boolean
}

interface ChatActions {
  addMessage: (text: string, sender: 'user' | 'assistant') => void
  setStreaming: (status: boolean) => void
  resetChat: () => void
}

export type ChatSlice = ChatState & ChatActions

// 2. Creación del Slice con StateCreator para asegurar tipado
const createChatSlice: StateCreator<
  ChatSlice,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  ChatSlice
> = (set) => ({
  messages: [],
  isStreaming: false,
  addMessage: (text, sender) =>
    set(
      (state) => ({
        messages: [...state.messages, { id: crypto.randomUUID(), text, sender }]
      }),
      false,
      'chat/addMessage'
    ),
  setStreaming: (status) => set({ isStreaming: status }, false, 'chat/setStreaming'),
  resetChat: () => set({ messages: [], isStreaming: false }, false, 'chat/resetChat')
})

// 3. Composición del Bound Store con Devtools y Persist
export const useAppStore = create<ChatSlice>()(
  devtools(
    persist(
      (...a) => ({
        ...createChatSlice(...a),
      }),
      { name: 'app-state-storage' }
    ),
    { name: 'AppStore' }
  )
)
\`\`\`
`.trim()

async function run() {
  console.log("Generating embedding...")
  const { embedding } = await embed({
    model: embeddingModel,
    value: ztContent,
  })

  console.log("Upserting document into Supabase documents table...")
  const { error } = await supabase.from("documents").insert({
    content: ztContent,
    metadata: {
      title: "Estructura y Gestión de Estado con Zustand",
      company: "Essertech LLC",
      tags: ["zustand", "state-management", "architecture", "typescript"]
    },
    embedding,
  })

  if (error) {
    console.error("Insertion failed:", error.message)
    process.exit(1)
  }

  console.log("Zustand document successfully inserted into RAG database!")
}

run().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
