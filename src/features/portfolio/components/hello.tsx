import { Markdown } from "@/components/markdown"
import { XRaySection } from "@/components/x-ray/x-ray-section"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { HelloTitle } from "@/features/portfolio/components/hello-title"
import { USER } from "@/features/portfolio/data/user"

import { HeroTerminal } from "./hero-terminal"

const ID = "about"

/**
 * About, on a band of its own paper: the greeting and the bio as the lead,
 * the shell beside it, and a year of commits across the foot.
 */
export function Hello() {
  return (
    <section
      id={ID}
      aria-labelledby={`${ID}-title`}
      className="border-y border-rule bg-paper-2 py-20 lg:py-30"
    >
      <div className="page-container grid gap-y-16 lg:grid-cols-12 lg:gap-x-(--gap-columns)">
        <div className="lg:col-span-6">
          <h2 id={`${ID}-title`} className="sr-only">
            About
          </h2>
          <HelloTitle />

          <div className="mt-10 max-w-[56ch] space-y-5 text-lg/relaxed text-ink-2 [&_a]:text-foreground [&_a]:underline [&_a]:decoration-rule-2 [&_a]:underline-offset-4 [&_a:hover]:decoration-brand [&_li]:list-none [&_ul]:space-y-5 [&_ul]:p-0">
            <Markdown>{USER.about}</Markdown>
          </div>
        </div>

        <figure className="lg:col-span-5 lg:col-start-8">
          <HeroTerminal className="h-80 bg-card" />
          <figcaption className="mt-4 text-sm text-muted-foreground">
            A real shell. Type help and press Enter.
          </figcaption>
        </figure>

        <XRaySection id="github" className="lg:col-span-12">
          <GitHubContributions />
        </XRaySection>
      </div>
    </section>
  )
}
