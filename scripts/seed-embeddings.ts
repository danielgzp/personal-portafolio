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
