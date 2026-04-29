import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { convertToModelMessages, smoothStream, streamText } from "ai"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { extractUserQuery, retrieveContext } from "@/lib/ai/rag"
import { buildErrorResponse, handleStreamError } from "@/lib/ai/error-handler"
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/ai/models"

function resolveModelInstance(selectedModel: string) {
  if (selectedModel.startsWith("google/")) {
    return google(selectedModel.replace("google/", ""))
  }

  if (selectedModel.startsWith("groq/")) {
    return groq(selectedModel.replace("groq/", ""))
  }

  return google(selectedModel)
}

// Node.js runtime required: @supabase/supabase-js uses Node APIs (fetch, crypto)
// not available in the Edge runtime.
export const runtime = "nodejs"

/**
 * Main API Route Handler for the Chat endpoint.
 * It coordinates parsing the user request, retrieving RAG context from Supabase,
 * and streaming the response back to the client using the Vercel AI SDK.
 */
export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    // 1. Model Validation: Default to the fastest model if an invalid one is passed.
    const allowedModels = new Set(AVAILABLE_MODELS.map(m => m.id))
    const selectedModel = allowedModels.has(model) ? model : DEFAULT_MODEL

    // 2. Extract User Query: Cleanly extract the text from the complex Vercel AI payload.
    const userQuery = extractUserQuery(messages)

    // 3. Optional RAG Context Retrieval: Search Supabase for relevant "War Stories".
    // If the user hasn't typed anything meaningful, or if Supabase is down, it degrades gracefully to "".
    const context = userQuery ? await retrieveContext(userQuery) : ""

    // 4. Instanciar el SDK correcto según el prefijo del modelo seleccionado
    const modelInstance = resolveModelInstance(selectedModel)

    // 5. Start the AI Stream
    const result = streamText({
      model: modelInstance,
      messages: await convertToModelMessages(messages),
      
      // Inject the dynamically built prompt (Base Prompt + RAG Context)
      system: buildSystemPrompt(context),
      
      // Throttle output to word-by-word for a natural reading pace on the frontend
      experimental_transform: smoothStream({
        chunking: "word",
        delayInMs: 35,
      }),
      
      onFinish: ({ usage }) => {
        const hasContext = context.length > 0
        console.log(
          `[/api/chat] Stream finished — model: ${selectedModel} | rag: ${hasContext} | tokens: ${JSON.stringify(usage)}`
        )
      },
      onAbort: () => {
        console.log(`[/api/chat] Stream aborted — model: ${selectedModel}`)
      },
    })

    // 5. Return the HTTP Stream Response
    return result.toUIMessageStreamResponse({
      // If the stream breaks midway, handleStreamError generates the JSON error message
      onError: handleStreamError,
    })

  } catch (error) {
    // If an error happens before the stream starts (e.g. rate limits, syntax errors),
    // buildErrorResponse handles the HTTP status and JSON mapping.
    return buildErrorResponse(error)
  }
}
