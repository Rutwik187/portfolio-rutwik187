import { addQueryParams } from "@/utils/url"
import { LinkIcon } from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tag } from "@/components/ui/tag"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleChevronsUpDownIcon,
} from "@/components/collapsible-animated"
import { Markdown } from "@/components/markdown"

import type { Project } from "../../types/projects"

export function ProjectItem({
  className,
  project,
}: {
  className?: string
  project: Project
}) {
  const { start, end } = project.period
  const isSinglePeriod = end === start

  return (
    <Collapsible className={className} defaultOpen={project.isExpanded}>
      {/* Only the title is the trigger (accordion pattern); its overlay keeps
          the whole row clickable, while the project link sits above it. */}
      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-5 transition-colors duration-150 hover:bg-paper-2 lg:grid-cols-12 lg:gap-x-(--gap-columns)">
        <h3 className="font-display text-title tracking-display lowercase lg:col-span-6">
          <CollapsibleTrigger className="text-left lowercase outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <span className="absolute inset-0" aria-hidden />
            {project.title}
          </CollapsibleTrigger>
        </h3>

        <dl className="hidden text-muted-foreground lg:col-span-3 lg:block">
          <dt className="sr-only">Period</dt>
          <dd className="tabular-nums">
            {isSinglePeriod ? start : `${start} to ${end ?? "now"}`}
          </dd>
        </dl>

        <div className="flex items-center justify-end gap-4 lg:col-span-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                  href={addQueryParams(project.link, UTM_PARAMS)}
                  target="_blank"
                  rel="noopener"
                  aria-label="Open project"
                >
                  <LinkIcon className="pointer-events-none size-4" />
                </a>
              }
            />
            <TooltipContent>
              <p>Open project</p>
            </TooltipContent>
          </Tooltip>

          <div className="shrink-0 text-muted-foreground [&_svg]:size-4">
            <CollapsibleChevronsUpDownIcon duration={0.15} />
          </div>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden">
        <div className="space-y-4 pb-8 lg:ml-[calc((100%-11*var(--gap-columns))/12*6+6*var(--gap-columns))]">
          <p className="text-sm text-muted-foreground tabular-nums lg:hidden">
            {isSinglePeriod ? start : `${start} to ${end ?? "now"}`}
          </p>
          {project.description && (
            <div className="typeset typeset-description max-w-[60ch]">
              <Markdown>{project.description}</Markdown>
            </div>
          )}

          {project.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
