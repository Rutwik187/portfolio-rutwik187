"use client"

import { useId, useState } from "react"
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleDashedIcon,
  LoaderCircleIcon,
  SparklesIcon,
  SquareIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

import { answerWords, formatMs, type AgentReply } from "./agent-state"

export const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const

/** One reply from the agent: the answer, and what it did on the page. */
export function AgentReplyView({
  reply,
  onRevisit,
}: {
  reply: AgentReply
  onRevisit: (target: string) => void
}) {
  const isBusy = reply.status === "thinking" || reply.status === "working"
  const words = answerWords(reply.answer).slice(0, reply.shownWords)
  const sources = reply.status === "done" ? sourcesOf(reply) : []

  return (
    <div className="flex gap-2.5">
      <AgentMark isBusy={isBusy} />
      <div className="min-w-0 flex-1 pt-0.5">
        {reply.status === "thinking" && <Shimmer>Thinking…</Shimmer>}

        {words.length > 0 && (
          <p className="text-sm/relaxed text-pretty wrap-break-word text-foreground">
            {words.map((word, index) => (
              // Each word fades in as it arrives, so the stream feels smooth.
              <span
                key={index}
                className="animate-in duration-500 fade-in motion-reduce:animate-none"
              >
                {word}{" "}
              </span>
            ))}
          </p>
        )}

        {reply.status === "stopped" && !reply.answer && (
          <p className="text-sm text-muted-foreground">Stopped.</p>
        )}

        {sources.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Go back to">
            {sources.map((source) => (
              <li key={source.target}>
                <button
                  type="button"
                  onClick={() => onRevisit(source.target)}
                  className="group inline-flex items-center gap-1 rounded-md bg-muted/70 py-0.5 pr-1.5 pl-2 text-xs text-foreground transition-colors hover:bg-brand/10 hover:text-brand-strong"
                >
                  {source.label}
                  <ArrowUpRightIcon
                    className="size-3 text-muted-foreground transition-[color,translate] group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-brand-strong"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {reply.intent && <Trace reply={reply} />}
      </div>
    </div>
  )
}

/** The agent's small badge, which pulses while it works. */
export function AgentMark({
  isBusy,
  className,
}: {
  isBusy?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand-strong ring-1 ring-brand/25",
        className
      )}
      aria-hidden
    >
      <SparklesIcon className={cn("size-3.5", isBusy && "animate-pulse")} />
      {isBusy && (
        <span className="absolute -inset-0.5 animate-spin rounded-full border-2 border-brand/70 border-t-transparent border-r-transparent" />
      )}
    </span>
  )
}

export function Shimmer({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-fit animate-shimmer bg-[linear-gradient(90deg,var(--color-muted-foreground)_40%,var(--color-foreground)_50%,var(--color-muted-foreground)_60%)] bg-size-[200%_100%] bg-clip-text text-sm text-transparent motion-reduce:animate-none">
      {children}
    </p>
  )
}

/** A fold-out record of how the agent answered: intent, model and steps. */
function Trace({ reply }: { reply: AgentReply }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()

  const isWorking = reply.status === "working"
  const stepsMs = reply.steps.reduce((sum, step) => sum + (step.ms ?? 0), 0)
  const count = reply.steps.length
  const doneCount = reply.steps.filter((step) => step.status === "done").length
  const summary =
    count === 0
      ? "How I answered"
      : isWorking
        ? "Showing you on the page"
        : doneCount < count
          ? `Stopped after ${doneCount} of ${count} steps`
          : `Showed you ${count} ${count === 1 ? "thing" : "things"} on the page`

  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className="-mx-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {isWorking ? (
          <LoaderCircleIcon
            className="size-3.5 animate-spin text-brand-strong"
            aria-hidden
          />
        ) : doneCount < count ? (
          <SquareIcon
            className="size-3 fill-current text-muted-foreground"
            aria-hidden
          />
        ) : (
          <CheckIcon className="size-3.5 text-success" aria-hidden />
        )}
        {summary}
        <span className="font-mono tabular-nums">
          · {formatMs(reply.planMs + stepsMs)}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5 rounded-xl bg-muted/60 p-3 font-mono text-xs">
              <p className="flex gap-2 text-muted-foreground">
                <span>intent</span>
                <span className="truncate text-sky-700 dark:text-sky-400">
                  {reply.intent}
                </span>
                <span className="ml-auto shrink-0 tabular-nums">
                  {formatMs(reply.planMs)}
                </span>
              </p>
              {reply.steps.map((step, index) => (
                <p key={index} className="flex items-center gap-2">
                  {step.status === "done" ? (
                    <CheckIcon
                      className="size-3.5 shrink-0 text-success"
                      aria-hidden
                    />
                  ) : step.status === "running" ? (
                    <LoaderCircleIcon
                      className="size-3.5 shrink-0 animate-spin text-brand-strong"
                      aria-hidden
                    />
                  ) : (
                    <CircleDashedIcon
                      className="size-3.5 shrink-0 text-muted-foreground/50"
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "truncate",
                      step.status === "pending"
                        ? "text-muted-foreground/60"
                        : "text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.ms !== undefined && (
                    <span className="ml-auto shrink-0 text-muted-foreground tabular-nums">
                      {formatMs(step.ms)}
                    </span>
                  )}
                </p>
              ))}
              <p className="truncate pt-1 text-muted-foreground/70">
                {reply.engine}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * The things a reply showed on the page, as links back to them. Scrolling to
 * a whole section is left out: the links are for specific things.
 */
function sourcesOf(reply: AgentReply) {
  const seen = new Set<string>()
  return reply.steps.flatMap((step) => {
    if (!step.target || step.target.startsWith("#") || seen.has(step.target)) {
      return []
    }
    seen.add(step.target)
    const label = step.label.replace(/^(Find|Open) /, "")
    return [
      { target: step.target, label: label[0].toUpperCase() + label.slice(1) },
    ]
  })
}
