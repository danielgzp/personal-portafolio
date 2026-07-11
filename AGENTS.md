# Master AI Assistants Instructions (Cross-Agent Compatible)

## 🤖 Universal Compatibility Guidelines
This project is configured to be developed iteratively with any AI Code Assistant (Gemini CLI, Claude Code, GitHub Copilot, Cursor).
- **Agnostic Tooling:** Always use the standard tools available in your environment (e.g., `read_file`, `run_shell_command`, `replace`, `grep_search`, `write_file`). If a specific CLI tool isn't available, fallback to shell execution.
- **Autonomy:** Be proactive. Do not wait for explicit permission to read files, search the codebase, or run tests. Validate your assumptions empiricaly.
- **No Co-authoring:** Never add AI signatures to commit messages.
- **Communication:** Speak to the user in Spanish. Write code, comments, and commit messages in English. Be concise (no pleasantries, no preamble).

## 🏗 Project Architecture & Stack
**Tech Stack:** Next.js App Router (React, TypeScript), Tailwind CSS v4, Shadcn/ui, Framer Motion, Vercel AI SDK.
- Keep the architecture simple, modern, and production-grade.
- Prioritize clean UI/UX over complex enterprise patterns.
- Follow a strict Mobile-First approach.

## 🧠 Reasoning & Execution Flow
1. **Research (Empirical):** Read existing files, grep for dependencies, and snapshot the layout before writing code. Prioritize using CodeGraph and Context7 MCP tools (see below) for fast codebase navigation and documentation lookup.
2. **Strategy:** Formulate a plan silently. If the task is complex, use Plan Mode or draft a markdown plan.
3. **Execution:** Apply surgical edits (prefer replacing/editing over rewriting). Keep changes focused.
4. **Validation:** ALWAYS verify your work (e.g., `pnpm lint`, `pnpm build`, or mental dry-runs for UI changes). Never assume success.

## 🔌 Workspace MCP Tooling & Memory
This repository includes a configured set of workspace MCP servers in `.agents/mcp_config.json` and `.mcp.json`. All AI assistants MUST leverage these tools proactively:
- **CodeGraph:** Prioritize using `codegraph` tools (like `codegraph_explore`, `codegraph_search`, `codegraph_callers`) for all codebase discovery, symbol lookups, and call-chain analysis instead of doing slow, raw file searches or heavy `grep`.
- **Context7:** Prioritize querying `context7` tools when researching external APIs, documentation updates, or syntax of popular libraries to prevent hallucinations and outdated methods.
- **Engram:** Query `engram` tools (like `mem_get_observation`) at the beginning of a session to recall project-specific decisions and past lessons. Save critical architectural decisions or lessons learned to engram at the end of key tasks.

## 👥 Workspace Subagents & Delegation
This project defines specialized subagents under `.agents/agents/` that can be invoked via the `invoke_subagent` tool (or the `/delegate` command in compatible environments) to perform focused, concurrent tasks:
- **`frontend-agent`:** Expert in UI/UX, React 19, Next.js App Router, Tailwind CSS v4, Shadcn/ui, and Framer Motion. Delegate to this agent for building UI components, layouts, translations, animations, and accessibility fixes.
- **`backend-agent`:** Expert in Next.js API routes, Supabase (pgvector, RLS), database migrations, and Upstash Redis rate limiting. Delegate to this agent for backend logic, API routes, database operations, and cron jobs.
- **`ai-agent`:** Expert in Vercel AI SDK, RAG pipelines, prompt engineering, and chatbot security. Delegate to this agent for AI features, chatbot enhancements, RAG updates, and prompt modifications.
- **`security-agent`:** Read-only security auditor. Delegate to this agent to review codebase vulnerabilities, RLS policies, and API route security before deployment. Reports findings but does not modify files.

## 💅 Styling & Frontend Standards
- **Tailwind v4:** Use `size-{n}` (e.g., `size-4`). Use CSS variables for theming.
- **Shadcn/UI:** Use `cn()` from `src/lib/utils`.
- **Interactivity:** Use Framer Motion for animations. Keep animations <= 300ms.
- **Next.js:** Default to React Server Components. Use `'use client'` strictly for interactivity.

## 🛠 Available Scripts
```bash
pnpm dev             # Start dev server
pnpm build           # Production build
pnpm lint            # Linting validation
pnpm lint:fix        # Linting and auto-fix
pnpm typecheck       # Verify TypeScript types (highly recommended before commits/builds)
pnpm format          # Format files using Prettier
pnpm test:e2e        # Run all Playwright E2E tests
pnpm test:e2e:ui     # Open Playwright E2E test runner UI
```

## 🗄️ Database & RAG Rules
- **RAG Updates:** Whenever any changes are made to the RAG database (`public.documents` or similar), YOU MUST document the modifications in `docs/RAG_CHANGELOG.md`. Include the date, the specific documents altered, and the rationale behind the change.
- **Migrations-First Pattern:** ALWAYS create local migration files in `supabase/migrations/` when making schema changes or adding new tables. 
- **MCP Usage:** Use the Supabase MCP (`execute_sql`) ONLY for reading data, querying context, or editing row data. DO NOT use MCP to execute schema migrations or create tables directly on the remote database.
- **Applying Migrations:** DO NOT execute `supabase db push` or apply migrations directly. Leave the execution of the migrations to the user.
