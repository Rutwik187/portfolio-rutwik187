"use client"

import { useRef, useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

import { WORK } from "../../data/work"
import type { Work } from "../../types/work"
import { BrowserFrame, PhoneFrame } from "./device-frames"
import { useOpenWork } from "./use-open-work"
import { WorkDialog } from "./work-dialog"

const PREVIEW_WIDTH = 352
const PREVIEW_HEIGHT = 236
/** Space between the cursor and the preview card. */
const CURSOR_GAP = 28
const FOLLOW_SPRING = { stiffness: 260, damping: 28, mass: 0.5 }

export function WorkList() {
  const openWork = useOpenWork()
  const listRef = useRef<HTMLOListElement>(null)

  // `activeId` says if the preview is visible. `shownId` keeps the last
  // project on the card, so it does not go blank while it fades out.
  const [activeId, setActiveId] = useState<string | null>(null)
  const [shownId, setShownId] = useState<string | null>(null)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, FOLLOW_SPRING)
  const y = useSpring(pointerY, FOLLOW_SPRING)
  const velocityX = useVelocity(x)
  // Tilt the card a little in the direction it travels.
  const rotate = useTransform(velocityX, [-1600, 1600], [-7, 7])

  const follow = (event: React.PointerEvent, snap: boolean) => {
    const list = listRef.current
    if (!list) return

    const rect = list.getBoundingClientRect()
    const fitsOnRight =
      event.clientX + CURSOR_GAP + PREVIEW_WIDTH < window.innerWidth - 16
    const nextX =
      event.clientX -
      rect.left +
      (fitsOnRight ? CURSOR_GAP : -CURSOR_GAP - PREVIEW_WIDTH)
    const nextY = event.clientY - rect.top - PREVIEW_HEIGHT / 2

    pointerX.set(nextX)
    pointerY.set(nextY)
    if (snap) {
      // Start at the cursor instead of flying in from the last position.
      x.jump(nextX)
      y.jump(nextY)
    }
  }

  const handleOpen = (work: Work) => {
    setActiveId(null)
    openWork(work.id, "list")
  }

  return (
    <div className="relative mx-4">
      <ol
        ref={listRef}
        className="group/list"
        onPointerLeave={() => setActiveId(null)}
      >
        {WORK.map((work, index) => (
          <li key={work.id} className="border-b border-line last:border-b-0">
            <button
              type="button"
              aria-haspopup="dialog"
              data-agent={`work-${work.id}`}
              className="group/row flex w-full items-center gap-4 py-4 text-left transition-opacity duration-300 outline-none group-hover/list:opacity-40 hover:opacity-100 focus-visible:bg-accent-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return
                follow(event, activeId === null)
                setActiveId(work.id)
                setShownId(work.id)
              }}
              onPointerMove={(event) => {
                if (event.pointerType === "mouse") follow(event, false)
              }}
              onClick={() => handleOpen(work)}
            >
              <span
                className="w-6 shrink-0 font-mono text-sm text-muted-foreground tabular-nums"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex min-w-0 flex-1 items-center gap-4">
                <span className="min-w-0 flex-1 transition-transform duration-300 group-hover/row:translate-x-1">
                  <span className="block leading-snug font-medium text-balance">
                    {work.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-pretty text-muted-foreground">
                    {work.summary}
                  </span>
                  <span className="mt-1.5 block font-mono text-xs text-muted-foreground sm:hidden">
                    {work.kind} · {work.year}
                  </span>
                </span>

                <span className="shrink-0 font-mono text-xs text-muted-foreground max-sm:hidden">
                  {work.kind} · {work.year}
                </span>
                <ArrowRightIcon
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover/row:translate-x-0.5 group-hover/row:text-foreground"
                  aria-hidden
                />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <WorkPreview
        isVisible={activeId !== null}
        shownId={shownId}
        x={x}
        y={y}
        rotate={rotate}
      />

      <WorkDialog />
    </div>
  )
}

/** A card with the project's screenshot that follows a mouse over the list. */
function WorkPreview({
  isVisible,
  shownId,
  x,
  y,
  rotate,
}: {
  isVisible: boolean
  shownId: string | null
  x: MotionValue<number>
  y: MotionValue<number>
  rotate: MotionValue<number>
}) {
  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-20 hidden motion-reduce:hidden pointer-fine:block"
      style={{ x, y, rotate, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
      aria-hidden
    >
      <motion.div
        className="relative size-full overflow-hidden rounded-2xl shadow-2xl ring-1 shadow-zinc-950/30 ring-zinc-950/10 dark:ring-white/10"
        initial={false}
        animate={
          isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }
        }
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {WORK.map((work) => (
          <div
            key={work.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              work.id === shownId ? "opacity-100" : "opacity-0"
            )}
            style={{
              backgroundImage: `linear-gradient(135deg, ${work.accent.from}, ${work.accent.to})`,
            }}
          >
            <Cover work={work} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function Cover({ work }: { work: Work }) {
  const [first, second] = work.cover.images

  if (work.cover.device === "desktop") {
    // Bleeds off the right and bottom edges, like a framed shot.
    return (
      <BrowserFrame
        src={first}
        alt=""
        sizes="360px"
        className="absolute top-7 left-7 w-[calc(100%-0.25rem)]"
      />
    )
  }

  return (
    <>
      <PhoneFrame
        src={first}
        alt=""
        sizes="128px"
        className="absolute top-6 left-[16%] w-[32%] -rotate-3"
      />
      {second && (
        <PhoneFrame
          src={second}
          alt=""
          sizes="128px"
          className="absolute top-11 right-[16%] w-[32%] rotate-3"
        />
      )}
    </>
  )
}
