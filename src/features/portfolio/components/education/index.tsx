import { EDUCATION } from "@/features/portfolio/data/education"

import { EducationItem } from "./education-item"

const ID = "education"

/** Education, set as the last rows of the record. */
export function Education() {
  return (
    <div id={ID} aria-labelledby={`${ID}-title`} role="region">
      <h3
        id={`${ID}-title`}
        className="mb-10 font-display text-display-s tracking-display lowercase"
      >
        <a
          href={`#${ID}`}
          className="underline-offset-[0.12em] hover:underline"
        >
          A CGPA above 9 at RSCOE
        </a>
      </h3>

      {EDUCATION.map((item) => (
        <div
          key={item.id}
          id={`education-${item.id}`}
          className="grid scroll-mt-24 gap-y-6 border-t border-rule py-8 lg:grid-cols-12 lg:gap-x-(--gap-columns) lg:py-10"
        >
          <EducationItem item={item} />
        </div>
      ))}
    </div>
  )
}
