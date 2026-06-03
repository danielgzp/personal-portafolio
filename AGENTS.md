# Personal Portfolio — AI Agents & Skills Specification

This document provides a standard, machine-readable specification and cooperation guide for AI coding assistants (such as Antigravity, Claude Code, etc.) operating in this workspace.

---

## 1. Project Overview & Core Rules (from CLAUDE.md)

All AI agents must respect the core guidelines specified in [CLAUDE.md](CLAUDE.md):
*   **Never run linters or formatters automatically** (`eslint`, `prettier`, etc.). Write clean, compliant code directly.
*   **Keep it simple:** This is a high-fidelity portfolio. Prioritize elegant, clean design, smooth animations, and perfect mobile responsiveness.
*   **Response Style:** Short sentences only (8-10 words max in general chat sentences). Direct, tool-first, result-first, and concise.
*   **Language Barrier:**
    *   **Chat with user:** Spanish (`es`).
    *   **Code, comments, and commits:** English (`en`).

---

## 2. Active AI Specialist Directory

When executing complex tasks, AI agents should delegate subtasks to the appropriate specialist files located in `.claude/agents/`:

| Agent File | Role / Specialty | Key Trigger Contexts |
|---|---|---|
| `[tech-lead.md](.claude/agents/tech-lead.md)` | **System Architect & Orchestrator** | Entry point for multi-file tasks, planning, and task decomposition. |
| `[frontend-engineer.md](.claude/agents/frontend-engineer.md)` | **Next.js & React Core Developer** | RSC vs Client boundaries, next-intl routes, and Vercel AI SDK integration. |
| `[ui-ux.md](.claude/agents/ui-ux.md)` | **Design System & Animation Specialist** | Styling with Tailwind v4, HSL colors, `framer-motion` animations, and UI compositions. |
| `[code-reviewer.md](.claude/agents/code-reviewer.md)` | **Code Quality & Translation Auditor** | Verification of translations, absolute imports (`@/`), and Server Action structures. |
| `[a11y.md](.claude/agents/a11y.md)` | **Accessibility (WCAG) Auditor** | Keyboard navigation on AI chat, focus overlays, contrast ratios, and reduced motion. |
| `[performance.md](.claude/agents/performance.md)` | **Render & Bundle Optimization** | `next/dynamic` lazy loading, stable 60 FPS animation audits, and asset compression. |

---

## 3. Active AI Skills (`.agents/skills/`)

These folders contain detailed instruction sets that extend your reasoning. Refer to them whenever a task relates to their domain:

1.  **`framer-motion-animator`:** Micro-interactions, scroll animations, dynamic transitions.
2.  **`frontend-design`:** Creative aesthetics guidelines, premium visual architectures.
3.  **`next-intl`:** Internationalization rules, translation hooks, JSON mapping.
4.  **`shadcn`:** Integration of custom base components and customization rules.
5.  **`supabase`:** Row Level Security (RLS), schema migrations, and safe queries.
6.  **`supabase-postgres-best-practices`:** SQL execution, performance indices, constraints.
7.  **`tailwind-v4`:** Modern, utility-first CSS configurations and HSL token themes.
8.  **`ui-ux-pro-max`:** Pro-grade composition, layout frameworks, and responsive standards.

---

## 4. Code & Style Specifications (from CLAUDE.md)

Agents must strictly comply with these structural rules when writing code:

### Technical Stack
*   **Framework:** Next.js 16.2.4 (App Router) + React 19.2.5
*   **Styling:** Tailwind CSS v4.2.4 (using CSS-first token configuration in `src/styles/globals.css`)
*   **Database:** Supabase SDK (`@supabase/supabase-js`)
*   **Chat Engine:** Vercel AI SDK (`ai` + `@ai-sdk/react`)

### Naming Conventions
*   Directories: `lowercase-with-dashes` (e.g. `locale-switcher`)
*   Components & Interfaces: `PascalCase` (e.g. `ThemeSwitcher.tsx`)
*   Hooks & Functions: `camelCase` (e.g. `useAutoScroll.ts`)
*   Constants: `UPPER_SNAKE_CASE` (e.g. `DEFAULT_LOCALE`)

### Tailwind & React Rules
*   **`size-{n}`:** Never write `h-4 w-4`. Always use the Tailwind utility `size-4`.
*   **No Absolute Colors:** Never write `bg-blue-500` or `text-gray-600`. Use semantic classes (`bg-primary`, `text-muted-foreground`, `border`) which react to CSS HSL theme tokens.
*   **`cn()` Merging:** Always use `cn(...)` from `@/lib/utils` or `src/lib/utils` for conditional styles.
*   **RSC Defaulting:** Pages and layouts must be Server Components. Add `"use client"` only for client hooks, state, or browser APIs.
*   **Clean Aliases:** All internal modules must use absolute import paths starting with `@/` (e.g., `@/components/ui/button`).

---

## 5. How to Invoke Subagents (Antigravity Specification)

To delegate tasks to custom specialists in background processes:
1.  **Define:** Create a new subagent matching the prompt inside `.claude/agents/<agent-name>.md` using `define_subagent`.
2.  **Invoke:** Call the subagent using `invoke_subagent` with a specific task prompt.

```json
{
  "name": "frontend-engineer",
  "description": "Senior Frontend Engineer specialized in Next.js 16 and React 19.",
  "system_prompt": "..."
}
```
