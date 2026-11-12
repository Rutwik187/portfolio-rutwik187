"use client"

import { SparklesIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

import { DOCK_POSITION } from "./agent-chat-panel"
import { AgentMark, SPRING } from "./agent-reply"
import { answerWords, type AgentReply } from "./agent-state"

/**
 * While the agent acts on the page, the chat shrinks to this card, so it
 * does not hide what the agent is showing. It grows back when it is done.
 */
export function AgentStatusCard({
  reply,
  onStop,
}: {
  reply: AgentReply
  onStop: () => void
}) {
  const index = Math.max(
    reply.steps.findIndex((step) => step.status !== "done"),
    0
  )
  const step = reply.steps[index]
  const words = answerWords(reply.answer).slice(0, reply.shownWords)

  return (
    <motion.section
      data-agent="chat-status"
      aria-label="The agent is working"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={SPRING}
      style={{ transformOrigin: "bottom right" }}
      className={cn(
        DOCK_POSITION,
        "z-60 rounded-2xl border bg-popover/95 p-3 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:w-88 dark:ring-white/5"
      )}
    >
      <div className="flex items-center gap-2.5">
        <AgentMark isBusy />
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={step?.label}
              initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="truncate text-sm font-medium text-foreground"
              aria-live="polite"
            >
              {step?.label}…
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-muted-foreground tabular-nums">
            Step {index + 1} of {reply.steps.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onStop}
          className="h-7 shrink-0 rounded-lg bg-muted px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          Stop
        </button>
      </div>

      <div className="mt-2.5 flex gap-1" aria-hidden>
        {reply.steps.map((item, itemIndex) => (
          <span
            key={itemIndex}
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <motion.span
              className="block h-full rounded-full bg-brand"
              initial={false}
              animate={{
                width:
                  item.status === "done"
                    ? "100%"
                    : item.status === "running"
                      ? "55%"
                      : "0%",
              }}
              transition={{ duration: item.status === "running" ? 1.2 : 0.3 }}
            />
          </span>
        ))}
      </div>

      {words.length > 0 && (
        <p className="mt-2.5 line-clamp-3 text-sm/relaxed text-pretty text-muted-foreground">
          {words.join(" ")}
        </p>
      )}
    </motion.section>
  )
}

/** The button that brings the chat back, from anywhere on the page. */
export function AgentLauncher({
  isBusy,
  hasUnread,
  onOpen,
}: {
  isBusy: boolean
  hasUnread: boolean
  onOpen: () => void
}) {
  return (
    <motion.button
      type="button"
      data-agent="launcher"
      onClick={onOpen}
      aria-label={
        hasUnread ? "Open the agent chat, new reply" : "Open the agent chat"
      }
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.9 }}
      transition={SPRING}
      // Beside the scroll-to-top button on larger screens; bottom left on
      // phones, clear of the bottom nav.
      className="fixed bottom-[calc(--spacing(2)+env(safe-area-inset-bottom,0))] left-3 z-50 flex h-10 items-center gap-2 rounded-xl bg-popover pr-3 pl-2.5 text-sm font-medium text-foreground shadow-md ring ring-foreground/10 transition-colors hover:bg-accent sm:right-14 sm:bottom-4 sm:left-auto sm:h-8 sm:rounded-lg sm:pr-1.5 lg:right-18 lg:bottom-8 dark:ring-foreground/20"
    >
      <span className="relative flex size-4 items-center justify-center">
        <SparklesIcon
          className={cn("size-4 text-brand-strong", isBusy && "animate-pulse")}
          aria-hidden
        />
        {isBusy && (
          <span
            className="absolute -inset-1 animate-spin rounded-full border-2 border-brand/70 border-t-transparent border-r-transparent"
            aria-hidden
          />
        )}
        {hasUnread && !isBusy && (
          <span
            className="absolute -top-1 -right-1 size-2 rounded-full bg-brand ring-2 ring-popover"
            aria-hidden
          />
        )}
      </span>
      <span>
        Ask<span className="hidden sm:inline"> the agent</span>
      </span>
      <KbdGroup className="hidden gap-0.5 sm:in-[.os-macos_&]:flex">
        <Kbd className="size-5 min-w-auto text-xs">⌘</Kbd>
        <Kbd className="size-5 min-w-auto text-xs">I</Kbd>
      </KbdGroup>
      <KbdGroup className="hidden gap-0.5 sm:not-[.os-macos_&]:flex">
        <Kbd className="h-5 text-xs">Ctrl</Kbd>
        <Kbd className="size-5 min-w-auto text-xs">I</Kbd>
      </KbdGroup>
    </motion.button>
  )
}
