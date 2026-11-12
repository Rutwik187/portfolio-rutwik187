import { z } from "zod"

import {
  AGENT_TARGET,
  type AgentCatalog,
  type AgentPlan,
  type AgentStep,
} from "./agent-plan"

/** Sections the model may scroll to, with the title shown in the trace. */
export const AGENT_SECTIONS = {
  work: "Selected work",
  about: "About",
  experience: "Experience",
  stack: "Stack",
  projects: "More projects",
  education: "Education",
  contact: "Let's work together",
} as const

type SectionId = keyof typeof AGENT_SECTIONS

const enumOf = (values: string[]) => z.enum(values as [string, ...string[]])

/**
 * What the model must return. Every id is an enum built from the real data,
 * so the model cannot point at a project or a skill that does not exist.
 */
export function agentOutputSchema(catalog: AgentCatalog) {
  const workId = enumOf(catalog.work.map((work) => work.id))
  const techKey = enumOf(catalog.tech.map((tech) => tech.key))

  return z.object({
    intent: z
      .string()
      .max(60)
      .describe('A short function-call label, e.g. open_project("disha")'),
    actions: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("scroll"),
            section: enumOf(Object.keys(AGENT_SECTIONS)),
          }),
          z.object({ type: z.literal("point_work"), id: workId }),
          z.object({ type: z.literal("open_work"), id: workId }),
          z.object({ type: z.literal("point_tech"), key: techKey }),
          z.object({ type: z.literal("open_brief") }),
          z.object({ type: z.literal("show_code") }),
          z.object({ type: z.literal("toggle_theme") }),
        ])
      )
      .max(5),
    answer: z
      .string()
      .max(400)
      .describe("One or two short sentences, in plain text"),
    followUps: z
      .array(z.string().max(60))
      .max(3)
      .describe("Two or three short questions the visitor may ask next"),
  })
}

export type AgentOutput = z.infer<ReturnType<typeof agentOutputSchema>>

/** Turns the model's actions into steps the page knows how to act out. */
export function toAgentPlan(
  output: AgentOutput,
  catalog: AgentCatalog
): AgentPlan {
  const titleOf = (id: string) =>
    catalog.work.find((work) => work.id === id)?.title ?? id
  const techOf = (key: string) =>
    catalog.tech.find((tech) => tech.key === key)?.title ?? key

  const steps = output.actions.flatMap((action): AgentStep[] => {
    switch (action.type) {
      case "scroll": {
        const section = action.section as SectionId
        return [
          {
            kind: "scroll",
            target: AGENT_TARGET.section(section),
            label: `Scroll to ${AGENT_SECTIONS[section]}`,
          },
        ]
      }
      case "point_work":
        return [
          {
            kind: "point",
            target: AGENT_TARGET.work(action.id),
            label: `Find ${titleOf(action.id)}`,
          },
        ]
      case "open_work":
        return [
          {
            kind: "click",
            target: AGENT_TARGET.work(action.id),
            label: `Open ${titleOf(action.id)}`,
          },
        ]
      case "point_tech":
        return [
          {
            kind: "point",
            target: AGENT_TARGET.tech(action.key),
            label: `Find ${techOf(action.key)}`,
          },
        ]
      case "open_brief":
        return [
          {
            kind: "click",
            target: AGENT_TARGET.hire,
            label: "Open the project brief",
          },
        ]
      case "show_code":
        return [{ kind: "xray", label: "Turn on X-ray" }]
      case "toggle_theme":
        return [{ kind: "theme", label: "Switch the theme" }]
    }
  })

  return {
    intent: output.intent,
    steps,
    answer: output.answer,
    followUps: [
      ...new Set(output.followUps.map((question) => question.trim())),
    ].filter(Boolean),
  }
}
