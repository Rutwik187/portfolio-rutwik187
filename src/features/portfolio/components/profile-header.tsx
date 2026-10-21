import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note"
import { HeroTerminal } from "./hero-terminal"
import { PuneStatus } from "./pune-status"

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x screen-line-bottom-border after:z-1">
      <figure className="relative col-span-2 dot-grid p-3 sm:col-span-1 sm:col-start-2 sm:p-4">
        <HeroTerminal className="h-64 sm:h-68" />

        <HandwrittenNote
          className="top-24 left-full hidden w-36 flex-col items-start xl:flex"
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

      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line">
          <div className="mx-0.5 my-0.75 flex outline-none">
            <div className="relative size-30 rounded-full min-[24rem]:size-32 sm:size-40">
              <img
                className="block size-full rounded-[inherit] object-cover select-none"
                src={USER.avatar}
                alt={`Portrait of ${USER.displayName}`}
                width={160}
                height={160}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] inset-ring-1 inset-ring-foreground/30 dark:inset-ring-foreground/10" />
              <PuneStatus className="absolute right-1.5 bottom-1.5 sm:right-3 sm:bottom-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex -translate-x-px flex-wrap items-center gap-x-2.5 gap-y-1 pl-4">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">
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

          <FlipSentences className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>
    </div>
  )
}
