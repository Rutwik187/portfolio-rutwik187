import { describe, expect, it } from "vitest"

import { AGENT_TARGET, planFor, type AgentCatalog } from "./agent-plan"

const CATALOG: AgentCatalog = {
  work: [
    {
      id: "knowledge-hub",
      title: "Quantum Knowledge Hub",
      client: "Quantum CS",
      kind: "AI",
      year: "2025–26",
      summary: "Document ingestion and RAG search",
      stack: ["Next.js 15", "Python", "Gemini"],
    },
    {
      id: "govats",
      title: "Govats devotee app",
      client: "Govats seva organisation",
      kind: "Mobile",
      year: "2026",
      summary: "QR meal passes",
      stack: ["Expo SDK 54", "React Native"],
    },
    {
      id: "disha",
      title: "Disha",
      client: "NISAU, UK",
      kind: "AI",
      year: "2026",
      summary: "An AI assistant for students",
      stack: ["Next.js 16", "Claude"],
    },
    {
      id: "high-octane",
      title: "High Octane",
      client: "High Octane, Pune",
      kind: "Web",
      year: "2026",
      summary: "Online booking",
      stack: ["Next.js 16"],
    },
  ],
  tech: [
    { key: "python", title: "Python" },
    { key: "nextjs", title: "Next.js" },
    { key: "docker", title: "Docker" },
  ],
  currentRole: { title: "Full Stack AI Developer", company: "AIEdX" },
  roleCount: 3,
  firstYear: "2022",
}

const plan = (question: string) => planFor(question, CATALOG)

describe("planFor", () => {
  it("opens a project named by title or by client", () => {
    expect(plan("Tell me about Disha").intent).toBe('open_project("disha")')
    expect(plan("what did you build for NISAU?").intent).toBe(
      'open_project("disha")'
    )
    expect(plan("govats").steps.at(-1)).toMatchObject({
      kind: "click",
      target: AGENT_TARGET.work("govats"),
    })
  })

  it("needs a distinctive word to match a project", () => {
    expect(plan("high quality work").intent).toBe("list_work()")
  })

  it("checks a skill and points at where it shipped", () => {
    const result = plan("Does he know Python?")
    expect(result.intent).toBe('check_skill("python")')
    expect(result.answer).toContain("Quantum Knowledge Hub")
    expect(result.steps.map((step) => step.kind)).toEqual([
      "scroll",
      "point",
      "scroll",
      "point",
    ])
  })

  it("reads punctuated tech names", () => {
    expect(plan("any next.js work?").intent).toBe('check_skill("nextjs")')
  })

  it("does not claim a skill was shipped when it was not", () => {
    expect(plan("docker?").answer).toBe("Yes. Docker is in his stack.")
  })

  it("filters work by kind, matching whole words only", () => {
    const result = plan("show me his AI work")
    expect(result.answer).toContain("2 AI projects")
    expect(result.answer).toContain("Quantum Knowledge Hub and Disha")
    // "available" contains "ai" but is a hiring question.
    expect(plan("is he available?").intent).toBe("start_brief()")
  })

  it("routes hiring, code and fallback questions", () => {
    expect(plan("How much does he cost").steps.at(-1)).toMatchObject({
      target: AGENT_TARGET.hire,
    })
    expect(plan("show me the code").steps).toEqual([
      { kind: "xray", label: "Turn on X-ray" },
    ])
    const unknown = plan("what is the weather")
    expect(unknown.intent).toBe("unknown()")
    expect(unknown.steps).toEqual([])
  })

  it("answers experience questions from the catalog", () => {
    expect(plan("how many years of experience?").answer).toBe(
      "3 roles since 2022. Today he is a Full Stack AI Developer at AIEdX."
    )
  })
})
