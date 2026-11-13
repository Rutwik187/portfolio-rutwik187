import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { XRaySection } from "@/components/x-ray/x-ray-section"
import { Education } from "@/features/portfolio/components/education"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import type { Experience } from "@/features/portfolio/types/experiences"

import { SectionHead } from "../section-head"
import { ExperienceItem } from "./experience-item"

const ID = "experience"
const MAX = 3

/** The record: each company a row, its roles beside it, then education. */
export function Experiences() {
  return (
    <section id={ID} aria-labelledby={`${ID}-title`} className="page-container">
      <SectionHead
        id={`${ID}-title`}
        href={`#${ID}`}
        title="Roles since 2022"
      />

      <ExperienceList experiences={EXPERIENCES.slice(0, MAX)} />

      {EXPERIENCES.length > MAX && (
        <Collapsible className="group/collapsible">
          <CollapsibleContent>
            <ExperienceList experiences={EXPERIENCES.slice(MAX)} />
          </CollapsibleContent>

          <div className="flex justify-center border-t border-rule py-6">
            <CollapsibleTrigger
              render={
                <Button variant="outline" size="pill" className="lowercase">
                  <span className="hidden group-data-closed/collapsible:block">
                    Show more
                  </span>
                  <span className="hidden group-data-open/collapsible:block">
                    Show less
                  </span>
                  <ChevronDownIcon className="group-data-open/collapsible:rotate-180" />
                </Button>
              }
            />
          </div>
        </Collapsible>
      )}

      <XRaySection id="education" className="mt-20 lg:mt-28">
        <Education />
      </XRaySection>
    </section>
  )
}

function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <>
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </>
  )
}
