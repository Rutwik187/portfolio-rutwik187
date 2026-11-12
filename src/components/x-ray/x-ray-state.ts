import { atom } from "jotai"

import type { XRayData } from "@/config/x-ray"

/** "closing" keeps the code on screen while the lens shrinks away. */
export type XRayPhase = "off" | "on" | "closing"

/** "lens" shows code only inside the circle at the cursor; "full" everywhere. */
export type XRayView = "lens" | "full"

export const xRayPhaseAtom = atom<XRayPhase>("off")
export const xRayViewAtom = atom<XRayView>("lens")
/** Fetched from `/x-ray.json` the first time X-ray mode turns on. */
export const xRayDataAtom = atom<XRayData | null>(null)

export const toggleXRayAtom = atom(null, (get, set) => {
  set(xRayPhaseAtom, get(xRayPhaseAtom) === "on" ? "closing" : "on")
})
