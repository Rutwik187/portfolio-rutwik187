import { describe, expect, it } from "vitest"

import { agentOutputSchema, toAgentPlan } from "./agent-actions"
import { AGENT_TARGET, type AgentCatalog } from "./agent-plan"

const CATALOG: AgentCatalog = {
  work: [
    {
      id: "disha",
      title: "Disha",
      client: "NISAU, UK",
      kind: "AI",
      year: "2026",
      summary: "An AI assistant",
      stack: ["Claude"],
    },
  ],
  tech: [{ key: "python", title: "Python" }],
  currentRole: { title: "Full Stack AI Developer", company: "AIEdX" },
  roleCount: 3,
  firstYear: "2022",
}

const schema = agentOutputSchema(CATALOG)

describe("agentOutputSchema", () => {
  it("accepts actions on real ids", () => {
    const result = schema.safeParse({
      intent: 'open_project("disha")',
      actions: [{ type: "open_work", id: "disha" }],
      answer: "Disha is an AI assistant.",
      followUps: ["Is he available?"],
    })
    expect(result.success).toBe(true)
  })

  it("rejects a project or skill the data does not have", () => {
    const invented = (action: object) =>
      schema.safeParse({
        intent: "x",
        actions: [action],
        answer: "x",
        followUps: [],
      }).success

    expect(invented({ type: "open_work", id: "made-up-app" })).toBe(false)
    expect(invented({ type: "point_tech", key: "rust" })).toBe(false)
    expect(invented({ type: "scroll", section: "secrets" })).toBe(false)
    expect(invented({ type: "run_script", code: "alert(1)" })).toBe(false)
  })

  it("limits how many actions one answer can take", () => {
    const actions = Array.from({ length: 6 }, () => ({ type: "show_code" }))
    expect(
      schema.safeParse({ intent: "x", actions, answer: "x", followUps: [] })
        .success
    ).toBe(false)
  })

  it("limits how many follow-ups one answer can offer", () => {
    const followUps = ["a", "b", "c", "d"]
    expect(
      schema.safeParse({ intent: "x", actions: [], answer: "x", followUps })
        .success
    ).toBe(false)
  })
})

describe("toAgentPlan", () => {
  it("maps actions to labelled steps on the right elements", () => {
    const plan = toAgentPlan(
      {
        intent: 'check_skill("python")',
        actions: [
          { type: "scroll", section: "stack" },
          { type: "point_tech", key: "python" },
          { type: "open_work", id: "disha" },
          { type: "open_brief" },
          { type: "show_code" },
        ],
        answer: "Yes.",
        followUps: [" Is he available? ", "Is he available?", ""],
      },
      CATALOG
    )

    expect(plan.steps).toEqual([
      { kind: "scroll", target: "#stack", label: "Scroll to Stack" },
      {
        kind: "point",
        target: AGENT_TARGET.tech("python"),
        label: "Find Python",
      },
      {
        kind: "click",
        target: AGENT_TARGET.work("disha"),
        label: "Open Disha",
      },
      {
        kind: "click",
        target: AGENT_TARGET.hire,
        label: "Open the project brief",
      },
      { kind: "xray", label: "Turn on X-ray" },
    ])
    expect(plan.intent).toBe('check_skill("python")')
    expect(plan.answer).toBe("Yes.")
    expect(plan.followUps).toEqual(["Is he available?"])
  })
})
