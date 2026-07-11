# Specialized Agents Design — Personal Portfolio

**Date:** 2026-07-11  
**Status:** Implemented  
**Scope:** 4 specialized agent skills for the portfolio project

---

## Overview

This document captures the design and rationale for the 4 specialized AI agents created for the personal portfolio project. Each agent is implemented as a `SKILL.md` file in `.agents/skills/` for cross-agent compatibility (Gemini CLI, Claude Code, GitHub Copilot, Cursor).

---

## Architecture Decision

**Decision:** Skills in `.agents/skills/` (persistent, cross-agent) over `define_subagent` (session-only).

**Rationale:**
- Skills persist across all coding sessions and work with any AI assistant
- AGENTS.md already establishes `.agents/` as the project's agent configuration directory
- Skills can be referenced by any agent at any time, not just during the session they're defined
- Cross-agent compatibility matches the project's stated goal in AGENTS.md

---

## Agent 1: `portfolio-frontend-agent`

**Location:** `.agents/skills/portfolio-frontend-agent/SKILL.md`

**Domain:** UI/UX, React 19, Tailwind CSS v4, Framer Motion, Shadcn/ui, next-intl

**Key responsibilities:**
- Creating and modifying components in `src/components/`
- Enforcing DESIGN.md styling rules (OKLCH tokens, `size-{n}`, no `dark:` overrides)
- Animation patterns (Framer Motion spring models from `src/lib/animations.ts`)
- i18n integration with `next-intl`
- RSC vs `'use client'` boundary decisions
- Mobile-first responsive design

**Sub-skills referenced:** `frontend-design`, `shadcn`, `modern-web-guidance`, `vercel-react-best-practices`

---

## Agent 2: `portfolio-backend-agent`

**Location:** `.agents/skills/portfolio-backend-agent/SKILL.md`

**Domain:** Next.js API Routes, Supabase, Upstash Redis, Vercel Functions

**Key responsibilities:**
- API routes in `src/app/api/` following Next.js App Router conventions
- Supabase operations: publishable key (browser) vs secret key (server-only)
- Migration-first pattern: write SQL in `supabase/migrations/`, never run `db push`
- Rate limiting with Upstash sliding window
- Async fire-and-forget with `waitUntil()` from `@vercel/functions`
- Admin dashboard auth logic in `src/app/d4sh-ctrl/`

**Sub-skills referenced:** `nodejs-backend-patterns`, `zod`, `upstash`

---

## Agent 3: `portfolio-ai-agent`

**Location:** `.agents/skills/portfolio-ai-agent/SKILL.md`

**Domain:** LLM integration, RAG pipeline, prompt engineering, streaming

**Key responsibilities:**
- RAG pipeline: embeddings (gemini-embedding-2) → pgvector → context injection
- Multi-model auto-fallback loop with `google/` and `groq/` prefixes
- System prompt maintenance: extend without breaking security guardrails
- RAG_CHANGELOG.md documentation obligation
- Streaming architecture: `smoothStream`, `messageMetadata`, `toUIMessageStreamResponse`
- Adding new AI models to `AVAILABLE_MODELS`

**Sub-skills referenced:** `ai-sdk`, `zod`, `typescript-advanced-types`

---

## Agent 4: `portfolio-security-agent`

**Location:** `.agents/skills/portfolio-security-agent/SKILL.md`

**Mode:** READ-ONLY — reports vulnerabilities, never modifies code directly

**Domain:** Security auditing, OWASP, prompt injection defense, secrets management

**Audit vectors (prioritized):**
1. 🔴 **HIGH** — Prompt injection / jailbreak in `prompts.ts`
2. 🔴 **HIGH** — Admin dashboard auth bypass in `d4sh-ctrl/`
3. 🔴 **HIGH** — Supabase RLS gaps in all tables
4. 🟡 **MEDIUM** — Rate limit bypass via `x-forwarded-for` spoofing
5. 🟡 **MEDIUM** — Cron endpoint security (`keepalive/route.ts`)
6. 🟡 **MEDIUM** — Model ID injection in chat route body
7. 🟢 **LOW** — Error info leaking to client
8. 🟢 **LOW** — Secrets management verification

**When to invoke:** Before every production deploy, after adding new API routes, after modifying auth, after changing system prompts.

---

## Collaboration Model

```
Developer
    │
    ▼
Main Agent (Antigravity/Claude/Copilot)
    │
    ├─── 🎨 portfolio-frontend-agent ──▶ src/components/, src/styles/
    ├─── ⚙️  portfolio-backend-agent  ──▶ src/app/api/, supabase/migrations/
    ├─── 🧠 portfolio-ai-agent        ──▶ src/lib/ai/, docs/RAG_CHANGELOG.md
    └─── 🔒 portfolio-security-agent  ──▶ Audit reports (read-only)
```

The security agent audits the work of all other agents but never modifies files directly.

---

## Files Created

| File | Purpose |
|------|---------|
| `.agents/skills/portfolio-frontend-agent/SKILL.md` | Frontend agent skill |
| `.agents/skills/portfolio-backend-agent/SKILL.md` | Backend agent skill |
| `.agents/skills/portfolio-ai-agent/SKILL.md` | AI/LLM agent skill |
| `.agents/skills/portfolio-security-agent/SKILL.md` | Security auditor skill |
| `docs/superpowers/specs/2026-07-11-specialized-agents-design.md` | This document |
