"use client"

import { use, useState } from "react"
import { formatNumber } from "@/utils/format"
import { format, parseISO } from "date-fns"
import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Activity } from "@/components/kit/contribution-graph"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kit/contribution-graph"
import { SOCIAL } from "@/features/portfolio/data/social-links"

import { ContributionSkyline } from "./skyline"

type GraphView = "3d" | "flat"

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>
}) {
  const data = use(contributions)
  const [view, setView] = useState<GraphView>("3d")

  if (data.length === 0) {
    return null
  }

  return (
    <figure>
      <ContributionGraph
        className={cn("mx-auto gap-4 lg:w-full", view === "3d" && "w-full")}
        data={data}
        blockSize={20}
        blockMargin={4}
        blockRadius={3}
        aria-label="GitHub Contributions Graph"
      >
        {view === "3d" ? (
          <ContributionSkyline onUnsupported={() => setView("flat")} />
        ) : (
          <ContributionGraphCalendar
            className="**:data-[slot=month-labels]:text-muted-foreground"
            title="GitHub Contributions"
            aria-hidden
          >
            {({ activity, dayIndex, weekIndex }) => (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <g>
                      <ContributionGraphBlock
                        activity={activity}
                        dayIndex={dayIndex}
                        weekIndex={weekIndex}
                      />
                    </g>
                  }
                />
                <TooltipContent className="font-sans">
                  <p>
                    {activity.count} contribution
                    {activity.count > 1 ? "s" : null} on{" "}
                    {format(parseISO(activity.date), "d MMM yyyy")}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </ContributionGraphCalendar>
        )}

        <ContributionGraphFooter className="items-center gap-y-3 text-sm text-muted-foreground">
          <ContributionGraphTotalCount>
            {({ totalCount }) => (
              <figcaption className="text-pretty tabular-nums">
                {formatNumber(totalCount)} contributions,{" "}
                {format(parseISO(data[0].date), "d MMM yyyy")} to{" "}
                {format(parseISO(data[data.length - 1].date), "d MMM yyyy")}.
                Source:{" "}
                <a
                  href={SOCIAL.github.href}
                  className="link-underline"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </a>
                .
              </figcaption>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend aria-hidden />
          <ViewSwitch view={view} onChange={setView} />
        </ContributionGraphFooter>
      </ContributionGraph>
    </figure>
  )
}

/** Switches the graph between the 3D city and the flat grid. */
function ViewSwitch({
  view,
  onChange,
}: {
  view: GraphView
  onChange: (view: GraphView) => void
}) {
  return (
    <div
      role="group"
      aria-label="Graph view"
      className="flex items-center rounded-full border border-rule p-0.5 font-mono text-xs"
    >
      {(["3d", "flat"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          className={cn(
            "extend-touch-target cursor-pointer rounded-full px-2.5 py-1 lowercase transition-colors",
            view === option
              ? "bg-paper-3 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(option)}
        >
          {option === "3d" ? "3D" : "Flat"}
        </button>
      ))}
    </div>
  )
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-45 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  )
}
