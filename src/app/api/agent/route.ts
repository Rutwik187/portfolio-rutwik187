import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google"
import { generateText, Output } from "ai"
import { z } from "zod"

import { createRateLimiter } from "@/lib/rate-limit"
import {
  agentOutputSchema,
  toAgentPlan,
} from "@/components/agent/agent-actions"
import { getAgentCatalog } from "@/components/agent/agent-catalog"
import { buildAgentSystemPrompt } from "@/components/agent/agent-system-prompt"

/** Override with AGENT_MODEL to try another Gemini model without a deploy. */
const MODEL = process.env.AGENT_MODEL || "gemini-3.5-flash-lite"
/**
 * Picking actions is a small task, so think as little as the model allows.
 * Lite models accept "minimal"; full Flash models reject it and need "low".
 */
const THINKING_LEVEL = MODEL.includes("lite") ? "minimal" : "low"

export const maxDuration = 20

const requestSchema = z.object({
  question: z.string().trim().min(1).max(200),
  // The last few turns, so follow-up questions make sense. Kept small to
  // bound the cost of one request.
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().trim().min(1).max(500),
      })
    )
    .max(6)
    .default([]),
})

// Per visitor: 8 questions a minute, and 40 a day.
const perMinute = createRateLimiter({ limit: 8, windowMs: 60_000 })
const perDay = createRateLimiter({ limit: 40, windowMs: 24 * 60 * 60_000 })

// The prompt and schema only change when the data does: build them once.
const catalog = getAgentCatalog()
const system = buildAgentSystemPrompt(catalog)
const schema = agentOutputSchema(catalog)

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json({ error: "The agent is not set up." }, { status: 503 })
  }

  // Only this site's own pages may call the agent from a browser.
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Forbidden." }, { status: 403 })
  }

  const visitor =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local"
  for (const check of [perMinute, perDay]) {
    const { ok, retryAfterMs } = check(visitor)
    if (!ok) {
      return Response.json(
        { error: "Too many questions. Try again soon." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
        }
      )
    }
  }

  const body = requestSchema.safeParse(await request.json().catch(() => null))
  if (!body.success) {
    return Response.json(
      { error: "Ask a question of 200 characters or fewer." },
      { status: 400 }
    )
  }

  const started = performance.now()
  try {
    const { output } = await generateText({
      model: google(MODEL),
      system,
      messages: [
        ...body.data.history.map((turn) => ({
          role: turn.role,
          content: turn.text,
        })),
        { role: "user" as const, content: body.data.question },
      ],
      output: Output.object({ schema }),
      // Thinking tokens count towards this limit, so leave room for both.
      maxOutputTokens: 2000,
      abortSignal: AbortSignal.timeout(15_000),
      providerOptions: {
        google: {
          thinkingConfig: { thinkingLevel: THINKING_LEVEL },
        } satisfies GoogleLanguageModelOptions,
      },
    })

    return Response.json({
      plan: toAgentPlan(output, catalog),
      model: MODEL,
      ms: Math.round(performance.now() - started),
    })
  } catch (error) {
    console.error("Agent request failed:", error)
    return Response.json({ error: "The agent is busy." }, { status: 502 })
  }
}

function isSameOrigin(request: Request) {
  try {
    const origin = request.headers.get("origin")
    return origin !== null && new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}
