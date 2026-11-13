"use client"

import { Fragment } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { WORK } from "../../data/work"
import { useOpenWork } from "./use-open-work"

const CASE_ID = "knowledge-hub"

/**
 * One project opened as a case: the Knowledge Hub's real RAG pipeline, drawn
 * as two paths of hairline nodes. Each node is a step the code takes; the
 * last one, the answer with its sources, is the one drawn in saffron.
 */
export function WorkCase() {
  const openWork = useOpenWork()
  const work = WORK.find((item) => item.id === CASE_ID)
  if (!work?.process) return null

  return (
    <figure className="mt-24 lg:mt-36" aria-labelledby="work-case-title">
      <div className="grid gap-y-5 lg:grid-cols-12 lg:items-end lg:gap-x-(--gap-columns)">
        <h3
          id="work-case-title"
          className="font-display text-display-s tracking-display lowercase lg:col-span-7"
        >
          {work.process.title}
        </h3>
        <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9">
          <p className="text-lead text-muted-foreground">
            {work.title}, for {work.client}. {work.summary}.
          </p>
          <Button
            variant="outline"
            size="pill"
            className="lowercase"
            aria-haspopup="dialog"
            onClick={() => openWork(work.id, "case")}
          >
            Open the case
          </Button>
        </div>
      </div>

      <div
        className="mt-12 rounded-[10px] border border-rule bg-paper-2 blueprint px-5 py-8 sm:px-10 sm:py-12"
        role="img"
        aria-label={`Diagram of the ${work.title} pipeline: ${work.process.lanes
          .map(
            (lane) =>
              `${lane.title}, ${lane.steps.map((step) => step.title).join(", then ")}`
          )
          .join(". ")}.`}
      >
        <div className="space-y-10 lg:space-y-12" aria-hidden>
          {work.process.lanes.map((lane, laneIndex) => {
            const isAnswerLane = laneIndex === work.process!.lanes.length - 1

            return (
              <div
                key={lane.title}
                className="grid gap-y-4 lg:grid-cols-[10rem_minmax(0,1fr)] lg:items-center lg:gap-x-8"
              >
                <p className="text-[0.9375rem] text-muted-foreground lowercase">
                  {lane.title}
                </p>

                <div className="flex flex-col lg:flex-row lg:items-stretch">
                  {lane.steps.map((step, stepIndex) => {
                    const isLast = stepIndex === lane.steps.length - 1
                    const isSignal = isAnswerLane && isLast

                    return (
                      <Fragment key={step.title}>
                        <div
                          className={cn(
                            "flex min-h-12 items-center rounded-md border bg-paper px-3 py-2 font-mono text-[0.8125rem]/snug lowercase lg:flex-1 lg:justify-center lg:text-center",
                            isSignal
                              ? "border-brand text-brand-strong"
                              : "border-rule-2 text-ink-2"
                          )}
                        >
                          {step.title}
                        </div>
                        {!isLast && (
                          <div
                            className={cn(
                              "ml-6 h-4 w-px self-start lg:mx-0 lg:h-px lg:w-6 lg:shrink-0 lg:self-center",
                              isAnswerLane &&
                                stepIndex === lane.steps.length - 2
                                ? "bg-brand"
                                : "bg-rule-2"
                            )}
                          />
                        )}
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </figure>
  )
}
