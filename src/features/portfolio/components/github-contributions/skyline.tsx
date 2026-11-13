"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { format, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { useContributionGraph } from "@/components/kit/contribution-graph"

import type { SkylineHover } from "./skyline-scene"

/**
 * The year of commits as a 3D city, drawn with three.js once the graph is
 * near the screen. The bars rise when it scrolls into view; hovering a bar
 * shows that day. Calls `onUnsupported` if WebGL is not there.
 */
export function ContributionSkyline({
  className,
  onUnsupported,
}: {
  className?: string
  onUnsupported: () => void
}) {
  const { weeks } = useContributionGraph()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<SkylineHover | null>(null)
  const handleUnsupported = useEffectEvent(onUnsupported)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    let disposed = false
    const teardown: Array<() => void> = []

    import("./skyline-scene").then(({ createSkylineScene }) => {
      if (disposed) return
      const scene = createSkylineScene(canvas, {
        weeks,
        reducedMotion,
        onHover: setHover,
      })
      if (!scene) {
        handleUnsupported()
        return
      }

      const resizeObserver = new ResizeObserver(([entry]) =>
        scene.resize(entry.contentRect.width, entry.contentRect.height)
      )
      resizeObserver.observe(canvas)

      const growObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          scene.grow()
          growObserver.disconnect()
        },
        { threshold: 0.4 }
      )
      growObserver.observe(canvas)

      const handleMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        const box = canvas.getBoundingClientRect()
        scene.setPointer({
          x: event.clientX - box.left,
          y: event.clientY - box.top,
        })
      }
      const handleLeave = () => scene.setPointer(null)
      wrapper.addEventListener("pointermove", handleMove)
      wrapper.addEventListener("pointerleave", handleLeave)

      const themeObserver = new MutationObserver(() => scene.refreshColors())
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })

      canvas.dataset.ready = ""

      teardown.push(() => {
        resizeObserver.disconnect()
        growObserver.disconnect()
        themeObserver.disconnect()
        wrapper.removeEventListener("pointermove", handleMove)
        wrapper.removeEventListener("pointerleave", handleLeave)
        scene.dispose()
      })
    })

    return () => {
      disposed = true
      teardown.forEach((fn) => fn())
    }
  }, [weeks])

  return (
    <div
      ref={wrapperRef}
      className={cn("relative h-[clamp(11rem,24vw,22rem)] w-full", className)}
    >
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-700 data-ready:opacity-100"
        aria-hidden
      />

      {hover && (
        <p
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-md bg-popover px-2.5 py-1.5 text-sm whitespace-nowrap text-popover-foreground shadow-card outline-1 -outline-offset-1 outline-rule-2"
          style={{ left: hover.x, top: hover.y }}
          aria-hidden
        >
          <span className="tabular-nums">{hover.activity.count}</span>{" "}
          contribution{hover.activity.count === 1 ? "" : "s"} on{" "}
          {format(parseISO(hover.activity.date), "d MMM yyyy")}
        </p>
      )}
    </div>
  )
}
