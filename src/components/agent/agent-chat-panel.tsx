"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import {
  ArrowUpIcon,
  ChevronDownIcon,
  CodeXmlIcon,
  HandshakeIcon,
  SmartphoneIcon,
  SparklesIcon,
  SquareIcon,
  SquarePenIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import { USER } from "@/features/portfolio/data/user"

import { AgentReplyView, SPRING } from "./agent-reply"
import type { AgentMessage, AgentReply } from "./agent-state"

const MAX_LENGTH = 200

const STARTERS = [
  { icon: SparklesIcon, text: "Show me his AI work" },
  { icon: SmartphoneIcon, text: "Can he build a mobile app?" },
  { icon: HandshakeIcon, text: "Is he available for a project?" },
  { icon: CodeXmlIcon, text: "How is this site built?" },
]

/** Offered after a reply when the model did not suggest any follow-ups. */
const FALLBACK_FOLLOW_UPS = [
  "Show me his AI work",
  "What has he built for clients?",
  "Is he available?",
  "Does he know Python?",
  "Show me the code",
]

/** Where the panel, the status card and the launcher sit on the screen. */
export const DOCK_POSITION =
  "fixed inset-x-2 bottom-[calc(--spacing(2)+env(safe-area-inset-bottom,0))] sm:inset-x-auto sm:right-4 sm:bottom-4 lg:right-8 lg:bottom-8"

export function AgentChatPanel({
  messages,
  draft,
  onDraftChange,
  focusRequest,
  onAsk,
  onStop,
  onNewChat,
  onClose,
  onRevisit,
}: {
  messages: AgentMessage[]
  draft: string
  onDraftChange: (draft: string) => void
  /** Changes when the composer should take focus. */
  focusRequest: number
  onAsk: (question: string) => void
  onStop: () => void
  onNewChat: () => void
  onClose: () => void
  /** Takes the visitor back to something the agent showed them. */
  onRevisit: (target: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const isPinnedRef = useRef(true)

  const latest = messages.findLast(
    (message): message is AgentReply => message.role === "agent"
  )
  const isBusy = latest?.status === "thinking" || latest?.status === "working"
  const lastQuestion = messages.findLast((message) => message.role === "user")

  // Follow the newest message, unless the visitor scrolled up to read.
  useLayoutEffect(() => {
    const list = listRef.current
    if (list && isPinnedRef.current) list.scrollTop = list.scrollHeight
  }, [messages])

  const ask = (question: string) => {
    const text = question.trim()
    if (!text) return
    isPinnedRef.current = true
    onAsk(text)
  }

  const followUps =
    latest?.status === "done" ? pickFollowUps(latest, messages) : []

  return (
    <motion.section
      data-agent="chat"
      aria-label={`Chat with ${USER.firstName}'s agent`}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={SPRING}
      style={{ transformOrigin: "bottom right" }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation()
          onClose()
        }
      }}
      className={cn(
        DOCK_POSITION,
        "z-60 flex max-h-[calc(100dvh-var(--header-height)-(--spacing(4)))] flex-col overflow-hidden rounded-2xl border bg-popover/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:max-h-[min(40rem,calc(100dvh-var(--header-height)-(--spacing(8))))] sm:w-100 dark:ring-white/5"
      )}
    >
      <header className="flex items-center gap-3 px-4 pt-3.5 pb-3">
        <span className="relative shrink-0">
          <img
            src={USER.avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-popover">
            <span className="size-2 rounded-full bg-success" />
          </span>
        </span>
        <div className="min-w-0">
          <h2 className="text-sm/5 font-medium text-foreground">
            {USER.firstName}&apos;s agent
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            Answers, then shows you on the page
          </p>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          {messages.length > 0 && (
            <HeaderButton label="Start a new chat" onClick={onNewChat}>
              <SquarePenIcon />
            </HeaderButton>
          )}
          <HeaderButton label="Minimise the chat" onClick={onClose}>
            <ChevronDownIcon />
          </HeaderButton>
        </div>
      </header>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-busy={isBusy}
        onScroll={(event) => {
          const list = event.currentTarget
          const below = list.scrollHeight - list.scrollTop - list.clientHeight
          isPinnedRef.current = below < 48
          // Fade an edge only when there is more to scroll to beyond it.
          list.toggleAttribute("data-fade-top", list.scrollTop > 4)
          list.toggleAttribute("data-fade-bottom", below > 4)
        }}
        className="min-h-0 flex-1 scrollbar-thin overflow-y-auto overscroll-contain mask-[linear-gradient(to_bottom,transparent,black_var(--fade-top),black_calc(100%-var(--fade-bottom)),transparent)] px-4 pb-4 [--fade-bottom:0px] [--fade-top:0px] data-fade-bottom:[--fade-bottom:1.5rem] data-fade-top:[--fade-top:1.5rem]"
      >
        {messages.length === 0 ? (
          <Welcome onAsk={ask} />
        ) : (
          <ol className="space-y-5 pt-1">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.li
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={SPRING}
                >
                  {message.role === "user" ? (
                    <UserBubble text={message.text} />
                  ) : (
                    <AgentReplyView reply={message} onRevisit={onRevisit} />
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}

        <AnimatePresence>
          {followUps.length > 0 && (
            <motion.ul
              key={latest?.id}
              aria-label="Suggested questions"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="mt-3 flex flex-wrap gap-1.5 pl-8.5"
            >
              {followUps.map((question) => (
                <li key={question}>
                  <button
                    type="button"
                    onClick={() => ask(question)}
                    className="rounded-full border bg-background/60 px-2.5 py-1 text-left text-xs text-muted-foreground transition-[color,border-color,background-color] hover:border-brand/40 hover:bg-brand/5 hover:text-foreground"
                  >
                    {question}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <Composer
        draft={draft}
        onDraftChange={onDraftChange}
        focusRequest={focusRequest}
        isBusy={isBusy}
        lastQuestion={lastQuestion?.role === "user" ? lastQuestion.text : ""}
        hasMessages={messages.length > 0}
        onSubmit={() => {
          ask(draft)
          onDraftChange("")
        }}
        onStop={onStop}
      />
    </motion.section>
  )
}

function Welcome({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <div className="pt-1">
      <div className="flex gap-2.5">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand-strong ring-1 ring-brand/25">
          <SparklesIcon className="size-3.5" aria-hidden />
        </span>
        <p className="text-sm/relaxed text-pretty text-foreground">
          Hi! Ask me anything about {USER.firstName}&apos;s work, skills or
          availability. I&apos;ll answer, then show you on the page.
        </p>
      </div>

      <ul className="mt-4 grid gap-1.5" aria-label="Example questions">
        {STARTERS.map(({ icon: Icon, text }, index) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.05 + index * 0.04 }}
          >
            <button
              type="button"
              onClick={() => onAsk(text)}
              className="group flex w-full items-center gap-3 rounded-xl border bg-background/50 px-3 py-2.5 text-left text-sm text-foreground transition-[border-color,background-color] hover:border-brand/35 hover:bg-brand/5"
            >
              <Icon
                className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand-strong"
                aria-hidden
              />
              {text}
              <ArrowUpIcon
                className="ml-auto size-4 shrink-0 rotate-45 text-muted-foreground opacity-0 transition-[opacity,translate] group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden
              />
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end pl-10">
      <p className="rounded-2xl rounded-br-md bg-muted px-3.5 py-2 text-sm/relaxed text-pretty wrap-break-word text-foreground">
        {text}
      </p>
    </div>
  )
}

function Composer({
  draft,
  onDraftChange,
  focusRequest,
  isBusy,
  lastQuestion,
  hasMessages,
  onSubmit,
  onStop,
}: {
  draft: string
  onDraftChange: (draft: string) => void
  focusRequest: number
  isBusy: boolean
  lastQuestion: string
  hasMessages: boolean
  onSubmit: () => void
  onStop: () => void
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const canSend = draft.trim().length > 0
  // While the agent works, the button stops it, unless there is a new question.
  const showStop = isBusy && !canSend

  useEffect(() => {
    if (focusRequest > 0) inputRef.current?.focus({ preventScroll: true })
  }, [focusRequest])

  // Grow with the text, up to about five lines.
  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.style.height = "auto"
    input.style.height = `${Math.min(input.scrollHeight, 128)}px`
  }, [draft])

  return (
    <form
      data-agent="composer"
      className="px-3 pb-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (canSend) onSubmit()
      }}
    >
      <div className="flex items-end gap-2 rounded-xl border bg-background py-1.5 pr-1.5 pl-3 shadow-xs transition-[border-color,box-shadow] focus-within:border-brand/50 focus-within:ring-3 focus-within:ring-brand/15">
        <label htmlFor="agent-chat-input" className="sr-only">
          Your question
        </label>
        <textarea
          ref={inputRef}
          id="agent-chat-input"
          rows={1}
          value={draft}
          maxLength={MAX_LENGTH}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            } else if (event.key === "ArrowUp" && !draft && lastQuestion) {
              event.preventDefault()
              onDraftChange(lastQuestion)
            }
          }}
          placeholder={
            hasMessages ? "Ask a follow-up…" : "Ask about his work, skills…"
          }
          autoComplete="off"
          className="max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1 text-base/6 text-foreground outline-none placeholder:text-muted-foreground sm:text-sm/6"
        />
        <AnimatePresence mode="popLayout" initial={false}>
          {showStop ? (
            <motion.button
              key="stop"
              type="button"
              onClick={onStop}
              aria-label="Stop the agent"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-85"
            >
              <SquareIcon className="size-3 fill-current" aria-hidden />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              initial={{ opacity: 0, scale: 0.6 }}
              // Motion owns opacity here, so the dimmed state lives here too.
              animate={{ opacity: canSend ? 1 : 0.35, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground transition-[opacity,transform] hover:brightness-105 active:scale-95"
            >
              <ArrowUpIcon className="size-4" aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-1.5 flex items-center justify-between gap-2 px-1 text-[0.6875rem] text-muted-foreground">
        <span className="truncate">Answers come only from his portfolio.</span>
        {draft.length > MAX_LENGTH - 40 ? (
          <span className="shrink-0 tabular-nums">
            {draft.length}/{MAX_LENGTH}
          </span>
        ) : (
          <span className="hidden shrink-0 items-center gap-1 sm:flex">
            <Kbd className="h-4 min-w-0 px-1 text-[0.625rem]">esc</Kbd> to close
          </span>
        )}
      </p>
    </form>
  )
}

function HeaderButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4"
    >
      {children}
    </button>
  )
}

/** The model's follow-ups, or a few starters the visitor has not asked yet. */
function pickFollowUps(reply: AgentReply, messages: AgentMessage[]) {
  const asked = new Set(
    messages
      .filter((message) => message.role === "user")
      .map((message) => message.text.toLowerCase())
  )
  const options =
    reply.followUps.length > 0 ? reply.followUps : FALLBACK_FOLLOW_UPS
  return options
    .filter((question) => !asked.has(question.toLowerCase()))
    .slice(0, 3)
}
