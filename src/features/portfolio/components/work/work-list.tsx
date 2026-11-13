"use client"

import { useState } from "react"
import Image from "next/image"
import { useSetAtom } from "jotai"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"

import { WORK } from "../../data/work"
import type { Work } from "../../types/work"
import { WorkDialog } from "./work-dialog"
import { workDialogAtom } from "./work-state"

/**
 * The work as an index: one row per product, its facts in columns. On wide
 * screens the row under the pointer or the focus shows its cover in a pane
 * that holds still beside the list.
 */
export function WorkList() {
  const setDialog = useSetAtom(workDialogAtom)
  const [activeId, setActiveId] = useState(WORK[0].id)
  const active = WORK.find((work) => work.id === activeId) ?? WORK[0]

  const handleOpen = (work: Work) => {
    setDialog({ id: work.id, open: true })
    trackEvent({ name: "open_work", properties: { id: work.id } })
  }

  return (
    <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-(--gap-columns)">
      <div className="lg:col-span-7">
        <div
          className="hidden grid-cols-[minmax(0,1fr)_11rem_4.5rem] gap-x-6 border-b border-rule pb-3 text-sm text-muted-foreground lowercase sm:grid"
          aria-hidden
        >
          <span>Project</span>
          <span>Client</span>
          <span className="text-right">Year</span>
        </div>

        <ol className="group/list">
          {WORK.map((work) => (
            <li key={work.id} className="border-b border-rule">
              <button
                type="button"
                data-agent={`work-${work.id}`}
                aria-haspopup="dialog"
                className="group/row grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-6 text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,1fr)_11rem_4.5rem] sm:py-7"
                onPointerEnter={() => setActiveId(work.id)}
                onFocus={() => setActiveId(work.id)}
                onClick={() => handleOpen(work)}
              >
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block font-display text-[1.75rem]/[1.1] tracking-display lowercase transition-colors duration-150 sm:text-[2.125rem]/[1.05]",
                      work.id === active.id
                        ? "text-foreground"
                        : "text-ink-2 lg:text-muted-foreground"
                    )}
                  >
                    {work.title}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] text-ink-2 sm:hidden">
                    {work.client}
                  </span>
                  {/* Below desktop there is no pane, so each row says what it is. */}
                  <span className="mt-2 block text-[0.9375rem] text-pretty text-muted-foreground lg:hidden">
                    {work.summary}
                  </span>
                  <Image
                    src={work.cover.images[0]}
                    alt=""
                    sizes="(min-width: 640px) 60vw, 92vw"
                    placeholder="blur"
                    className={cn(
                      "mt-4 rounded-[8px] object-cover object-top outline-1 -outline-offset-1 outline-rule lg:hidden",
                      work.cover.device === "desktop"
                        ? "aspect-16/10 w-full"
                        : "aspect-9/16 w-1/2 sm:w-1/3"
                    )}
                  />
                </span>

                <span className="hidden self-start pt-2 text-[0.9375rem] text-ink-2 sm:block lg:self-center lg:pt-0">
                  {work.client}
                </span>
                <span className="self-start pt-2 text-right text-[0.9375rem] text-muted-foreground tabular-nums lg:self-center lg:pt-0">
                  {work.year}
                  <span className="block text-sm lg:hidden">{work.kind}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <figure
        className="sticky top-[calc(var(--header-height)+2rem)] hidden self-start lg:col-span-5 lg:block"
        aria-live="polite"
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-[10px] bg-paper-2 outline-1 -outline-offset-1 outline-rule">
          {WORK.map((work) => (
            <Cover key={work.id} work={work} isActive={work.id === active.id} />
          ))}
        </div>
        <figcaption className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1">
          <span className="text-[0.9375rem] text-pretty text-ink-2">
            {active.summary}
          </span>
          <span className="text-sm text-muted-foreground">{active.kind}</span>
        </figcaption>
      </figure>

      <WorkDialog />
    </div>
  )
}

/** The project's own screens, in the pane. Phones stand side by side. */
function Cover({ work, isActive }: { work: Work; isActive: boolean }) {
  const [first, second] = work.cover.images

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none",
        isActive ? "opacity-100" : "opacity-0"
      )}
      aria-hidden={!isActive}
    >
      {work.cover.device === "desktop" ? (
        <Image
          src={first}
          alt=""
          sizes="(min-width: 1440px) 540px, 38vw"
          placeholder="blur"
          className="absolute top-10 left-10 w-[125%] max-w-none rounded-tl-[6px] outline-1 -outline-offset-1 outline-rule"
        />
      ) : (
        <div className="absolute inset-x-0 top-10 flex justify-center gap-6">
          {[first, second].filter(Boolean).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              sizes="200px"
              placeholder="blur"
              className={cn(
                "w-[34%] rounded-[18px] outline-1 -outline-offset-1 outline-rule",
                index === 1 && "translate-y-8"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
