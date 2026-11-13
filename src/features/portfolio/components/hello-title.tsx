"use client"

import { useSyncExternalStore } from "react"

import { InlineScript } from "@/components/inline-script"

const ID = "about"
const SSR_TEXT = "Hello there"

export function HelloTitle() {
  // Server renders a neutral greeting; the client snapshot resolves the viewer's local
  // greeting, which also covers client-side navigation (no inline script).
  const greeting = useSyncExternalStore(
    () => () => {},
    getGreeting,
    () => SSR_TEXT
  )

  return (
    <>
      <p
        className="font-display text-display-s tracking-display lowercase"
        aria-hidden
      >
        <span lang="mr">नमस्कार</span>,{" "}
        <span id={`${ID}-greeting`} suppressHydrationWarning>
          {greeting}
        </span>
      </p>

      <InlineScript html={getInlineScript(`${ID}-greeting`)} />
    </>
  )
}

// Self-contained (globals only) so it can be serialized via `.toString()` into
// the pre-hydration script as well as used as the client snapshot.
function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 0 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 17) return "Good afternoon"
  return "Good evening"
}

function runGreetingScript(elementId: string, compute: typeof getGreeting) {
  try {
    const el = document.getElementById(elementId)
    if (el) el.textContent = compute()
  } catch {}
}

// Blocking inline script that paints the greeting before hydration on the
// initial document load (Next.js "prevent flash before hydration").
function getInlineScript(elementId: string) {
  return `(${runGreetingScript.toString()})(${JSON.stringify(elementId)},${getGreeting.toString()})`
}
