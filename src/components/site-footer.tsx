import Link from "next/link"

import { TEMPLATE_CREDIT } from "@/config/site"
import { RutwikMark } from "@/components/rutwik-mark"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

const KONAMI_HINT = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"]

/** Stamped by `next.config.ts`, so the year only moves when the site is rebuilt. */
const BUILD_YEAR = new Date(
  process.env.BUILD_TIMESTAMP ?? Date.now()
).getFullYear()

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2 pb-[calc(var(--fade-bottom-height)+env(safe-area-inset-bottom,0))] sm:pb-0">
      <div className="mx-auto border-x md:max-w-3xl">
        <div className="ruler-divider h-8" aria-hidden />

        <div className="screen-line-top grid gap-6 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <RutwikMark className="size-8" />
              <p className="text-lg font-medium tracking-tight">
                {USER.displayName}
              </p>
            </div>

            <p className="max-w-sm text-sm text-balance text-muted-foreground">
              Designed and built in Pune, India. Fuelled by cutting chai and the
              occasional{" "}
              <span className="font-mono text-foreground">
                git push --force
              </span>
              .
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    className="link-underline"
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
              <li>
                <Link className="link-underline" href="/play">
                  Snake
                </Link>
              </li>
              <li>
                <a className="link-underline" href="/llms.txt" target="_blank">
                  llms.txt
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="screen-line-top flex flex-col gap-2 px-4 py-3 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {BUILD_YEAR} {USER.displayName}. Started from{" "}
            <a
              className="link-underline"
              href={TEMPLATE_CREDIT.url}
              target="_blank"
              rel="noopener"
            >
              {TEMPLATE_CREDIT.name}
            </a>{" "}
            (MIT).
          </p>

          <p
            className="flex items-center gap-1"
            title="Try it on a keyboard"
            aria-label="Hint: type the Konami code"
          >
            <span>psst:</span>
            {KONAMI_HINT.map((key, index) => (
              <kbd
                key={index}
                className="inline-flex h-4 min-w-4 items-center justify-center rounded-sm border border-line px-0.5 text-[0.625rem]/none"
              >
                {key}
              </kbd>
            ))}
          </p>
        </div>
      </div>
      <div className="screen-line-top h-px" />
    </footer>
  )
}
