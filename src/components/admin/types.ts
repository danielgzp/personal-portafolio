export type Message = {
  id: number
  model: string | null
  created_at: string
  user_query: string | null
  ai_response: string | null
  rag_context_used: boolean | null
  prompt_tokens: number | null
  completion_tokens: number | null
  generation_time_ms: number | null
  error_message: string | null
}

export type Session = {
  id: string
  created_at: string
  updated_at: string
  message_count?: number
  last_activity?: string
  last_user_query?: string
  models?: string[]
  chat_messages?: Message[]
}
