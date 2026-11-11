# AI agent guidelines

Next.js 16 (App Router) personal portfolio for Rutwik Shinde.

**Stack**: TypeScript, React 19, Tailwind CSS v4, shadcn/ui on Base UI, Motion, Vitest, pnpm

## Project structure

| Directory                              | Purpose                                                      |
| -------------------------------------- | ------------------------------------------------------------ |
| `src/app/`                             | App Router pages, layouts, OG image, llms.txt and .md routes |
| `src/components/`                      | Shared UI: header, footer, command menu, snake game          |
| `src/components/ui/`                   | shadcn/ui primitives                                         |
| `src/components/kit/`                  | Larger reusable pieces (contribution graph, text flip, …)    |
| `src/features/portfolio/`              | Home page sections, their data, and their types              |
| `src/config/`                          | Site config (`site.ts`) and JSON-LD                          |
| `src/hooks/`, `src/lib/`, `src/utils/` | Hooks, libraries, utilities                                  |

**Key files**: `src/features/portfolio/data/` (all personal content, including `work.ts` for the selected work), `src/assets/work/` (project screenshots), `src/features/portfolio/components/hero-terminal.tsx` (terminal commands), `src/styles/globals.css` (theme tokens, including the `--brand` saffron accent)

## Coding guidelines

- TypeScript strict mode; explicit types when necessary
- kebab-case file naming
- Descriptive names; comments only for "why", not "what"
- Tailwind CSS v4 syntax; support dark and light modes
- Use the `brand` colour tokens for accents instead of hard-coded orange
- Headings in sentence case

## Commands

```bash
pnpm dev           # Dev server
pnpm build         # Production build
pnpm test:run      # Vitest (single run)
pnpm lint          # ESLint
pnpm format:write  # Prettier
pnpm check-types   # Type checking (tsc --noEmit)
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
