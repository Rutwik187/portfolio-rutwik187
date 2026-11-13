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
import type { Education } from "@/features/portfolio/types/education"

/** The school on the left; the degree, years and notes on the right. */
export function EducationItem({ item }: { item: Education }) {
  const { start, end } = item.period

  return (
    <>
      <h4 className="font-display text-title tracking-display lowercase lg:col-span-4">
        {item.school}
      </h4>

      <Collapsible
        className="lg:col-span-8"
        defaultOpen={item.isExpanded}
        disabled={!item.description}
      >
        <CollapsibleTrigger className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring data-disabled:cursor-default">
          <span className="text-lg font-medium text-balance">
            {item.degree ?? item.fieldOfStudy}
          </span>

          <span className="flex items-center gap-3 text-muted-foreground">
            <span className="tabular-nums">
              {start} to {end ?? "now"}
            </span>
            <span className="text-muted-foreground group-data-disabled:hidden [&_svg]:h-lh [&_svg]:w-4">
              <CollapsibleChevronsUpDownIcon duration={0.15} />
            </span>
          </span>

          {item.degree && item.fieldOfStudy && (
            <span className="col-span-2 text-sm text-muted-foreground">
              {item.fieldOfStudy}
            </span>
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden">
          {item.description && (
            <div className="typeset typeset-description max-w-[68ch] pt-4">
              <Markdown>{item.description}</Markdown>
            </div>
          )}
        </CollapsibleContent>

        {Array.isArray(item.skills) && item.skills.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-4">
            {item.skills.map((skill, index) => (
              <li key={index} className="flex">
                <Tag>{skill}</Tag>
              </li>
            ))}
          </ul>
        )}
      </Collapsible>
    </>
  )
}
