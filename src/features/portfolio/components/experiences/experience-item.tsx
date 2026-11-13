import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"

import type { Experience } from "../../types/experiences"
import { ExperiencePositionItem } from "./experience-position-item"

/** One company: its name and place on the left, its roles on the right. */
export function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div
      id={`experience-${experience.id}`}
      className="grid scroll-mt-24 gap-y-6 border-t border-rule py-8 lg:grid-cols-12 lg:gap-x-(--gap-columns) lg:py-10"
    >
      <div className="lg:col-span-4">
        <h3 className="font-display text-title tracking-display lowercase">
          {experience.companyWebsite ? (
            <a
              className="underline-offset-4 hover:underline"
              href={addQueryParams(experience.companyWebsite, UTM_PARAMS)}
              target="_blank"
              rel="noopener"
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.location && experience.locationType && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {experience.location} ({experience.locationType.toLowerCase()})
          </p>
        )}
      </div>

      <div className="space-y-8 lg:col-span-8">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  )
}
