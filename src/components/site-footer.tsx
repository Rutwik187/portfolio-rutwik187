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
    <footer className="mt-24 max-w-screen overflow-x-clip border-t border-rule bg-paper-2 pb-[calc(var(--fade-bottom-height)+env(safe-area-inset-bottom,0))] sm:pb-12 lg:mt-36 lg:pb-16">
      <div className="page-container grid gap-y-10 pt-14 lg:grid-cols-12 lg:gap-x-(--gap-columns) lg:pt-20">
        <div className="flex items-center gap-3 lg:col-span-4">
          <RutwikMark className="size-8" />
          <p className="font-display text-title tracking-display lowercase">
            {USER.displayName}
          </p>
        </div>

        <p className="max-w-[52ch] text-[0.9375rem] text-pretty text-muted-foreground lg:col-span-5">
          Designed and built in Pune, India. Fuelled by cutting chai and the
          occasional{" "}
          <code className="font-mono text-foreground">git push --force</code>. ©{" "}
          {BUILD_YEAR} {USER.displayName}. Started from{" "}
          <a
            className="text-foreground underline decoration-rule-2 underline-offset-4 hover:decoration-brand"
            href={TEMPLATE_CREDIT.url}
            target="_blank"
            rel="noopener"
          >
            {TEMPLATE_CREDIT.name}
          </a>{" "}
          (MIT).
        </p>

        <nav aria-label="Footer" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] lg:justify-end">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.name}>
                <a
                  className="underline decoration-rule-2 underline-offset-4 hover:decoration-brand"
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                >
                  {link.title}
                </a>
              </li>
            ))}
            <li>
              <Link
                className="underline decoration-rule-2 underline-offset-4 hover:decoration-brand"
                href="/play"
              >
                Snake
              </Link>
            </li>
            <li>
              <a
                className="underline decoration-rule-2 underline-offset-4 hover:decoration-brand"
                href="/llms.txt"
                target="_blank"
              >
                llms.txt
              </a>
            </li>
          </ul>
        </nav>

        <p
          className="flex items-center gap-1 text-sm text-muted-foreground lg:col-span-12"
          title="Try it on a keyboard"
          aria-label="Hint: type the Konami code"
        >
          <span className="mr-1">psst</span>
          {KONAMI_HINT.map((key, index) => (
            <kbd
              key={index}
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-rule-2 px-1 text-xs/none"
            >
              {key}
            </kbd>
          ))}
        </p>
      </div>
    </footer>
  )
}
