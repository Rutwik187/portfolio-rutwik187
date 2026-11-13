import { atom } from "jotai"

import type { FormId } from "./hero-field-shapes"

/** A form's life: messy drift, coming together, holding, breaking up. */
export type FieldPhase = "drift" | "assemble" | "hold" | "scatter"

export const HERO_FORMS: { id: FormId; label: string }[] = [
  { id: "web", label: "Web apps" },
  { id: "mobile", label: "Mobile apps" },
  { id: "agent", label: "AI agents" },
]

/** Seconds for each phase of one form's life. */
export const PHASE_SECONDS: Record<FieldPhase, number> = {
  drift: 0.7,
  assemble: 2.6,
  hold: 4.4,
  scatter: 1.5,
}

/** Seconds a form takes to come together and then hold, for the index bar. */
export const FORM_SHOWN_SECONDS = PHASE_SECONDS.assemble + PHASE_SECONDS.hold

export const heroFieldAtom = atom<{
  form: number
  phase: FieldPhase
  /** Goes up each time a form starts to come together. */
  cycle: number
  /** False until WebGL draws, so the index stays plain text without it. */
  live: boolean
}>({ form: 0, phase: "drift", cycle: 0, live: false })

/** The form the visitor picked in the index. `at` makes repeats distinct. */
export const heroFieldRequestAtom = atom<{ form: number; at: number } | null>(
  null
)
