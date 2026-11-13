"use client"

import { useSetAtom } from "jotai"

import { askAgentAtom } from "./agent-state"

const QUESTIONS = [
  "What would my project cost?",
  "Can he join a team full-time?",
  "Show me his best work",
]

/** For visitors who want answers before they write a brief. */
export function AgentAskCard() {
  const ask = useSetAtom(askAgentAtom)

  return (
    <div className="mt-20 grid gap-y-6 border-t border-rule pt-10 lg:mt-28 lg:grid-cols-12 lg:items-center lg:gap-x-(--gap-columns)">
      <div className="lg:col-span-4">
        <h3 className="font-display text-title tracking-display lowercase">
          Questions first?
        </h3>
        <p className="mt-2 text-[0.9375rem] text-pretty text-muted-foreground">
          Ask my AI agent. It knows my work and answers in seconds.
        </p>
      </div>

      <ul
        className="flex flex-wrap gap-2 lg:col-span-8 lg:justify-end"
        aria-label="Ask the agent"
      >
        {QUESTIONS.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => ask(question)}
              className="flex h-11 items-center rounded-full border border-rule-2 px-5 text-[0.9375rem] text-ink-2 lowercase transition-colors duration-150 hover:bg-paper-2 hover:text-foreground"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
