# Rutwik Shinde

Personal portfolio of Rutwik Shinde, a Full Stack AI Developer from Pune, India.

## What is on the site

- **Interactive terminal.** The top of the home page is a working terminal. Type `help` to see the commands. There are a few hidden ones too.
- **Profile.** About, stack, experience, projects, and education, all driven by data files.
- **GitHub contributions graph.** Live data, drawn in the site's saffron accent.
- **Snake.** `/play` is a Snake game played on a contribution graph. Every bite fills in a square.
- **Easter eggs.** Try the Konami code, or open the command menu (`⌘K` or `/`) and brew a chai.
- **Light and dark themes**, an installable web app manifest, a downloadable vCard, and a generated Open Graph image.
- **AI-readable.** `/llms.txt` and the `.md` routes give agents a plain-text version of the profile.

## Stack

- Next.js 16 (App Router)
- React 19 and TypeScript
- Tailwind CSS v4 and shadcn/ui on Base UI
- Motion for animation

## Edit your details

All personal content lives in `src/features/portfolio/data/`:

| File              | What it holds                                         |
| ----------------- | ----------------------------------------------------- |
| `user.ts`         | Name, bio, location, email, avatar, rotating taglines |
| `social-links.ts` | GitHub, LinkedIn, and any other profiles              |
| `experiences.tsx` | Work history                                          |
| `projects.tsx`    | Projects, newest first                                |
| `education.ts`    | Education                                             |
| `tech-stack.tsx`  | The stack section, grouped by category                |

The terminal commands live in `src/features/portfolio/components/hero-terminal.tsx`.

## Run it locally

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open http://localhost:3000. See [DEVELOPMENT.md](./DEVELOPMENT.md) for more.

## Credits

This site started from [chanhdai.com](https://github.com/ncdai/chanhdai.com) by Nguyen Chanh Dai, under the MIT license. The original name, logo, and personal content have been replaced, and the design has been reworked.

## License

[MIT](./LICENSE)
