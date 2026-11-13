"use client"

import { useEffect, useRef } from "react"
import { useAtomValue, useSetAtom } from "jotai"

import { cn } from "@/lib/utils"

import type { HeroFieldScene } from "./hero-field-scene"
import { heroFieldAtom, heroFieldRequestAtom } from "./hero-field-state"

/**
 * The hero's particle field. It loads three.js after the page is up, finds
 * the `[data-hero-field-anchor]` box in its section and builds each form
 * there, above `[data-hero-field-floor]` if that rises into the box. Without
 * WebGL it draws nothing and the hero stays as it was.
 */
export function HeroFieldCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HeroFieldScene | null>(null)
  const setField = useSetAtom(heroFieldAtom)
  const request = useAtomValue(heroFieldRequestAtom)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.closest("section")
    if (!canvas || !section) return

    const anchor = section.querySelector<HTMLElement>(
      "[data-hero-field-anchor]"
    )
    const floor = section.querySelector<HTMLElement>("[data-hero-field-floor]")
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let disposed = false
    const teardown: Array<() => void> = []

    import("./hero-field-scene").then(({ createHeroFieldScene }) => {
      if (disposed) return

      const width = window.innerWidth
      const scene = createHeroFieldScene(canvas, {
        count: width < 640 ? 9000 : width < 1280 ? 16000 : 22000,
        reducedMotion,
        onChange: ({ form, phase }) =>
          setField((field) => ({
            form,
            phase,
            cycle: phase === "assemble" ? field.cycle + 1 : field.cycle,
            live: true,
          })),
      })
      if (!scene) return
      sceneRef.current = scene

      const measure = () => {
        const box = canvas.getBoundingClientRect()
        scene.resize(box.width, box.height)
        if (!anchor) return
        const stage = anchor.getBoundingClientRect()
        let bottom = stage.bottom
        // Keep the form clear of anything that rises into the stage, such as
        // the agent panel on wide screens.
        if (floor) {
          const below = floor.getBoundingClientRect()
          const overlaps = below.left < stage.right && below.right > stage.left
          if (overlaps && below.top < bottom) bottom = below.top - 32
        }
        const height = Math.max(bottom - stage.top, 0)
        scene.setStage({
          x: stage.left - box.left + stage.width / 2,
          y: stage.top - box.top + height / 2,
          // The widest form is 1.5 units across and turns, so leave it room.
          size: Math.min(height * 0.92, stage.width / 1.75),
        })
      }
      measure()

      const resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(canvas)
      if (anchor) resizeObserver.observe(anchor)
      if (floor) resizeObserver.observe(floor)

      // Draw only while the hero is on screen and the tab is open.
      let onScreen = false
      const updateRunning = () =>
        scene.setRunning(onScreen && document.visibilityState === "visible")
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        updateRunning()
      })
      intersectionObserver.observe(canvas)

      const handlePointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        const box = canvas.getBoundingClientRect()
        const x = event.clientX - box.left
        const y = event.clientY - box.top
        const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height
        scene.setPointer(inside ? { x, y } : null)
      }
      const handleLeave = () => scene.setPointer(null)

      const handleScroll = () => {
        const box = section.getBoundingClientRect()
        scene.setScroll(-box.top / Math.max(box.height, 1))
      }
      handleScroll()

      const themeObserver = new MutationObserver(() => scene.refreshColors())
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })

      window.addEventListener("pointermove", handlePointer, { passive: true })
      document.documentElement.addEventListener("pointerleave", handleLeave)
      window.addEventListener("scroll", handleScroll, { passive: true })
      document.addEventListener("visibilitychange", updateRunning)

      canvas.dataset.ready = ""

      teardown.push(() => {
        resizeObserver.disconnect()
        intersectionObserver.disconnect()
        themeObserver.disconnect()
        window.removeEventListener("pointermove", handlePointer)
        document.documentElement.removeEventListener(
          "pointerleave",
          handleLeave
        )
        window.removeEventListener("scroll", handleScroll)
        document.removeEventListener("visibilitychange", updateRunning)
        scene.dispose()
        sceneRef.current = null
      })
    })

    return () => {
      disposed = true
      teardown.forEach((fn) => fn())
    }
  }, [setField])

  useEffect(() => {
    if (request) sceneRef.current?.showForm(request.form)
  }, [request])

  return (
    <div className={cn("pointer-events-none", className)} aria-hidden>
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-1000 ease-out data-ready:opacity-100"
      />
    </div>
  )
}
