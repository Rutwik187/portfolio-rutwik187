"use client"

import { usePathname } from "next/navigation"
import { useRouter } from "@bprogress/next/app"
import { useAtomValue, useSetAtom } from "jotai"
import { SparklesIcon } from "lucide-react"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

import { agentChatOpenAtom, agentMessagesAtom } from "./agent-state"

/**
 * Opens the agent chat from the phone's bottom bar. The agent acts on the
 * home page, so on other pages it goes home first.
 */
export function AgentNavButton() {
  const setIsOpen = useSetAtom(agentChatOpenAtom)
  const messages = useAtomValue(agentMessagesAtom)
  const pathname = usePathname()
  const router = useRouter()

  const latest = messages.at(-1)
  const isBusy =
    latest?.role === "agent" &&
    (latest.status === "thinking" || latest.status === "working")

  return (
    <button
      type="button"
      onClick={() => {
        setIsOpen(true)
        trackEvent({ name: "open_agent_chat", properties: { method: "nav" } })
        if (pathname !== "/") router.push("/")
      }}
      className="flex h-8 items-center gap-1.5 pr-0.5 text-sm font-medium text-foreground"
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
      </span>
      Ask
    </button>
  )
}
