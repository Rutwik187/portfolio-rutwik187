import { describe, expect, it } from "vitest"

import { briefSchema, formatBriefEmail, type Brief } from "./hire-brief"

const BRIEF: Brief = {
  name: "Asha Rao",
  email: "asha@example.com",
  kind: "Freelance project",
  message: "We need a booking site for our resort by March.",
  website: "",
}

describe("briefSchema", () => {
  it("accepts a full brief and trims it", () => {
    const result = briefSchema.parse({
      ...BRIEF,
      name: "  Asha Rao ",
      website: undefined,
    })

    expect(result.name).toBe("Asha Rao")
    expect(result.website).toBe("")
  })

  it("asks for an email it can reply to", () => {
    const result = briefSchema.safeParse({ ...BRIEF, email: "asha" })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      "Add an email address I can reply to."
    )
  })

  it("asks for more than a word or two", () => {
    expect(briefSchema.safeParse({ ...BRIEF, message: "hi" }).success).toBe(
      false
    )
  })

  it("only takes the kinds the dialog offers", () => {
    expect(briefSchema.safeParse({ ...BRIEF, kind: "Other" }).success).toBe(
      false
    )
  })
})

describe("formatBriefEmail", () => {
  it("names the sender and the kind of work in the subject", () => {
    expect(formatBriefEmail(BRIEF).subject).toBe(
      "New brief from Asha Rao (freelance project)"
    )
  })

  it("keeps line breaks in a name out of the subject", () => {
    const { subject } = formatBriefEmail({ ...BRIEF, name: "Asha\r\nBcc: x" })

    expect(subject).not.toMatch(/[\r\n]/)
  })

  it("escapes what the visitor wrote in the HTML part", () => {
    const { html, text } = formatBriefEmail({
      ...BRIEF,
      message: "<script>alert(1)</script>",
    })

    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
    expect(text).toContain("<script>alert(1)</script>")
  })
})
