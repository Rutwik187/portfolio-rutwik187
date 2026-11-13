import { AgentPrompt } from "@/components/agent/agent-prompt"
import { USER } from "@/features/portfolio/data/user"

import { EmailButton } from "./email-button"
import { HeroFieldCanvas } from "./hero-field/hero-field-canvas"
import { HeroFieldIndex } from "./hero-field/hero-field-index"
import { HireButton } from "./hire/hire-button"

/**
 * The first screen. A ledge: a live field above, the headline resting at the
 * base with the byline and the two actions under it. In the field, a cloud
 * of particles keeps coming together as a web app, a mobile app and an AI
 * agent, which is the headline acted out. On wide screens the agent sits on
 * the ledge too, in the space the short first line leaves.
 */
export function ProfileHeader() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate page-container flex flex-col gap-10 pt-6 pb-16 [--hero-foot:3rem] [--hero-pb:3.5rem] lg:grid lg:min-h-[calc(100svh-var(--header-height)-var(--banner-height))] lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_auto] lg:gap-x-(--gap-columns) lg:gap-y-10 lg:pt-10 lg:pb-(--hero-pb) xl:grid-rows-[1fr_auto_auto]"
    >
      <HeroFieldCanvas className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 mask-b-from-70% mask-b-to-100%" />

      <div className="relative order-0 h-[min(84vw,22rem)] lg:col-span-12 lg:h-auto lg:min-h-64">
        <div
          data-hero-field-anchor
          className="absolute inset-x-0 top-0 bottom-10 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-1/2 xl:w-5/12"
          aria-hidden
        />
        <HeroFieldIndex className="absolute bottom-0 left-0 lg:top-0 lg:bottom-auto" />
      </div>

      <div
        data-hero-field-floor
        className="hero-ledge-panel order-3 lg:order-0 lg:max-xl:col-span-6 lg:max-xl:col-start-7"
      >
        <AgentPrompt />
      </div>

      <h1
        id="hero-title"
        className="order-1 font-display text-marquee tracking-display lowercase lg:order-0 lg:col-span-12"
      >
        messy ideas in.
        <br />
        shipped
        <br className="sm:hidden" /> products out.
      </h1>

      <div className="order-2 flex flex-col gap-6 lg:order-0 lg:col-span-12 lg:h-(--hero-foot) lg:flex-row lg:items-center lg:justify-between">
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
    </section>
  )
}
