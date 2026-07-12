import { google } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { convertToModelMessages, createUIMessageStreamResponse, smoothStream, streamText, toUIMessageStream } from "ai"
import { waitUntil } from "@vercel/functions"
import { buildSystemPrompt } from "@/lib/ai/prompts"
import { extractUserQuery, retrieveContext } from "@/lib/ai/rag"
import { buildErrorResponse, handleStreamError } from "@/lib/ai/error-handler"
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/lib/ai/models"
import { ratelimit, getClientIdentifier, buildRateLimitHeaders } from "@/lib/rate-limit"
import { supabase } from "@/lib/supabase"

function resolveModelInstance(selectedModel: string) {
  if (selectedModel.startsWith("google/")) {
    return google(selectedModel.replace("google/", ""))
  }

  if (selectedModel.startsWith("groq/")) {
    return groq(selectedModel.replace("groq/", ""))
  }

  return google(selectedModel)
}

/**
 * Main API Route Handler for the Chat endpoint.
 * It coordinates parsing the user request, retrieving RAG context from Supabase,
 * and streaming the response back to the client using the Vercel AI SDK.
 */
export async function POST(req: Request) {
  try {
    // 0. Rate Limiting Guard
    try {
      const identifier = getClientIdentifier(req)
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier)

      if (!success) {
        const headers = buildRateLimitHeaders(limit, remaining, reset)
        return new Response(
          JSON.stringify({
            error: "rate_limit",
            message: "Has enviado muchos mensajes. Por favor espera un momento antes de continuar.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", ...headers },
          }
        )
      }
    } catch (rateLimitError) {
      console.warn("[rate-limit] Upstash check failed, allowing request:", rateLimitError)
    }

    const { messages, model, sessionId } = await req.json()

    // 1. Determine Model order for auto-fallback
    const requestedModel =
      AVAILABLE_MODELS.find((m) => m.id === model) || AVAILABLE_MODELS.find((m) => m.id === DEFAULT_MODEL)!
    const modelPriority = [requestedModel, ...AVAILABLE_MODELS.filter((m) => m.id !== requestedModel.id)]

    let lastError: unknown
    let result: ReturnType<typeof streamText> | undefined
    let successfulModel = modelPriority[0] // Fallback for metadata if no model throws

    // 2. Extract User Query
    const userQuery = extractUserQuery(messages)
    const context = userQuery ? await retrieveContext(userQuery) : ""

    // 3. Auto-Fallback Loop: try each model in priority order until one succeeds.
    // Each candidate's reference is captured in the closure to avoid stale variable issues.
    const convertedMessages = await convertToModelMessages(messages)

    for (const candidate of modelPriority) {
      try {
        const modelInstance = resolveModelInstance(candidate.id)
        const startTime = Date.now()

        result = streamText({
          model: modelInstance,
          messages: convertedMessages,
          instructions: buildSystemPrompt(context),

          // Throttle output to word-by-word for a natural reading pace on the frontend
          experimental_transform: smoothStream({
            chunking: "word",
            delayInMs: 35,
          }),

          onEnd: ({ usage, text }) => {
            const generationTimeMs = Date.now() - startTime
            const hasContext = context.length > 0
            console.log(
              `[/api/chat] Stream finished — model: ${candidate.id} | rag: ${hasContext} | tokens: ${JSON.stringify(usage)} | time: ${generationTimeMs}ms`
            )

            console.log("the session id is", sessionId)
            if (sessionId) {
              waitUntil(
                (async () => {
                  try {
                    console.log("Sending chat message...")
                    // Ensure the session exists
                    const supabaseResponse = await supabase
                      .from("chat_sessions")
                      .upsert({ id: sessionId, updated_at: new Date().toISOString() }, { onConflict: "id" })

                    console.log("Messages", {
                      sessionId: sessionId,
                      model: candidate.id,
                      user_query: userQuery || "",
                      ai_response: text,
                      rag_context_used: hasContext,
                      prompt_tokens: (usage as any)?.promptTokens || 0,
                      completion_tokens: (usage as any)?.completionTokens || 0,
                      generation_time_ms: generationTimeMs,
                    })

                    console.log("Session Response", supabaseResponse)
                    // Record which model actually handled the request (post-fallback)
                    const messageResponse = await supabase.from("chat_messages").insert({
                      session_id: sessionId,
                      model: candidate.id,
                      user_query: userQuery || "",
                      ai_response: text,
                      rag_context_used: hasContext,
                      prompt_tokens: (usage as any)?.promptTokens || 0,
                      completion_tokens: (usage as any)?.completionTokens || 0,
                      generation_time_ms: generationTimeMs,
                    })
                    console.log("Message Response", messageResponse)
                  } catch (dbError) {
                    console.error("[/api/chat] Error tracking chat interaction:", dbError)
                  }
                })()
              )
            }
          },

          onAbort: () => {
            console.log(`[/api/chat] Stream aborted — model: ${candidate.id}`)
          },
        })

        // This candidate started successfully — lock it in and exit the loop
        successfulModel = candidate
        break
      } catch (e) {
        lastError = e
        console.warn(`[/api/chat] Model ${candidate.id} failed, trying next:`, e)
      }
    }

    if (!result) throw lastError

    // 4. Return the HTTP Stream Response.
    // messageMetadata sends the winning model's display name to the client
    // so the UI can render "Powered by X" without any extra round-trips.
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: handleStreamError,
        messageMetadata: ({ part }) => {
          if (part.type === "start") {
            return { usedModel: successfulModel.name }
          }
        },
      }),
    })
  } catch (error) {
    return buildErrorResponse(error)
  }
}
