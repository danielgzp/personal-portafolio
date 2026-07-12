/**
 * Seed script: generates embeddings for War Stories and upserts them into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-embeddings.ts
 *
 * Requires these env vars (add to .env.local or export them):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_GENERATIVE_AI_API_KEY
 */

import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { embed } from "ai"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// ---------------------------------------------------------------------------
// Google embedding model
// ---------------------------------------------------------------------------
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! })
const embeddingModel = google.textEmbeddingModel("gemini-embedding-2")

// ---------------------------------------------------------------------------
// War Stories — add your stories here before running the seed
// ---------------------------------------------------------------------------
interface WarStory {
  title: string
  company: string
  tags: string[]
  content: string
}

const WAR_STORIES: WarStory[] = [
  {
    title: "Desarrollo de ERP Masivo para ISPs",
    company: "Essertech LLC",
    tags: ["architecture", "nextjs", "leadership", "erp"],
    content: `
      Como Lead Frontend Engineer en Essertech LLC, lideré el desarrollo de un ERP masivo diseñado específicamente para Proveedores de Servicios de Internet (ISPs).
      El mayor desafío fue crear un System Design desde cero que pudiera escalar con una alta carga de datos y módulos complejos.
      Implementé una arquitectura modular fuertemente basada en el ecosistema React y Next.js. Esto nos permitió mantener el código limpio, separar responsabilidades y asegurar un renderizado optimizado a pesar de la complejidad del negocio.
    `,
  },
  {
    title: "Integración de Inteligencia Artificial para Productividad",
    company: "Essertech LLC",
    tags: ["ai", "productivity", "leadership"],
    content: `
      Durante el desarrollo del ecosistema SaaS en Essertech, me di cuenta de que muchas tareas repetitivas nos estaban quitando tiempo valioso.
      Decidí integrar herramientas y metodologías de Inteligencia Artificial de forma estratégica en nuestro pipeline de desarrollo.
      El resultado fue un incremento drástico en nuestra eficiencia: logramos acelerar el tiempo total de desarrollo en un 45%. La IA no reemplazó a nuestro equipo, sino que sirvió como un multiplicador de productividad clave para entregar features más rápido.
    `,
  },
  {
    title: "Plataforma Financiera en Tiempo Real",
    company: "Essertech LLC",
    tags: ["real-time", "performance", "frontend"],
    content: `
      En mis inicios como Junior en Essertech, tuve el reto de desarrollar el core de una plataforma financiera en tiempo real.
      La exigencia visual y de rendimiento era altísima, por lo que tuve que aplicar un estándar "Pixel-Perfect" mientras optimizaba la latencia y el manejo del estado del cliente.
      Además, construí un marketplace multi-tenant que requería una internacionalización (i18n) muy robusta para soportar diferentes regiones sin degradar el rendimiento.
    `,
  },
  {
    title: "Rediseño de Interfaces y Sistemas de Citas",
    company: "Grupo Corporativo Marna",
    tags: ["ui/ux", "product-oriented", "usability"],
    content: `
      En el Grupo Corporativo Marna estuve a cargo del rediseño completo de sus interfaces y la construcción de un nuevo sistema de citas.
      Mi enfoque como "Product-Oriented Engineer" fue fundamental aquí: no solo me enfoqué en escribir código limpio usando TypeScript, sino en entender el modelo de negocio para asegurar que el sistema final resolviera problemas reales de los usuarios.
      El foco principal estuvo en maximizar la usabilidad del cliente y facilitar el despliegue comercial del producto.
    `,
  },
  {
    title: "Estructura y Gestión de Estado con Zustand",
    company: "Essertech LLC",
    tags: ["zustand", "state-management", "architecture", "typescript"],
    content: `
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
    `.trim(),
  }
]

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------
async function seed() {
  if (WAR_STORIES.length === 0) {
    console.warn("⚠️  No War Stories defined. Add them to the WAR_STORIES array and re-run.")
    process.exit(0)
  }

  console.log(`🌱 Seeding ${WAR_STORIES.length} War Stories...`)

  for (const story of WAR_STORIES) {
    console.log(`  ↳ Generating embedding for: "${story.title}"`)

    const { embedding } = await embed({
      model: embeddingModel,
      value: story.content.trim(),
    })

    const { error } = await supabase.from("documents").insert({
      content: story.content.trim(),
      metadata: {
        title: story.title,
        company: story.company,
        tags: story.tags,
      },
      embedding,
    })

    if (error) {
      console.error(`  ✗ Failed to insert "${story.title}":`, error.message)
    } else {
      console.log(`  ✓ Inserted "${story.title}"`)
    }
  }

  console.log("✅ Seed complete.")
}

seed().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
