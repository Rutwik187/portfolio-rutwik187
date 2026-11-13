import { CollapsibleList } from "@/components/collapsible-list"
import { PROJECTS } from "@/features/portfolio/data/projects"

import { SectionHead } from "../section-head"
import { ProjectItem } from "./project-item"

const ID = "projects"

export function Projects() {
  return (
    <section id={ID} aria-labelledby={`${ID}-title`} className="page-container">
      <SectionHead
        id={`${ID}-title`}
        href={`#${ID}`}
        title={`${PROJECTS.length} more builds`}
      />

      <CollapsibleList
        items={PROJECTS}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </section>
  )
}
