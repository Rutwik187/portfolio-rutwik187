import { SectionHead } from "../section-head"
import { WorkList } from "./work-list"

const ID = "work"

export function Work() {
  return (
    <section id={ID} aria-labelledby={`${ID}-title`} className="page-container">
      <SectionHead
        id={`${ID}-title`}
        href={`#${ID}`}
        title="Six products for six clients"
        line="Client products I built and shipped. Open one for screenshots and how it works."
      />

      <WorkList />
    </section>
  )
}
