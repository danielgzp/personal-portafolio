/**
 * Represents an available AI model in the application.
 */
export interface AIModel {
  id: string
  name: string
}

/**
 * Global list of available AI models for the chat interface.
 * Used by both the frontend UI (for selection) and the backend API (for validation).
 */
export const AVAILABLE_MODELS: AIModel[] = [
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
]

/**
 * The default model to fallback to if an invalid model is requested.
 */
export const DEFAULT_MODEL = "gemini-2.5-flash"
