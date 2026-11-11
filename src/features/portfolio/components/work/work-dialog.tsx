"use client"

import { useId, useRef, useState } from "react"
import Image from "next/image"
import { addQueryParams } from "@/utils/url"
import { useAtom } from "jotai"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  XIcon,
} from "lucide-react"

import { UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tag } from "@/components/ui/tag"

import { WORK } from "../../data/work"
import type { Work } from "../../types/work"
import { BrowserFrame, PhoneFrame } from "./device-frames"
import { workDialogAtom } from "./work-state"

/** A touch drag shorter than this is a tap, not a swipe. */
const SWIPE_DISTANCE = 40

const pad = (value: number) => String(value).padStart(2, "0")

export function WorkDialog() {
  const [state, setState] = useAtom(workDialogAtom)
  const work = WORK.find((item) => item.id === state.id)

  return (
    <Dialog
      open={state.open}
      onOpenChange={(open) => setState((current) => ({ ...current, open }))}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        {/* A new key per project resets the screenshot index. */}
        {work && <WorkDetails key={work.id} work={work} />}

        <DialogClose
          render={
            <Button
              variant="outline"
              size="icon-sm"
              className="absolute top-3 right-3 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
            />
          }
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

function WorkDetails({ work }: { work: Work }) {
  const [index, setIndex] = useState(0)
  const swipeStartX = useRef<number | null>(null)

  const count = work.shots.length
  const shot = work.shots[index]
  const go = (step: number) =>
    setIndex((current) => (current + step + count) % count)

  return (
    <div
      className="overflow-y-auto overscroll-contain"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1)
        if (event.key === "ArrowLeft") go(-1)
      }}
    >
      <figure>
        <div
          className="relative flex h-(--stage-height) touch-pan-y items-center justify-center overflow-hidden bg-muted/60 dot-grid px-12 py-6 [--stage-height:min(54dvh,30rem)] sm:px-16"
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse")
              swipeStartX.current = event.clientX
          }}
          onPointerUp={(event) => {
            if (swipeStartX.current === null) return
            const distance = event.clientX - swipeStartX.current
            swipeStartX.current = null
            if (Math.abs(distance) > SWIPE_DISTANCE) go(distance < 0 ? 1 : -1)
          }}
        >
          {shot.device === "desktop" ? (
            <BrowserFrame
              key={index}
              src={shot.src}
              alt={shot.alt}
              sizes="(min-width: 56rem) 760px, 92vw"
              className="w-[min(100%,calc((var(--stage-height)-4.75rem)*1.6))] animate-in duration-300 fade-in-0"
            />
          ) : (
            <PhoneFrame
              key={index}
              src={shot.src}
              alt={shot.alt}
              sizes="240px"
              className="w-[min(70%,calc((var(--stage-height)-3rem)*0.44))] animate-in duration-300 fade-in-0"
            />
          )}

          <Button
            variant="outline"
            size="icon-sm"
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm sm:left-4"
            onClick={() => go(-1)}
            aria-label="Previous screenshot"
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm sm:right-4"
            onClick={() => go(1)}
            aria-label="Next screenshot"
          >
            <ArrowRightIcon />
          </Button>

          <span className="absolute bottom-3 left-4 rounded-full bg-background/80 px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums backdrop-blur-sm">
            {pad(index + 1)} / {pad(count)}
          </span>
        </div>

        <figcaption
          className="flex min-h-11 items-center border-y border-line px-5 py-2.5 text-sm text-pretty text-muted-foreground sm:px-6"
          aria-live="polite"
        >
          {shot.caption}
        </figcaption>
      </figure>

      <ul
        className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line px-5 py-3 sm:px-6"
        aria-label="Screenshots"
      >
        {work.shots.map((item, itemIndex) => (
          <li key={itemIndex} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Screenshot ${itemIndex + 1}: ${item.alt}`}
              aria-current={itemIndex === index}
              className={cn(
                "relative block h-12 overflow-hidden rounded-md ring-1 ring-border transition",
                item.device === "desktop" ? "aspect-16/10" : "aspect-9/19",
                itemIndex === index
                  ? "ring-2 ring-brand"
                  : "opacity-55 hover:opacity-100"
              )}
            >
              <Image
                src={item.src}
                alt=""
                sizes="80px"
                className="size-full object-cover object-top"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-8 p-5 sm:grid-cols-[minmax(0,1fr)_14rem] sm:gap-10 sm:p-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <p className="font-mono text-xs text-muted-foreground">
              {work.client} · {work.year}
            </p>
            <DialogTitle className="text-2xl/tight font-semibold tracking-tight">
              {work.title}
            </DialogTitle>
          </div>

          <DialogDescription className="text-base/relaxed text-pretty text-muted-foreground">
            {work.description}
          </DialogDescription>

          <ul className="space-y-2.5">
            {work.highlights.map((highlight) => (
              <li
                key={highlight}
                className="relative pl-5 text-sm/relaxed text-pretty"
              >
                <span
                  className="absolute top-[0.65em] left-0.5 size-1.5 rounded-full bg-brand"
                  aria-hidden
                />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-6 sm:border-l sm:border-dashed sm:border-line sm:pl-6">
          {work.links.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:flex-col">
              {work.links.map((link, linkIndex) => (
                <Button
                  key={link.href}
                  variant={linkIndex === 0 ? "default" : "outline"}
                  className="sm:justify-between"
                  nativeButton={false}
                  render={
                    <a
                      href={addQueryParams(link.href, UTM_PARAMS)}
                      target="_blank"
                      rel="noopener"
                    >
                      {link.label}
                      <ArrowUpRightIcon data-icon="inline-end" />
                    </a>
                  }
                />
              ))}
            </div>
          )}

          <dl className="space-y-5 text-sm">
            {work.role && (
              <div>
                <dt className="font-mono text-xs text-muted-foreground">
                  Role
                </dt>
                <dd className="mt-1">{work.role}</dd>
              </div>
            )}
            <div>
              <dt className="font-mono text-xs text-muted-foreground">Stack</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-1.5">
                  {work.stack.map((item) => (
                    <li key={item} className="flex">
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </aside>

        {work.process && <Process process={work.process} />}
      </div>
    </div>
  )
}

function Process({ process }: { process: NonNullable<Work["process"]> }) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="space-y-5 border-t border-line pt-6 sm:col-span-2"
    >
      <h3 id={titleId} className="font-medium">
        {process.title}
      </h3>

      <div className="grid gap-8 sm:grid-cols-2">
        {process.lanes.map((lane) => (
          <div key={lane.title}>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {lane.title}
            </p>
            <ol className="mt-4">
              {lane.steps.map((step, stepIndex) => (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0"
                >
                  {stepIndex < lane.steps.length - 1 && (
                    <span
                      className="absolute top-7 bottom-1 left-3 w-px -translate-x-1/2 bg-border"
                      aria-hidden
                    />
                  )}
                  <span className="flex size-6 items-center justify-center rounded-full border border-border bg-background font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
                    {stepIndex + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-sm text-pretty text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
