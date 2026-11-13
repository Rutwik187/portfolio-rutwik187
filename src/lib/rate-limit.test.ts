import { describe, expect, it } from "vitest"

import { createRateLimiter } from "./rate-limit"

describe("createRateLimiter", () => {
  it("allows up to the limit in a window, then blocks", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 })
    expect(check("a", 0).ok).toBe(true)
    expect(check("a", 100).ok).toBe(true)
    expect(check("a", 200)).toEqual({ ok: false, retryAfterMs: 800 })
  })

  it("counts each visitor on their own", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 })
    expect(check("a", 0).ok).toBe(true)
    expect(check("b", 0).ok).toBe(true)
    expect(check("a", 1).ok).toBe(false)
  })

  it("starts a new window once the old one ends", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 })
    expect(check("a", 0).ok).toBe(true)
    expect(check("a", 999).ok).toBe(false)
    expect(check("a", 1000).ok).toBe(true)
  })
})
