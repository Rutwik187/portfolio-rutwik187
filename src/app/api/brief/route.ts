import { decodeEmail } from "@/utils/string"
import { Resend } from "resend"

import { createRateLimiter } from "@/lib/rate-limit"
import { isSameOrigin } from "@/lib/same-origin"
import {
  briefSchema,
  formatBriefEmail,
} from "@/features/portfolio/components/hire/hire-brief"
import { USER } from "@/features/portfolio/data/user"

// Resend's test sender. It only delivers to the Resend account's own email,
// so set BRIEF_FROM_EMAIL to an address on a verified domain to go further.
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>"

// Per visitor: 3 briefs in 10 minutes, and 10 a day.
const perTenMinutes = createRateLimiter({ limit: 3, windowMs: 10 * 60_000 })
const perDay = createRateLimiter({ limit: 10, windowMs: 24 * 60 * 60_000 })

/** Sends a project brief from the hire dialog to Rutwik's inbox. */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return Response.json({ error: "Email is not set up yet." }, { status: 503 })
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Forbidden." }, { status: 403 })
  }

  const visitor =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local"
  for (const check of [perTenMinutes, perDay]) {
    const { ok, retryAfterMs } = check(visitor)
    if (!ok) {
      return Response.json(
        { error: "Too many briefs. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      )
    }
  }

  const parsed = briefSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form." },
      { status: 400 }
    )
  }

  // A bot filled in the hidden field: say it went, and send nothing.
  if (parsed.data.website) {
    return Response.json({ ok: true })
  }

  const { subject, text, html } = formatBriefEmail(parsed.data)
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.BRIEF_FROM_EMAIL || DEFAULT_FROM,
    to: process.env.BRIEF_TO_EMAIL || decodeEmail(USER.emailB64),
    replyTo: parsed.data.email,
    subject,
    text,
    html,
  })

  if (error) {
    console.error("Resend could not send a brief:", error)
    return Response.json(
      { error: "The email could not be sent." },
      { status: 502 }
    )
  }

  return Response.json({ ok: true })
}
