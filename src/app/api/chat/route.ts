import { google } from "@ai-sdk/google"
import {
  APICallError,
  convertToModelMessages,
  smoothStream,
  streamText,
} from "ai"

// Force Edge runtime for faster streaming
export const runtime = "edge"

/**
 * Parses a thrown error and returns a user-friendly error response
 * with an appropriate HTTP status code and a structured error body.
 */
function buildErrorResponse(error: unknown): Response {
  // --- Rate limit / quota exceeded (HTTP 429) ---
  if (APICallError.isInstance(error) && error.statusCode === 429) {
    return new Response(
      JSON.stringify({
        error: "rate_limit",
        message:
          "Has alcanzado el límite de solicitudes. Por favor, espera un momento e inténtalo de nuevo.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  // --- Token limit exceeded: Google returns 400 with a specific message ---
  if (
    APICallError.isInstance(error) &&
    error.statusCode === 400 &&
    (error.message.includes("token") ||
      error.message.includes("context") ||
      error.message.includes("length") ||
      error.message.includes("limit"))
  ) {
    return new Response(
      JSON.stringify({
        error: "token_limit",
        message:
          "La conversación es demasiado larga para este modelo. Intenta iniciar una nueva conversación o usa un modelo con mayor contexto.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // --- General API call error (auth, bad request, etc.) ---
  if (APICallError.isInstance(error)) {
    const statusCode = error.statusCode ?? 500

    // Authentication / API key errors
    if (statusCode === 401 || statusCode === 403) {
      return new Response(
        JSON.stringify({
          error: "auth_error",
          message:
            "Error de autenticación con el proveedor de IA. Por favor, revisa la configuración.",
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      )
    }

    // Service unavailable / overloaded
    if (statusCode === 503 || statusCode === 502) {
      return new Response(
        JSON.stringify({
          error: "service_unavailable",
          message:
            "El servicio de IA no está disponible en este momento. Por favor, inténtalo más tarde.",
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      )
    }

    // Generic API error fallback
    return new Response(
      JSON.stringify({
        error: "api_error",
        message: `Error del proveedor de IA (${statusCode}). Por favor, inténtalo de nuevo.`,
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    )
  }

  // --- Invalid request body / bad JSON ---
  if (error instanceof SyntaxError) {
    return new Response(
      JSON.stringify({
        error: "invalid_request",
        message: "El cuerpo de la solicitud no es válido.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // --- Unexpected / unknown server error ---
  console.error("[/api/chat] Unexpected error:", error)
  return new Response(
    JSON.stringify({
      error: "internal_error",
      message:
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  )
}

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    const allowedModels = new Set([
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
    ])

    const selectedModel = allowedModels.has(model)
      ? model
      : "gemini-3-flash-preview"

    const result = streamText({
      model: google(selectedModel),
      messages: await convertToModelMessages(messages),
      system: `
        Eres el asistente personal de Inteligencia Artificial del portafolio interactivo de Daniel González.
        Daniel es un Frontend Engineer especializado en React, Next.js, TypeScript y Arquitectura Frontend.
        Tu objetivo es responder de manera profesional y técnica sobre las habilidades y experiencia de Daniel.
        Si el usuario hace preguntas de código o frontend, responde demostrando el conocimiento avanzado de Daniel.
        Responde siempre en español a menos que el usuario hable en otro idioma.
      `,
      // Throttle the outgoing stream so tokens arrive word-by-word instead of
      // in large bursts. Gemini (and many other providers) can buffer internally
      // and dump many tokens at once; smoothStream re-paces the output to feel
      // like a human typing — the same effect you see in Claude and ChatGPT.
      experimental_transform: smoothStream({
        chunking: "word",  // release one word at a time
        delayInMs: 35,     // ~35ms between words ≈ comfortable reading pace
      }),
      // Log when the stream completes or is aborted
      onFinish: ({ usage }) => {
        console.log(
          `[/api/chat] Stream finished — model: ${selectedModel} | tokens: ${JSON.stringify(usage)}`
        )
      },
      onAbort: () => {
        console.log(`[/api/chat] Stream aborted — model: ${selectedModel}`)
      },
    })

    return result.toUIMessageStreamResponse({
      // Forward any errors that surface inside the stream back to the client
      onError: (error) => {
        console.error("[/api/chat] Stream error:", error)
        // Return a generic message to avoid leaking internal details
        return "Ocurrió un error durante la respuesta. Por favor, inténtalo de nuevo."
      },
    })
  } catch (error) {
    return buildErrorResponse(error)
  }
}
