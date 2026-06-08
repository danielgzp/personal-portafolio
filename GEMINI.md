# Gemini Agent Instructions

Refer to [AGENTS.md](AGENTS.md) for master project guidelines and cross-agent rules.

## Gemini-Specific Directives
- **Subagents:** You are encouraged to use `@generalist` (or the `invoke_agent` tool) to delegate repetitive or large tasks.
- **Skill Usage:** Use `activate_skill` actively if any task implies UI/UX design, Next.js optimization, or Framer Motion animations.
- **Tools:** Prefer standard tools (`replace`, `read_file`, `grep_search`, `write_file`) natively supported by Gemini CLI.
