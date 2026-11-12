import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note"
import { HeroTerminal } from "./hero-terminal"
import { Intro } from "./intro"
import { PuneStatus } from "./pune-status"

/** The top of the home page: who I am and what I build, next to the terminal. */
export function ProfileHeader() {
  return (
    <section className="grid items-center gap-12 px-4 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pt-24">
      <div className="min-w-0 space-y-8">
        <AvailabilityBadge />

        <div className="flex items-center gap-4">
          <div className="relative size-18 shrink-0 rounded-full sm:size-20">
            <img
              className="block size-full rounded-[inherit] object-cover select-none"
              src={USER.avatar}
              alt={`Portrait of ${USER.displayName}`}
              width={80}
              height={80}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] inset-ring-1 inset-ring-foreground/15 dark:inset-ring-foreground/10" />
            <PuneStatus className="absolute -right-0.5 -bottom-0.5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <h1 className="text-2xl/none font-medium tracking-tight sm:text-3xl/none">
                {USER.displayName}
              </h1>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <span
                      className="cursor-help rounded-md bg-brand/12 px-1.5 py-0.5 font-mono text-xs font-medium tracking-widest text-brand-strong select-none"
                      tabIndex={0}
                    >
                      PNQ
                    </span>
                  }
                />
                <TooltipContent>
                  Pune, India. Yes, that is the airport code.
                </TooltipContent>
              </Tooltip>
            </div>

            <FlipSentences className="mt-2 h-5">
              {USER.flipSentences}
            </FlipSentences>
          </div>
        </div>

        <Intro />
      </div>

      <figure className="relative min-w-0">
        {/* A soft saffron light behind the terminal. */}
        <div
          className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)]"
          aria-hidden
        />
        <HeroTerminal className="h-64 sm:h-72" />

        <HandwrittenNote
          className="top-20 left-full ml-4 hidden w-36 flex-col items-start min-[1360px]:flex"
          aria-hidden
        >
          <HandwrittenArrow className="-scale-y-100 -rotate-6" />
          <span className="ml-3 -rotate-6">
            it&apos;s a real terminal,
            <span className="block" />
            try typing help
          </span>
        </HandwrittenNote>
      </figure>
    </section>
  )
}

function AvailabilityBadge() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border bg-background/60 py-1 pr-3 pl-2.5 text-sm text-muted-foreground backdrop-blur-sm">
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      Available for freelance and full-time work
    </p>
  )
}
