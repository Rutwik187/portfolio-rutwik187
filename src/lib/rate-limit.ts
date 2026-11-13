/**
 * A fixed-window rate limiter kept in memory. On serverless it resets when an
 * instance starts and is not shared between instances, so it slows down abuse
 * rather than stopping it. The provider's own quota is the hard limit.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number
  windowMs: number
}) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  return function check(key: string, now = Date.now()) {
    const entry = hits.get(key)

    if (!entry || now >= entry.resetAt) {
      // Drop expired keys now and then, so the map cannot grow forever.
      if (hits.size > 5_000) {
        for (const [oldKey, old] of hits) {
          if (now >= old.resetAt) hits.delete(oldKey)
        }
      }
      hits.set(key, { count: 1, resetAt: now + windowMs })
      return { ok: true, retryAfterMs: 0 }
    }

    if (entry.count >= limit) {
      return { ok: false, retryAfterMs: entry.resetAt - now }
    }

    entry.count++
    return { ok: true, retryAfterMs: 0 }
  }
}
