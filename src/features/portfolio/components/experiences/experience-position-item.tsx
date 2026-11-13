import { differenceInMonths, parse } from "date-fns"

import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tag } from "@/components/ui/tag"
import {
  Collapsible,
  CollapsibleChevronsUpDownIcon,
} from "@/components/collapsible-animated"
import { Markdown } from "@/components/markdown"
import type { ExperiencePosition } from "@/features/portfolio/types/experiences"

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePosition
}) {
  const { start, end } = position.employmentPeriod
  const duration = formatDuration(start, end)

  return (
    <Collapsible
      className="group/experience-position"
      defaultOpen={position.isExpanded}
      disabled={!position.description}
    >
      <CollapsibleTrigger className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring data-disabled:cursor-default">
        <h4 className="text-lg font-medium text-balance">{position.title}</h4>

        <span className="flex items-center gap-3 text-muted-foreground">
          <span className="tabular-nums">
            {start} to {end ?? "now"}
          </span>
          <span className="text-muted-foreground group-data-disabled:hidden [&_svg]:h-lh [&_svg]:w-4">
            <CollapsibleChevronsUpDownIcon duration={0.15} />
          </span>
        </span>

        <dl className="col-span-2 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
          {position.employmentType && (
            <div>
              <dt className="sr-only">Employment type</dt>
              <dd>{position.employmentType}</dd>
            </div>
          )}
          {duration && (
            <div>
              <dt className="sr-only">Duration</dt>
              <dd className="tabular-nums">{duration}</dd>
            </div>
          )}
        </dl>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden">
        {position.description && (
          <div className="typeset typeset-description max-w-[68ch] pt-4">
            <Markdown>{position.description}</Markdown>
          </div>
        )}
      </CollapsibleContent>

      {Array.isArray(position.skills) && position.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-4">
          {position.skills.map((skill, index) => (
            <li key={index} className="flex">
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
  )
}

function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes(".")
  const endHasMonth = end ? end.includes(".") : true

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = parseInt(end, 10) - parseInt(start, 10)
    if (years <= 0) {
      return ""
    }
    return `${years}y`
  }

  const startDate = parsePeriodDate(start, "first")
  const endDate = end ? parsePeriodDate(end, "last") : new Date()

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1
  if (totalMonths <= 0) {
    return ""
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (months === 0) {
    return `${years}y`
  }
  return `${years}y ${months}m`
}

function parsePeriodDate(str: string, fallbackMonth: "first" | "last"): Date {
  if (str.includes(".")) {
    return parse(str, "MM.yyyy", new Date())
  }
  return parse(
    `${fallbackMonth === "last" ? "12" : "01"}.${str}`,
    "MM.yyyy",
    new Date()
  )
}
