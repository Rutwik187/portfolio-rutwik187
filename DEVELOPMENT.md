# Development

## Requirements

- Node.js 22 or newer (`.nvmrc` pins the version CI uses)
- pnpm (the exact version is in `packageManager` in `package.json`)

## Set up

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable                                   | Needed | What it does                                    |
| ------------------------------------------ | ------ | ----------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                      | Yes    | Public URL of the site, used in metadata and OG |
| `NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL` | Yes    | Source for the GitHub contributions graph       |
| `NEXT_PUBLIC_OPENPANEL_CLIENT_ID`          | No     | Turns on OpenPanel analytics                    |
| `NEXT_PUBLIC_GTM_ID`                       | No     | Turns on Google Tag Manager                     |

## Commands

```bash
pnpm dev           # Dev server on http://localhost:3000
pnpm build         # Production build
pnpm start         # Serve the production build
pnpm lint          # ESLint
pnpm format:write  # Prettier
pnpm check-types   # TypeScript
pnpm test:run      # Vitest
```

## Deploy

The site is a standard Next.js app, so Vercel works with no extra setup. Set the environment variables above in the project settings, and set `NEXT_PUBLIC_APP_URL` to the production domain.
