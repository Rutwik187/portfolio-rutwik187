"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { USER } from "@/features/portfolio/data/user"

type Status = {
  label: string
  awake: boolean
}

function getStatus(): Status {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: USER.timeZone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  )

  if (hour >= 1 && hour < 8) {
    return { label: "Probably asleep in Pune. Or debugging.", awake: false }
  }
  if (hour >= 16 && hour < 18) {
    return { label: "Chai break in Pune. Back in 10.", awake: true }
  }
  return { label: "Online in Pune, probably shipping code.", awake: true }
}

/** A presence dot on the avatar, guessed from the local time in Pune. */
export function PuneStatus({ className }: { className?: string }) {
  // Unknown on the server; the real value depends on the visitor's clock.
  const [status, setStatus] = useState<Status | null>(null)

  useEffect(() => {
    const update = () => setStatus(getStatus())
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (!status) return null

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "flex size-5 cursor-help items-center justify-center rounded-full bg-background ring-1 ring-border sm:size-6",
              className
            )}
            tabIndex={0}
            aria-label={status.label}
          >
            {status.awake ? (
              <span className="relative flex size-2.5 sm:size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-40" />
                <span className="relative inline-flex size-full rounded-full bg-success" />
              </span>
            ) : (
              <span className="font-mono text-[0.625rem] font-medium text-muted-foreground">
                z
              </span>
            )}
          </span>
        }
      />
      <TooltipContent>{status.label}</TooltipContent>
    </Tooltip>
  )
}
