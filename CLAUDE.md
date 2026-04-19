# Personal Portfolio — AI Assistant Instructions

## Project Overview

Interactive Personal Portfolio for Daniel (`danieldev`).
Built with Next.js App Router, React, TypeScript, Tailwind CSS, and Shadcn/ui.
Includes a custom AI Chat interface.

## Rules

- **Never run the linter or formatter** (`eslint`, `prettier`, `pnpm lint`, etc.) automatically, nor suggest it. Write lint-compliant and well-formatted code directly.
- **Never list AI code assistants as co-authors.**
- **Keep it simple:** Avoid over-engineering. This is a portfolio, so prioritize clean architecture, smooth animations, and perfect responsive design over enterprise complexity.

## Core Rules

Short sentences only (8-10 words max).
No filler, no preamble, no pleasantries.
Tool first. Result first. No explanations unless asked.
Code stays normal. English gets compressed.

---

## Formatting

Output sounds human. Never AI-generated.
Never use em-dashes or replacement hyphens.
Avoid parenthetical clauses entirely.
Hyphens map to standard grammar only.

## Approach

- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Test your code mentally before declaring done.
- Keep solutions simple and direct. Maintain high UI/UX standards.
- User instructions always override this file.

## Commands

```bash
pnpm dev          # Start local development server
pnpm build        # Build for production
pnpm lint         # Check for linting issues
```

## Architecture

```text
src/
├── app/          # Next.js App Router (routes, layouts, pages, api)
│   └── api/chat/ # AI Chatbot API routes
├── components/   # UI Components
│   ├── chat/     # Interactive AI chat interface
│   ├── common/   # Reusable generic components
│   ├── layout/   # Structural components (nav, panels)
│   └── ui/       # Shadcn/ui base components
├── hooks/        # Custom React hooks (e.g., use-auto-scroll)
└── lib/          # Utilities (e.g., cn() for tailwind)
```

## Code Style

### Naming
- Directories: `lowercase-with-dashes` (e.g., `chat-area`, `theme-provider`).
- Components & types: `PascalCase`.
- Functions & variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Event handlers: prefix with `handle` (e.g., `handleSubmit`).
- Booleans: prefix with auxiliary verbs (`isLoading`, `hasError`).

### TypeScript
- Prefer `interface` over `type` for object shapes.
- Avoid `enum` — use `const` objects with `as const`.
- Avoid `any` — use `unknown` if truly unknown.

### Tailwind CSS
- Use `size-{n}` instead of `h-{n} w-{n}` for equal dimensions.
- Use `cn()` from `src/lib/utils` for conditional class merging.
- Follow a strict mobile-first approach.
- Prioritize CSS variables for theming to support dark/light modes seamlessly.

### React / Next.js
- Favor React Server Components. Only add `'use client'` when strictly necessary (hooks, interactivity, browser APIs).
- Maintain smooth UX. Use custom hooks like `use-auto-scroll` for the chat interface.
- Always `await` Next.js runtime APIs when required by the newer Next.js versions.

## Communication

- **Chat with user:** Spanish.
- **Code, comments, commits:** English.

## Key Libraries

| Library | Purpose |
|---|---|
| `next` | Core framework (App Router) |
| `shadcn/ui` + `radix-ui` | Accessible base UI components |
| `tailwindcss` | Utility-first styling |
| `framer-motion` | Smooth UI animations & transitions |
| `lucide-react` | Icons |
| Vercel AI SDK | Streaming AI chat responses (implied API) |

## Git Workflow

- Conventional commits format in English.
- Atomic, focused commits.
