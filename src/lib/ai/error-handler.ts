import { APICallError } from "ai"

/**
 * A centralized error handler that maps unexpected exceptions and AI SDK errors
 * into standardized HTTP Response objects. Used when an error occurs BEFORE the stream starts.
 *
 * @param error - The caught exception.
 * @returns A Next.js Response object with the appropriate status code and JSON body.
 */
export function buildErrorResponse(error: unknown): Response {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  // 1. Rate limit / quota exceeded (HTTP 429)
  const isRateLimit =
    (APICallError.isInstance(error) && error.statusCode === 429) ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("too many requests")

  if (isRateLimit) {
    return new Response(
      JSON.stringify({
        error: "rate_limit",
        message: "Has alcanzado el límite de solicitudes. Por favor, espera un momento e inténtalo de nuevo.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    )
  }

  // 2. Token limit exceeded (HTTP 400)
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

  // 3. General AI Provider Error
  if (APICallError.isInstance(error)) {
    const statusCode = error.statusCode ?? 500

    if (statusCode === 401 || statusCode === 403) {
      return new Response(
        JSON.stringify({
          error: "auth_error",
          message: "Error de autenticación con el proveedor de IA. Por favor, revisa la configuración.",
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      )
    }

    if (statusCode === 503 || statusCode === 502) {
      return new Response(
        JSON.stringify({
          error: "service_unavailable",
          message: "El servicio de IA no está disponible en este momento. Por favor, inténtalo más tarde.",
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        error: "api_error",
        message: `Error del proveedor de IA (${statusCode}). Por favor, inténtalo de nuevo.`,
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    )
  }

  // 4. Invalid Request Body (e.g. malformed JSON)
  if (error instanceof SyntaxError) {
    return new Response(
      JSON.stringify({
        error: "invalid_request",
        message: "El cuerpo de la solicitud no es válido.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  // 5. Unexpected / Unknown Server Error
  console.error("[/api/chat] Unexpected error:", error)
  return new Response(
    JSON.stringify({
      error: "internal_error",
      message: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  )
}

/**
 * Generates an error callback used during the streaming process (onError parameter).
 * Returns a JSON string that will be sent to the client if the stream breaks midway.
 *
 * @param error - The error caught during streaming.
 * @returns A JSON stringified error message.
 */
export function handleStreamError(error: unknown): string {
  console.error("[/api/chat] Stream error:", error)

  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  const isRateLimit =
    (APICallError.isInstance(error) && error.statusCode === 429) ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("too many requests")

  if (isRateLimit) {
    return JSON.stringify({
      error: "rate_limit",
      message: "Has alcanzado el límite de solicitudes. Por favor, espera un momento e inténtalo de nuevo.",
    })
  }

  if (APICallError.isInstance(error)) {
    const status = error.statusCode ?? 500

    if (
      status === 400 &&
      (error.message.includes("token") ||
        error.message.includes("context") ||
        error.message.includes("length") ||
        error.message.includes("limit"))
    ) {
      return JSON.stringify({
        error: "token_limit",
        message:
          "La conversación es demasiado larga para este modelo. Intenta iniciar una nueva conversación o usa un modelo con mayor contexto.",
      })
    }

    if (status === 401 || status === 403) {
      return JSON.stringify({
        error: "auth_error",
        message: "Error de autenticación con el proveedor de IA.",
      })
    }

    if (status === 503 || status === 502) {
      return JSON.stringify({
        error: "service_unavailable",
        message: "El servicio de IA no está disponible en este momento. Por favor, inténtalo más tarde.",
      })
    }

    return JSON.stringify({
      error: "api_error",
      message: `Error del proveedor de IA (${status}). Por favor, inténtalo de nuevo.`,
    })
  }

  return JSON.stringify({
    error: "internal_error",
    message: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
  })
}
