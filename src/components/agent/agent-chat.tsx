"use client"

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react"
import { useRouter } from "@bprogress/next/app"
import { useAtom, useAtomValue, useSetAtom, useStore } from "jotai"
import {
  animate,
  AnimatePresence,
  MotionConfig,
  useMotionValue,
} from "motion/react"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"
import { xRayPhaseAtom, xRayViewAtom } from "@/components/x-ray/x-ray-state"

import { AgentChatPanel } from "./agent-chat-panel"
import { AgentCursor, AgentHighlight } from "./agent-cursor"
import {
  planFor,
  type AgentCatalog,
  type AgentPlan,
  type AgentStep,
  type AgentTurn,
} from "./agent-plan"
import {
  agentChatOpenAtom,
  agentMessagesAtom,
  agentQuestionAtom,
  answerWords,
  askAgentAtom,
  type AgentMessage,
  type AgentReply,
  type AgentStepState,
} from "./agent-state"
import { AgentLauncher, AgentStatusCard } from "./agent-status"

const EASE = [0.22, 1, 0.36, 1] as const

let lastMessageId = 0
const nextMessageId = () => ++lastMessageId

/**
 * The agent chat. A visitor asks a question; the agent answers, and acts the
 * answer out on the real page with a cursor that scrolls, points and clicks.
 */
export function AgentChat({ catalog }: { catalog: AgentCatalog }) {
  const store = useStore()
  const question = useAtomValue(agentQuestionAtom)
  const [messages, setMessages] = useAtom(agentMessagesAtom)
  const [isOpen, setIsOpen] = useAtom(agentChatOpenAtom)
  const ask = useSetAtom(askAgentAtom)
  const setXRayPhase = useSetAtom(xRayPhaseAtom)
  const setXRayView = useSetAtom(xRayViewAtom)
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()

  const [draft, setDraft] = useState("")
  const [focusRequest, setFocusRequest] = useState(0)
  const [hasUnread, setHasUnread] = useState(false)
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [isCursorVisible, setIsCursorVisible] = useState(false)
  const [clickId, setClickId] = useState(0)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const runIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const sentinelRef = useRef<HTMLSpanElement>(null)

  const isPageInert = useIsPageInert(sentinelRef)
  const isPromptVisible = useIsHeroPromptVisible()

  const latest = messages.findLast(
    (message): message is AgentReply => message.role === "agent"
  )
  const isBusy = latest?.status === "thinking" || latest?.status === "working"
  // Acting: the steps have started and are not all done yet.
  const isActing =
    latest?.status === "working" &&
    latest.steps.some((step) => step.status !== "pending") &&
    latest.steps.some((step) => step.status !== "done")

  /**
   * Puts the cursor in the composer. Not on touch screens when the visitor
   * tapped: the keyboard would cover the example questions.
   */
  const focusComposer = useCallback((always = false) => {
    if (always || window.matchMedia("(pointer: fine)").matches) {
      setFocusRequest((request) => request + 1)
    }
  }, [])

  const open = useCallback(
    (method: "launcher" | "keyboard") => {
      setIsOpen(true)
      setHasUnread(false)
      focusComposer(method === "keyboard")
      trackEvent({ name: "open_agent_chat", properties: { method } })
    },
    [focusComposer, setIsOpen]
  )

  const close = useCallback(() => {
    setIsOpen(false)
    // Give focus back to the launcher once it is on screen.
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>("[data-agent=launcher]")?.focus()
    )
  }, [setIsOpen])

  useHotkeys(
    "mod+i",
    (event) => {
      event.preventDefault()
      if (store.get(agentChatOpenAtom)) close()
      else open("keyboard")
    },
    { enableOnFormTags: true }
  )

  /** Stops the current run: no more steps, and the answer shows in full. */
  const stop = useCallback(() => {
    runIdRef.current++
    abortRef.current?.abort()
    abortRef.current = null
    setHighlight(null)
    setIsCursorVisible(false)
    setMessages((current) =>
      current.map((message) =>
        message.role === "agent" &&
        (message.status === "thinking" || message.status === "working")
          ? {
              ...message,
              status: "stopped",
              shownWords: answerWords(message.answer).length,
            }
          : message
      )
    )
  }, [setMessages])

  const newChat = useCallback(() => {
    stop()
    setMessages([])
    setDraft("")
    focusComposer()
  }, [focusComposer, setMessages, stop])

  /** Opens a project or the brief again, or points out anything else. */
  const revisit = useCallback(async (target: string) => {
    const element = document.querySelector<HTMLElement>(target)
    if (!element) return
    if (element.matches('[data-agent^="work-"], [data-agent="hire"]')) {
      element.click()
      return
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    element.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    })
    await waitForScrollEnd()
    setHighlight(element.getBoundingClientRect())
    setTimeout(() => setHighlight(null), 1600)
  }, [])

  const execute = useCallback(
    async (text: string) => {
      stop()
      const runId = runIdRef.current
      const isCurrent = () => runId === runIdRef.current
      const controller = new AbortController()
      abortRef.current = controller

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms))

      const history = toHistory(store.get(agentMessagesAtom))
      const replyId = nextMessageId()
      setHasUnread(false)
      setMessages((current) => [
        ...current,
        { id: nextMessageId(), role: "user", text },
        {
          id: replyId,
          role: "agent",
          status: "thinking",
          engine: "",
          intent: "",
          planMs: 0,
          steps: [],
          answer: "",
          shownWords: 0,
          followUps: [],
        },
      ])

      const update = (patch: (reply: AgentReply) => Partial<AgentReply>) =>
        setMessages((current) =>
          current.map((message) =>
            message.id === replyId && message.role === "agent"
              ? { ...message, ...patch(message) }
              : message
          )
        )

      const started = performance.now()
      const { plan, engine } = await getPlan(
        text,
        history,
        catalog,
        controller.signal
      )
      if (!isCurrent()) return
      trackEvent({
        name: "ask_agent",
        properties: { intent: plan.intent, engine },
      })

      update(() => ({
        status: "working",
        engine,
        intent: plan.intent,
        planMs: performance.now() - started,
        steps: plan.steps.map((step) => ({
          label: step.label,
          status: "pending",
          target: "target" in step ? step.target : undefined,
        })),
        answer: plan.answer,
        followUps: plan.followUps ?? [],
      }))

      const streamAnswer = async () => {
        const total = answerWords(plan.answer).length
        for (let count = 1; count <= total; count++) {
          if (!isCurrent()) return
          update(() => ({ shownWords: count }))
          await wait(30)
        }
      }

      const moveTo = async (element: Element) => {
        const box = element.getBoundingClientRect()
        const x = box.left + Math.min(box.width / 2, 140)
        const y = box.top + box.height / 2
        const duration = reduceMotion ? 0 : 0.65
        await Promise.all([
          animate(cursorX, x, { duration, ease: EASE }),
          animate(cursorY, y, { duration, ease: EASE }),
        ])
        setHighlight(element.getBoundingClientRect())
      }

      const perform = async (step: AgentStep) => {
        switch (step.kind) {
          case "scroll": {
            document.querySelector(step.target)?.scrollIntoView({
              behavior: reduceMotion ? "auto" : "smooth",
              block: "start",
            })
            setHighlight(null)
            await waitForScrollEnd()
            return
          }
          case "point":
          case "click": {
            const element = document.querySelector<HTMLElement>(step.target)
            if (!element) return
            if (!isInView(element)) {
              element.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "center",
              })
              await waitForScrollEnd()
            }
            await moveTo(element)
            await wait(step.kind === "point" ? 650 : 250)
            if (step.kind === "click" && isCurrent()) {
              setClickId((id) => id + 1)
              await wait(180)
              element.click()
              setHighlight(null)
            }
            return
          }
          case "xray": {
            setXRayView("full")
            setXRayPhase("on")
            setIsCursorVisible(false)
            await wait(1200)
            return
          }
          case "theme": {
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
            await wait(400)
            return
          }
          case "navigate": {
            router.push(step.href)
            return
          }
        }
      }

      const updateStep = (index: number, patch: Partial<AgentStepState>) =>
        update((reply) => ({
          steps: reply.steps.map((step, i) =>
            i === index ? { ...step, ...patch } : step
          ),
        }))

      const runSteps = async () => {
        if (plan.steps.length === 0) return
        // The cursor takes off from the chat, or from the hero's prompt.
        const origin = document
          .querySelector("[data-agent=chat], [data-agent=prompt]")
          ?.getBoundingClientRect()
        cursorX.jump(origin ? origin.left + 40 : window.innerWidth / 2)
        cursorY.jump(origin ? origin.top + 24 : window.innerHeight - 80)
        setIsCursorVisible(true)

        for (const [index, step] of plan.steps.entries()) {
          if (!isCurrent()) return
          const stepStarted = performance.now()
          updateStep(index, { status: "running" })
          await perform(step)
          if (!isCurrent()) return
          updateStep(index, {
            status: "done",
            ms: performance.now() - stepStarted,
          })
        }
        setHighlight(null)
        setIsCursorVisible(false)
      }

      // Answer and act at the same time: the visitor reads while it works.
      await Promise.all([streamAnswer(), runSteps()])
      if (!isCurrent()) return
      update(() => ({ status: "done" }))
      abortRef.current = null
      if (!store.get(agentChatOpenAtom)) setHasUnread(true)
    },
    [
      catalog,
      cursorX,
      cursorY,
      resolvedTheme,
      router,
      setMessages,
      setTheme,
      setXRayPhase,
      setXRayView,
      stop,
      store,
    ]
  )

  // Run once per question, not again when `execute` changes with the theme.
  const onQuestion = useEffectEvent((text: string) => execute(text))
  useEffect(() => {
    if (question) onQuestion(question.text)
  }, [question])

  // Hidden while a dialog is open: the page behind it cannot take input.
  const isPanelShown = isOpen && !isPageInert && !isActing
  const isStatusShown = isOpen && !isPageInert && isActing && latest
  const isLauncherShown =
    !isOpen && !isPageInert && (!isPromptVisible || messages.length > 0)

  return (
    <MotionConfig reducedMotion="user">
      <span ref={sentinelRef} hidden />

      <AnimatePresence>
        {isCursorVisible && (
          <AgentCursor key="cursor" x={cursorX} y={cursorY} clickId={clickId} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {highlight && <AgentHighlight key="highlight" box={highlight} />}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isPanelShown && (
          <AgentChatPanel
            key="panel"
            messages={messages}
            draft={draft}
            onDraftChange={setDraft}
            focusRequest={focusRequest}
            onAsk={ask}
            onStop={stop}
            onNewChat={newChat}
            onClose={close}
            onRevisit={revisit}
          />
        )}
        {isStatusShown && (
          <AgentStatusCard key="status" reply={latest} onStop={stop} />
        )}
        {isLauncherShown && (
          <AgentLauncher
            key="launcher"
            isBusy={isBusy}
            hasUnread={hasUnread}
            onOpen={() => open("launcher")}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

/**
 * Earlier turns for the model, as question and answer pairs, so follow-ups
 * like "tell me more" make sense. Only the last three pairs are sent.
 */
function toHistory(messages: AgentMessage[]): AgentTurn[] {
  const turns: AgentTurn[] = []
  messages.forEach((message, index) => {
    const reply = messages[index + 1]
    if (message.role === "user" && reply?.role === "agent" && reply.answer) {
      turns.push(
        { role: "user", text: message.text.slice(0, 500) },
        { role: "assistant", text: reply.answer.slice(0, 500) }
      )
    }
  })
  return turns.slice(-6)
}

/**
 * True while a modal (a dialog, the command menu) is open. Base UI hides the
 * rest of the page from input then, which includes the chat.
 */
function useIsPageInert(ref: RefObject<HTMLElement | null>) {
  const [isInert, setIsInert] = useState(false)

  useEffect(() => {
    const check = () =>
      setIsInert(Boolean(ref.current?.closest('[aria-hidden="true"], [inert]')))
    const observer = new MutationObserver(check)
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-hidden", "inert"],
    })
    return () => observer.disconnect()
  }, [ref])

  return isInert
}

/** The launcher waits until the hero's own prompt scrolls out of view. */
function useIsHeroPromptVisible() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const prompt = document.querySelector("[data-agent=prompt]")
    if (!prompt) return
    const observer = new IntersectionObserver(([entry]) =>
      setIsVisible(entry.isIntersecting)
    )
    observer.observe(prompt)
    return () => observer.disconnect()
  }, [])

  return isVisible
}

function isInView(element: Element) {
  const box = element.getBoundingClientRect()
  return box.top >= 80 && box.bottom <= window.innerHeight - 80
}

/** Resolves once smooth scrolling stops, or soon if nothing scrolls. */
function waitForScrollEnd() {
  return new Promise<void>((resolve) => {
    let idle = setTimeout(done, 160)
    const limit = setTimeout(done, 1400)
    function onScroll() {
      clearTimeout(idle)
      idle = setTimeout(done, 120)
    }
    function done() {
      clearTimeout(idle)
      clearTimeout(limit)
      window.removeEventListener("scroll", onScroll)
      resolve()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
  })
}

/**
 * Asks Gemini (through `/api/agent`) for a plan. Any failure, from a missing
 * key to a rate limit or a timeout, falls back to the on-device router, so the
 * agent always answers.
 */
async function getPlan(
  question: string,
  history: AgentTurn[],
  catalog: AgentCatalog,
  signal: AbortSignal
): Promise<{ plan: AgentPlan; engine: string }> {
  try {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
    })
    if (!response.ok) throw new Error(`Agent API returned ${response.status}`)
    const data = (await response.json()) as { plan: AgentPlan; model: string }
    return { plan: data.plan, engine: `${data.model} · AI SDK` }
  } catch {
    return {
      plan: planFor(question, catalog),
      engine: "on-device fallback",
    }
  }
}
