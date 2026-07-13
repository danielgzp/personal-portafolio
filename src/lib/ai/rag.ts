import { embed } from "ai"
import { google } from "@ai-sdk/google"
import { supabase } from "@/lib/supabase"

/**
 * Represents the structure of a document retrieved from the Supabase pgvector database.
 */
export interface MatchedDocument {
  content: string
  metadata: { title?: string; company?: string; tags?: string[] }
  similarity: number
}

/**
 * Extracts the user's text query from the messages array sent by the Vercel AI SDK.
 * Handles different structural variations that the SDK might send (strings vs 'parts' arrays).
 *
 * @param messages - The array of conversation messages.
 * @returns The extracted user text query, or an empty string if not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractUserQuery(messages: any[]): string {
  // Extract the last user message from the array
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")

  if (!lastUserMessage) return ""

  // The AI SDK frontend may send the content as a direct string
  if (typeof lastUserMessage.content === "string") {
    return lastUserMessage.content
  }

  // Or it may send the content wrapped inside a 'parts' array
  if (Array.isArray(lastUserMessage.parts)) {
    return (
      lastUserMessage.parts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => p.type === "text")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => p.text)
        .join(" ")
    )
  }

  // Or inside a 'content' array
  if (Array.isArray(lastUserMessage.content)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return lastUserMessage.content.map((c: any) => c.text).join(" ")
  }

  return ""
}

/**
 * Generates an embedding for the user's query and searches the Supabase
 * database for the most semantically similar 'War Stories'.
 *
 * @param query - The user's parsed text query.
 * @returns A formatted string containing the matching context, or an empty string if nothing matches.
 */
export async function retrieveContext(query: string): Promise<string> {
  // 1. Truncate and generate a vector embedding for the user's query using Google's model
  // M4: Cap to 2000 chars to prevent cost attacks via oversized embedding payloads
  const truncatedQuery = query.slice(0, 2000)
  const { embedding } = await embed({
    model: google.textEmbeddingModel("gemini-embedding-2"),
    value: truncatedQuery,
  })

  // 2. Perform a cosine similarity search in Postgres via RPC
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.7, // Only return results with > 70% semantic similarity
    match_count: 5, // Maximum number of chunks to return
  })

  // 3. Handle database errors gracefully (non-fatal, chat continues without RAG)
  if (error) {
    console.warn("[/api/chat] RAG retrieval failed:", error.message)
    return ""
  }

  const docs = data as MatchedDocument[]

  // 4. Handle empty results (e.g. if the user says "hello", which has no relevance to the DB)
  if (!docs || docs.length === 0) {
    console.log(`[/api/chat] 🔍 RAG Query: "${query}" -> No matches found.`)
    return ""
  }

  // 5. Log the retrieved matches for debugging in development
  console.log(`[/api/chat] 🔍 RAG Query: "${query}"`)
  console.log(`[/api/chat] 📚 Found ${docs.length} matches in Supabase:`)
  docs.forEach((d, i) => {
    console.log(`  ${i + 1}. [${(d.similarity * 100).toFixed(1)}% match] ${d.metadata?.title ?? "Unknown"}`)
  })

  // 6. Format and concatenate the documents to be injected into the System Prompt
  return docs
    .map((doc) => {
      const title = doc.metadata?.title ?? "Experience"
      const company = doc.metadata?.company ?? ""
      const header = company ? `## ${title} — ${company}` : `## ${title}`
      return `${header}\n${doc.content}`
    })
    .join("\n\n---\n\n")
}
