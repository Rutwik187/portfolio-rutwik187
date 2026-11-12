import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { WORK } from "@/features/portfolio/data/work"

import type { AgentCatalog } from "./agent-plan"

/**
 * The facts the agent may use, built on the server so the browser gets a
 * small JSON summary instead of the icons and images behind the real data.
 */
export function getAgentCatalog(): AgentCatalog {
  const [current] = EXPERIENCES
  const positions = EXPERIENCES.flatMap((experience) => experience.positions)
  const firstYear = positions
    .map((position) => position.employmentPeriod.start)
    .sort()[0]

  return {
    work: WORK.map((work) => ({
      id: work.id,
      title: work.title,
      client: work.client,
      kind: work.kind,
      year: work.year,
      summary: work.summary,
      stack: work.stack,
    })),
    tech: TECH_STACK.map((item) => ({ key: item.key, title: item.title })),
    currentRole: {
      title: current.positions[0].title,
      company: current.companyName,
    },
    roleCount: positions.length,
    firstYear,
  }
}
