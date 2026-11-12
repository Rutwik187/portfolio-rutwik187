"use client"

import { useCallback, useEffect, useRef } from "react"
import { useAtom, useSetAtom } from "jotai"
import { ScanEyeIcon, XIcon } from "lucide-react"
import { animate } from "motion/react"
import { useHotkeys } from "react-hotkeys-hook"

import type { XRayData } from "@/config/x-ray"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

import {
  toggleXRayAtom,
  xRayDataAtom,
  xRayPhaseAtom,
  xRayViewAtom,
} from "./x-ray-state"

const LENS_RADIUS = 140
/** Covers the whole page from any point: the "full" view. */
const FULL_RADIUS = 20_000
/** How long the code stays everywhere before it shrinks into the lens. */
const INTRO_HOLD_MS = 900

/**
 * Runs X-ray mode on the home page: keyboard shortcuts, loading the source,
 * the lens that follows the cursor, and the status bar.
 *
 * The lens is a CSS mask on each section's code overlay. This component moves
 * it by writing CSS variables in a requestAnimationFrame, not React state, so
 * a moving cursor never re-renders the page.
 */
export function XRayController() {
  const [phase, setPhase] = useAtom(xRayPhaseAtom)
  const [view, setView] = useAtom(xRayViewAtom)
  const [data, setData] = useAtom(xRayDataAtom)
  const toggle = useXRayToggle()

  const canUseLens = useMediaQuery("(hover: hover) and (pointer: fine)")
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const radiusRef = useRef(0)
  const frameRef = useRef(0)

  const isActive = phase !== "off" && data !== null
  const isLens = view === "lens" && canUseLens

  useHotkeys("x", () => toggle("keyboard"))
  useHotkeys("escape", () => setPhase("closing"), {
    enabled: phase === "on",
  })
  useHotkeys(
    "f",
    () => setView((current) => (current === "lens" ? "full" : "lens")),
    { enabled: phase === "on" && canUseLens }
  )

  // Load the source the first time X-ray mode turns on.
  useEffect(() => {
    if (phase !== "on" || data) return
    const controller = new AbortController()
    fetch("/x-ray.json", { signal: controller.signal })
      .then((response) => response.json() as Promise<XRayData>)
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setPhase("off")
      })
    return () => controller.abort()
  }, [phase, data, setData, setPhase])

  /** Moves the lens: reads every section's box first, then writes. */
  const sync = useCallback(() => {
    frameRef.current = 0
    const pointer = pointerRef.current ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    const radius = radiusRef.current

    const sections = [
      ...document.querySelectorAll<HTMLElement>("[data-x-ray-section]"),
    ]
    const boxes = sections.map((section) => section.getBoundingClientRect())

    let hovered: string | null = null
    sections.forEach((section, index) => {
      const box = boxes[index]
      const overlay = section.querySelector<HTMLElement>("[data-x-ray-overlay]")
      overlay?.style.setProperty("--x-ray-x", `${pointer.x - box.left}px`)
      overlay?.style.setProperty("--x-ray-y", `${pointer.y - box.top}px`)

      const isInside =
        pointer.x >= box.left &&
        pointer.x <= box.right &&
        pointer.y >= box.top &&
        pointer.y <= box.bottom
      if (isInside) hovered = section.dataset.xRayComponent ?? null
    })

    document.documentElement.style.setProperty("--x-ray-r", `${radius}px`)

    const ring = ringRef.current
    if (ring) {
      // The ring draws the lens edge, so it only shows while the edge is on
      // screen: during the intro and in the lens view.
      const isEdgeOnScreen = radius > 0 && radius < 2400
      ring.style.opacity = isEdgeOnScreen ? "1" : "0"
      ring.style.width = ring.style.height = `${radius * 2}px`
      ring.style.transform = `translate(${pointer.x - radius}px, ${pointer.y - radius}px)`
    }
    if (labelRef.current) {
      labelRef.current.textContent = hovered ? `<${hovered} />` : ""
      labelRef.current.style.opacity = hovered && radius < 400 ? "1" : "0"
    }
  }, [])

  const schedule = useCallback(() => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(sync)
  }, [sync])

  // Follow the cursor and the scroll position while X-ray is on.
  useEffect(() => {
    if (!isActive) return
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      schedule()
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    schedule()
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
  }, [isActive, schedule])

  // Animate the lens radius: open, hold, shrink into the lens, or close.
  useEffect(() => {
    if (!data || phase === "off") return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const screenRadius = Math.hypot(window.innerWidth, window.innerHeight)
    const target = isLens ? LENS_RADIUS : FULL_RADIUS
    let cancelled = false
    let stop = () => {}

    const tween = (from: number, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        if (reduceMotion || cancelled) {
          radiusRef.current = to
          schedule()
          return resolve()
        }
        const controls = animate(from, to, {
          duration,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (value) => {
            radiusRef.current = value
            schedule()
          },
          onComplete: resolve,
        })
        stop = () => controls.stop()
      })
    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, reduceMotion ? 0 : ms))

    const run = async () => {
      // Beyond the screen edge the size no longer shows, so jump instead of
      // animating through thousands of pixels.
      const start = Math.min(radiusRef.current, screenRadius)

      if (phase === "closing") {
        await tween(start, 0, 0.45)
        if (!cancelled) setPhase("off")
        return
      }

      if (radiusRef.current === 0) {
        // Opening: the code spreads out from the cursor over the whole page.
        await tween(0, screenRadius, 0.9)
        radiusRef.current = FULL_RADIUS
        schedule()
        if (!isLens) return
        await wait(INTRO_HOLD_MS)
        if (cancelled) return
        await tween(screenRadius, LENS_RADIUS, 0.7)
        return
      }

      if (target === FULL_RADIUS) {
        await tween(start, screenRadius, 0.6)
        if (cancelled) return
        radiusRef.current = FULL_RADIUS
        schedule()
      } else {
        await tween(start, LENS_RADIUS, 0.6)
      }
    }

    run()
    return () => {
      cancelled = true
      stop()
    }
  }, [data, phase, isLens, schedule, setPhase])

  // Reset, so the next opening starts from nothing.
  useEffect(() => {
    if (phase === "off") {
      radiusRef.current = 0
      document.documentElement.style.removeProperty("--x-ray-r")
    }
  }, [phase])

  if (phase === "off") return null

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-40 rounded-full border border-brand/80 opacity-0 shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_12%,transparent),0_0_60px_-8px_var(--brand)] transition-opacity duration-200"
        aria-hidden
      >
        <span
          ref={labelRef}
          className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2 rounded-md bg-brand px-1.5 py-0.5 font-mono text-[0.6875rem] font-medium whitespace-nowrap text-brand-foreground opacity-0 transition-opacity"
        />
      </div>

      <XRayStatusBar
        data={data}
        view={view}
        canUseLens={canUseLens}
        onToggleView={() =>
          setView((current) => (current === "lens" ? "full" : "lens"))
        }
        onClose={() => toggle("status_bar")}
      />
    </>
  )
}

function XRayStatusBar({
  data,
  view,
  canUseLens,
  onToggleView,
  onClose,
}: {
  data: XRayData | null
  view: "lens" | "full"
  canUseLens: boolean
  onToggleView: () => void
  onClose: () => void
}) {
  const builtOn = data
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(data.builtAt))
    : null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(--spacing(18)+env(safe-area-inset-bottom,0))] z-50 flex justify-center px-3 sm:bottom-6">
      <div
        role="status"
        className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full border bg-background/85 py-1.5 pr-1.5 pl-3.5 font-mono text-xs shadow-lg backdrop-blur-md"
      >
        <span className="flex shrink-0 items-center gap-1.5 font-medium text-brand-strong">
          <ScanEyeIcon className="size-4" aria-hidden />
          X-RAY
        </span>

        <span className="truncate text-muted-foreground">
          {data ? (
            <>
              {Object.keys(data.sections).length} components ·{" "}
              {data.totalLines.toLocaleString("en-IN")} lines of TSX
              <span className="max-md:hidden">
                {" "}
                · built {builtOn}
                {data.commit && ` · ${data.commit}`}
              </span>
            </>
          ) : (
            "reading the source…"
          )}
        </span>

        {canUseLens && data && (
          <button
            type="button"
            className="shrink-0 rounded-full border px-2.5 py-1 transition-colors hover:bg-accent max-sm:hidden"
            onClick={onToggleView}
          >
            {view === "lens" ? "Full view" : "Lens view"}
            <kbd className="ml-1.5 text-muted-foreground">F</kbd>
          </button>
        )}

        <button
          type="button"
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent"
          )}
          aria-label="Turn off X-ray mode"
          onClick={onClose}
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

/** Toggles X-ray mode and records where it was toggled from. */
export function useXRayToggle() {
  const toggle = useSetAtom(toggleXRayAtom)

  return useCallback(
    (source: string) => {
      toggle()
      trackEvent({ name: "toggle_x_ray", properties: { source } })
    },
    [toggle]
  )
}
