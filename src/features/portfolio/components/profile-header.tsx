import { AgentPrompt } from "@/components/agent/agent-prompt"
import { USER } from "@/features/portfolio/data/user"

import { EmailButton } from "./email-button"
import { HeroFieldCanvas } from "./hero-field/hero-field-canvas"
import { HeroFieldIndex } from "./hero-field/hero-field-index"
import { HireButton } from "./hire/hire-button"

/**
 * The first screen, in two columns that always fit it. On the left, the words:
 * the index of what Rutwik builds, the headline, who he is and the two
 * actions. On the right, the live field, where a cloud of particles keeps
 * coming together as a web app, a mobile app and an AI agent, with the agent
 * prompt under it. The headline is sized to its column and to the screen's
 * height, so the actions stay above the fold on a laptop.
 *
 * On phones it stacks: the field, the words, then the agent.
 */
export function ProfileHeader() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate page-container flex flex-col gap-10 pt-6 pb-16 lg:grid lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-12 lg:gap-x-(--gap-columns) lg:py-10"
    >
      <HeroFieldCanvas className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 mask-b-from-75% mask-b-to-100%" />

      <div className="@container order-1 flex flex-col gap-8 lg:col-span-7 lg:row-start-1 lg:justify-between">
        <HeroFieldIndex className="max-lg:hidden" />

        <div className="flex flex-col gap-8">
          <h1
            id="hero-title"
            className="font-display text-marquee tracking-display lowercase lg:text-[min(13.6cqi,19svh)]"
          >
            messy ideas in.
            <br />
            shipped
            <br className="sm:hidden" /> products out.
          </h1>

          <p className="flex items-center gap-4 text-lead text-muted-foreground">
            <img
              className="size-12 shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-foreground/10 select-none"
              src={USER.avatar}
              alt=""
              width={48}
              height={48}
            />
            <span>
              I’m <span className="text-foreground">{USER.displayName}</span>, a
              full stack AI developer in Pune.
            </span>
          </p>

          <div className="flex flex-wrap gap-3">
            <HireButton
              source="intro"
              variant="brand"
              size="pill"
              className="lowercase"
            >
              Hire me
            </HireButton>
            <EmailButton variant="outline" size="pill" className="lowercase" />
          </div>
        </div>
      </div>

      {/* Below lg the column dissolves, so the field leads and the agent ends. */}
      <div className="contents lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:flex lg:flex-col lg:gap-6">
        <div className="relative order-0 h-[min(84vw,22rem)] lg:h-auto lg:min-h-52 lg:flex-1">
          <div
            data-hero-field-anchor
            className="absolute inset-x-0 top-0 bottom-10 lg:inset-0"
            aria-hidden
          />
          <HeroFieldIndex className="absolute bottom-0 left-0 lg:hidden" />
        </div>

        <div data-hero-field-floor className="order-3">
          <AgentPrompt />
        </div>
      </div>
    </section>
  )
}
