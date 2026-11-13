import { describe, expect, it } from "vitest"

import { buildChaos, buildForm, FORM_IDS } from "./hero-field-shapes"

describe("buildForm", () => {
  it.each(FORM_IDS)("places every particle of the %s form", (id) => {
    const count = 5003
    const form = buildForm(id, count)

    expect(form.positions).toHaveLength(count * 3)
    expect(form.accents).toHaveLength(count)
    expect(form.positions.every(Number.isFinite)).toBe(true)
  })

  it.each(FORM_IDS)(
    "keeps the %s form inside a box about one unit tall",
    (id) => {
      const { positions } = buildForm(id, 4000)
      let maxX = 0
      let maxY = 0
      let maxZ = 0
      for (let i = 0; i < positions.length; i += 3) {
        maxX = Math.max(maxX, Math.abs(positions[i]))
        maxY = Math.max(maxY, Math.abs(positions[i + 1]))
        maxZ = Math.max(maxZ, Math.abs(positions[i + 2]))
      }

      expect(maxX).toBeLessThanOrEqual(0.8)
      expect(maxY).toBeLessThanOrEqual(0.52)
      expect(maxZ).toBeLessThanOrEqual(0.4)
    }
  )

  it.each(FORM_IDS)("lights some of the %s form in the brand colour", (id) => {
    const { accents } = buildForm(id, 4000)
    const lit = accents.reduce((sum, value) => sum + value, 0)

    expect(lit).toBeGreaterThan(0)
    expect(lit).toBeLessThan(accents.length / 2)
  })

  it("draws the same form on every load", () => {
    expect(buildForm("web", 1000).positions).toEqual(
      buildForm("web", 1000).positions
    )
  })
})

describe("buildChaos", () => {
  it("gives every particle a drift point and a seed", () => {
    const { chaos, seeds } = buildChaos(2000)

    expect(chaos).toHaveLength(6000)
    expect(seeds).toHaveLength(8000)
    expect(chaos.every(Number.isFinite)).toBe(true)
  })
})
