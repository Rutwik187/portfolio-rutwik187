import { USER } from "../../data/user"
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
        line={`Picked from work for ${USER.clientCount} clients since ${USER.buildingSince}. Open one for screenshots and how it works.`}
      />

      <WorkList />
    </section>
  )
}
