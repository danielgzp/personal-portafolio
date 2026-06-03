# Daniel González — Interactive AI Portfolio

Welcome to my personal interactive portfolio! This repository contains the source code for my professional developer site: a high-fidelity, bilingual (English & Spanish) showcase that integrates a custom AI Chatbot assistant to answer questions about my work.

---

## ✨ Key Features

* **Bilingual Experience**: Full internationalization support with instant English/Spanish toggle.
* **Interactive AI Assistant**: A custom chatbot powered by Retrieval-Augmented Generation (RAG) that can answer questions about my projects, frontend architecture decisions, and professional background.
* **High-Fidelity UI**: Smooth transitions, interactive animations (using Framer Motion), and pixel-perfect design built with Tailwind CSS v4.
* **Responsive Split-Panel**: Dual-column layout that gracefully collapses into slideable panels on mobile devices.
* **Secure API Guarding**: Edge rate limiting to prevent spam and ensure stable service availability.

---

## 🛠️ Built With

* **Framework**: [Next.js](https://nextjs.org/) (App Router) & [React](https://react.dev/)
* **Styling & Motion**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), and [shadcn/ui](https://ui.shadcn.com/)
* **Database & Search**: [Supabase](https://supabase.com/) (PostgreSQL with `pgvector` for semantic search)
* **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) supporting Google Gemini and Groq
* **State & Performance**: [Zustand](https://zustand-demo.pmnd.rs/) and [Upstash Redis](https://upstash.com/) for rate-limiting
* **Localization**: [next-intl](https://next-intl-docs.vercel.app/)

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js**: `24.x` (or latest LTS)
* **pnpm**: `10.x` or higher

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Client
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_role_key

# AI Model Provider API Keys
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# Cron Keep-Alive Token
CRON_SECRET=your_cron_secret_token
```

### 3. Local Development
To run the project locally, run:

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Build the production bundle
pnpm build
```

---

## 💅 Contribution & Code Standards
* **Formatting**: Maintain clean imports and follow code patterns without relying on automatic background formatters.
* **Naming**:
  * Components & Types: `PascalCase`
  * Functions & Hooks: `camelCase`
  * Directories: `lowercase-with-dashes`
* **Tailwind**: Use `size-{n}` for matching height and width variables, and HSL semantic colors to support system-wide light/dark themes.
