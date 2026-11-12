"use client"

import { useState } from "react"
import { useSetAtom } from "jotai"
import { CornerDownLeftIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { askAgentAtom } from "./agent-state"

const SUGGESTIONS = [
  "Show me his AI work",
  "Is he available?",
  "Does he know Python?",
  "Show me the code",
]

/** The hero's question box: ask, and the agent shows you around the page. */
export function AgentPrompt() {
  const ask = useSetAtom(askAgentAtom)
  const [value, setValue] = useState("")

  return (
    <form
      data-agent="prompt"
      className="max-w-lg"
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim()) return
        ask(value.trim())
        setValue("")
        // The chat takes over from here. On phones this also closes the
        // keyboard, so it does not cover the page while the agent works.
        event.currentTarget.querySelector("input")?.blur()
      }}
    >
      <label htmlFor="agent-question" className="sr-only">
        Ask the agent about Rutwik
      </label>
      <div className="flex items-center gap-2 rounded-xl border bg-background/70 p-1.5 pl-3 shadow-sm backdrop-blur-sm transition-[border-color,box-shadow] focus-within:border-brand/50 focus-within:ring-3 focus-within:ring-brand/15">
        <SparklesIcon
          className="size-4 shrink-0 text-brand-strong"
          aria-hidden
        />
        <input
          id="agent-question"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask the agent to show you around…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="sm"
          variant="brand"
          disabled={!value.trim()}
        >
          Ask
          <CornerDownLeftIcon data-icon="inline-end" />
        </Button>
      </div>

      <ul
        className="mt-2.5 flex flex-wrap gap-1.5"
        aria-label="Example questions"
      >
        {SUGGESTIONS.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              onClick={() => ask(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </form>
  )
}
