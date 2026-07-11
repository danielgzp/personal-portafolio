# Design Spec: AI Models Update & Deprecation Management (July 2026)

This specification outlines the updates to the active AI models list and default configurations to address deprecations in mid-2026 for both Google Gemini and Groq providers.

## Purpose & Requirements
1. **Maintainability:** Ensure deprecated and obsolete models are kept in the codebase but commented out, allowing easy toggling (comment/uncomment).
2. **Upgrade Standard:** Add active 2026 models like `gemini-3.5-flash` and `gpt-oss-120b`.
3. **Safety Fallback:** Move the `DEFAULT_MODEL` away from the soon-to-be-retired `gemini-2.5-flash` (retiring October 16, 2026) to `gemini-3.5-flash`.
4. **Verifiability:** Validate the updated app locally by launching the dev server and verifying chat functionalities in a real browser.

## Architectural Changes

### `src/lib/ai/models.ts`
Modify the `AVAILABLE_MODELS` array to group active models, and comment out deprecated models with inline warnings:
- Active: `google/gemini-3.5-flash`, `google/gemini-3.1-flash-image-preview`, `groq/openai/gpt-oss-20b`, `groq/openai/gpt-oss-120b`.
- Deprecated/Off: `google/gemini-2.5-flash`, `groq/llama-3.3-70b-versatile`, `groq/mixtral-8x7b-32768`.
- Change `DEFAULT_MODEL` to `"google/gemini-3.5-flash"`.

## Verification Strategy
1. Start development server using `pnpm dev`.
2. Launch a browser using the Chrome DevTools MCP.
3. Open the localhost page and verify that the chat interface loads and accepts/answers messages using the default Gemini 3.5 Flash model.
