/**
 * Represents an available AI model in the application.
 */
export interface AIModel {
  id: string
  name: string
  provider: string
}

/**
 * Global list of available AI models for the chat interface.
 * Used by both the frontend UI (for selection) and the backend API (for validation).
 */
export const AVAILABLE_MODELS: AIModel[] = [
  // --- ACTIVE MODELS (Recommended) ---
  { id: "google/gemini-3.5-flash", name: "Gemini 3.5 Flash", provider: "Google" },
  { id: "google/gemini-3.1-flash-image-preview", name: "Gemini 3.1 Flash", provider: "Google" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google" }, // Active until Oct 16, 2026
  { id: "groq/openai/gpt-oss-20b", name: "GPT-OSS 20B", provider: "Groq (OpenAI)" },
  { id: "groq/openai/gpt-oss-120b", name: "GPT-OSS 120B", provider: "Groq (OpenAI)" },
  { id: "groq/deepseek-r1-distill-llama-70b", name: "DeepSeek R1 70B", provider: "Groq (DeepSeek)" },
  { id: "groq/llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Groq" }, // Active until Aug 16, 2026

  // --- RETIRED MODELS ---
  // { id: "groq/mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Groq" }, // Obsolete/Retired
]

/**
 * The default model to fallback to if an invalid model is requested.
 */
export const DEFAULT_MODEL = "google/gemini-3.5-flash"
