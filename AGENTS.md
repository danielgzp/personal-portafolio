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
1. **Research (Empirical):** Read existing files, grep for dependencies, and snapshot the layout before writing code.
2. **Strategy:** Formulate a plan silently. If the task is complex, use Plan Mode or draft a markdown plan.
3. **Execution:** Apply surgical edits (prefer replacing/editing over rewriting). Keep changes focused.
4. **Validation:** ALWAYS verify your work (e.g., `pnpm lint`, `pnpm build`, or mental dry-runs for UI changes). Never assume success.

## 💅 Styling & Frontend Standards
- **Tailwind v4:** Use `size-{n}` (e.g., `size-4`). Use CSS variables for theming.
- **Shadcn/UI:** Use `cn()` from `src/lib/utils`.
- **Interactivity:** Use Framer Motion for animations. Keep animations <= 300ms.
- **Next.js:** Default to React Server Components. Use `'use client'` strictly for interactivity.

## 🛠 Available Scripts
```bash
pnpm dev    # Start dev server
pnpm build  # Production build
pnpm lint   # Linting
```
