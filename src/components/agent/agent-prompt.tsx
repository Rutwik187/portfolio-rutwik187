"use client"

import { useEffect, useState } from "react"
import { useSetAtom } from "jotai"
import {
  ArrowUpIcon,
  CodeXmlIcon,
  HandshakeIcon,
  SmartphoneIcon,
  SparklesIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

import { AgentMark } from "./agent-reply"
import { askAgentAtom } from "./agent-state"

const SUGGESTIONS = [
  { icon: SparklesIcon, label: "His AI work", question: "Show me his AI work" },
  {
    icon: SmartphoneIcon,
    label: "Mobile apps",
    question: "Can he build a mobile app?",
  },
  {
    icon: HandshakeIcon,
    label: "Available?",
    question: "Is he available for a project?",
  },
  {
    icon: CodeXmlIcon,
    label: "Show the code",
    question: "How is this site built?",
  },
]

/** Typed out in the empty box, to show what the agent can do. */
const EXAMPLES = [
  "Can he build a mobile app for my restaurant?",
  "Show me the AI assistant he built in the UK",
  "Has he shipped online payments?",
  "Is he free for a contract?",
  "Does he know Python?",
]

/** The hero's question box: ask, and the agent shows you around the page. */
export function AgentPrompt() {
  const ask = useSetAtom(askAgentAtom)
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const example = useTypewriter(EXAMPLES, !value && !isFocused)
  const canSend = value.trim().length > 0

  return (
    <form
      data-agent="prompt"
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault()
        if (!canSend) return
        ask(value.trim())
        setValue("")
        // The chat takes over from here. On phones this also closes the
        // keyboard, so it does not cover the page while the agent works.
        event.currentTarget.querySelector("input")?.blur()
      }}
    >
      <div className="rounded-[10px] border border-rule bg-paper-2">
        <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2.5 text-sm text-muted-foreground">
          <label htmlFor="agent-question" className="lowercase">
            Ask my agent. It answers, then shows you around.
          </label>
          <KbdGroup className="hidden gap-0.5 sm:in-[.os-macos_&]:flex">
            <Kbd className="size-5 min-w-auto text-xs">⌘</Kbd>
            <Kbd className="size-5 min-w-auto text-xs">I</Kbd>
          </KbdGroup>
          <KbdGroup className="hidden gap-0.5 sm:not-[.os-macos_&]:flex">
            <Kbd className="h-5 text-xs">Ctrl</Kbd>
            <Kbd className="size-5 min-w-auto text-xs">I</Kbd>
          </KbdGroup>
        </div>

        <div className="p-3">
          <div className="flex h-14 items-center gap-3 rounded-full border border-input bg-background pr-1.5 pl-2.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring">
            <AgentMark className="size-8" />

            <div className="relative min-w-0 flex-1">
              <input
                id="agent-question"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={200}
                autoComplete="off"
                className="h-12 w-full bg-transparent text-[1.0625rem] text-foreground outline-none"
              />
              {!value && (
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 flex max-w-full items-center truncate text-[1.0625rem] text-muted-foreground"
                  aria-hidden
                >
                  {isFocused ? (
                    "Ask anything about his work…"
                  ) : (
                    <>
                      <span className="truncate">{example}</span>
                      <span className="ml-px inline-block h-5 w-px shrink-0 bg-brand" />
                    </>
                  )}
                </span>
              )}
            </div>

            <button
              type="submit"
              aria-label="Ask"
              aria-disabled={!canSend}
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color,scale] duration-150 ease-out active:scale-95 aria-disabled:cursor-not-allowed",
                canSend
                  ? "bg-brand text-brand-foreground"
                  : "bg-paper-3 text-muted-foreground"
              )}
            >
              <ArrowUpIcon className="size-4.5" aria-hidden />
            </button>
          </div>
        </div>

        <ul
          className="flex flex-wrap gap-2 px-3 pb-3"
          aria-label="Example questions"
        >
          {SUGGESTIONS.map(({ icon: Icon, label, question }, index) => (
            <li
              key={label}
              className={cn(
                "shrink-0",
                // In the hero's narrow column on laptops, four chips wrap to
                // a second row. The last one, the code, is also in the header.
                index === SUGGESTIONS.length - 1 && "lg:max-[90rem]:hidden"
              )}
            >
              <button
                type="button"
                onClick={() => ask(question)}
                className="group flex h-8 items-center gap-1.5 rounded-full border border-rule-2 px-2.5 text-sm whitespace-nowrap text-muted-foreground lowercase transition-colors duration-150 hover:bg-paper-3 hover:text-foreground"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </form>
  )
}

/**
 * Types each phrase out, waits, deletes it, and moves to the next. Holds
 * still while paused, or when the visitor prefers less motion.
 */
function useTypewriter(phrases: string[], isRunning: boolean) {
  // Start with the first phrase in full, so the first paint has a complete
  // example and the server and browser render the same text.
  const [state, setState] = useState({
    index: 0,
    length: phrases[0].length,
    deleting: false,
  })

  useEffect(() => {
    if (!isRunning) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const phrase = phrases[state.index]
    const isTyped = state.length === phrase.length
    const delay = state.deleting ? 18 : isTyped ? 2200 : 34 + Math.random() * 40

    const timer = setTimeout(() => {
      setState((current) => {
        if (current.deleting) {
          return current.length > 0
            ? { ...current, length: current.length - 1 }
            : {
                index: (current.index + 1) % phrases.length,
                length: 0,
                deleting: false,
              }
        }
        return current.length < phrase.length
          ? { ...current, length: current.length + 1 }
          : { ...current, deleting: true }
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [isRunning, phrases, state])

  return phrases[state.index].slice(0, state.length)
}
