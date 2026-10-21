"use client"

import { useEffect } from "react"

import { fireConfetti } from "@/lib/confetti"
import { trackEvent } from "@/lib/events"
import { toast } from "@/components/ui/toast"

const SEQUENCE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
]

/** Up, up, down, down, left, right, left, right, B, A. */
export function KonamiEasterEgg() {
  useEffect(() => {
    let progress = 0

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      if (key === SEQUENCE[progress]) {
        progress += 1
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0
      }

      if (progress === SEQUENCE.length) {
        progress = 0
        fireConfetti()
        toast.add({
          type: "success",
          title: "Achievement unlocked: Konami code",
          description:
            "You clearly know your way around a keyboard. If you are ever in Pune, the chai is on me.",
        })
        trackEvent({ name: "konami_unlocked" })
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return null
}
