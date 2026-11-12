import { atom } from "jotai"

export type AgentStepState = {
  label: string
  status: "pending" | "running" | "done"
  ms?: number
  /** The element the step acts on, so the visitor can go back to it. */
  target?: string
}

export type AgentUserMessage = { id: number; role: "user"; text: string }

export type AgentReply = {
  id: number
  role: "agent"
  /**
   * `thinking` until the plan arrives, `working` while the answer streams and
   * the steps run, then `done`. `stopped` when the visitor stops it.
   */
  status: "thinking" | "working" | "done" | "stopped"
  /** The model that planned this reply, or the on-device fallback. */
  engine: string
  intent: string
  planMs: number
  steps: AgentStepState[]
  answer: string
  /** How many words of the answer are on screen. */
  shownWords: number
  followUps: string[]
}

export type AgentMessage = AgentUserMessage | AgentReply

/** Kept in an atom, so the chat survives a visit to another page. */
export const agentMessagesAtom = atom<AgentMessage[]>([])

export const agentChatOpenAtom = atom(false)

/** The latest question for the agent. `id` changes even if the text repeats. */
export const agentQuestionAtom = atom<{ text: string; id: number } | null>(null)

/** Asks the agent a question and opens the chat to show the reply. */
export const askAgentAtom = atom(null, (get, set, text: string) => {
  set(agentChatOpenAtom, true)
  set(agentQuestionAtom, { text, id: (get(agentQuestionAtom)?.id ?? 0) + 1 })
})

/** The words of an answer, in the same split the chat streams them in. */
export function answerWords(answer: string) {
  return answer.split(/\s+/).filter(Boolean)
}

export function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`
}
