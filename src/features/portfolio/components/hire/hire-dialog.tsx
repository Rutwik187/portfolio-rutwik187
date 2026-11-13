"use client"

import { useId, useMemo, useState } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodeEmail } from "@/utils/string"
import { useAtom } from "jotai"
import { CheckIcon, CopyIcon, SendIcon } from "lucide-react"

import { fireConfetti } from "@/lib/confetti"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { USER } from "@/features/portfolio/data/user"

import { hireDialogOpenAtom } from "./hire-state"

const NEEDS = [
  "AI assistant or RAG",
  "Web app or website",
  "Mobile app",
  "Admin dashboard",
  "Bookings and payments",
  "Something else",
]

const ENGAGEMENTS = ["Freelance project", "Full-time role", "Contract"]

const TIMELINES = ["As soon as possible", "In the next 3 months", "Exploring"]

type Brief = {
  needs: string[]
  engagement: string
  timeline: string
  name: string
  company: string
  notes: string
}

const EMPTY_BRIEF: Brief = {
  needs: [],
  engagement: ENGAGEMENTS[0],
  timeline: TIMELINES[0],
  name: "",
  company: "",
  notes: "",
}

function formatBrief(brief: Brief) {
  const from = [brief.name, brief.company].filter(Boolean).join(", ")
  return [
    `From: ${from || "(your name)"}`,
    `Need: ${brief.needs.join(", ") || "(pick at least one)"}`,
    `Type: ${brief.engagement}`,
    `When: ${brief.timeline}`,
    "",
    brief.notes.trim() || "(a few lines about the project)",
  ].join("\n")
}

export function HireDialog() {
  const [open, setOpen] = useAtom(hireDialogOpenAtom)
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF)
  const [copied, setCopied] = useState(false)
  const ids = useId()

  const email = useMemo(() => decodeEmail(USER.emailB64), [])
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    []
  )

  const isReady = brief.needs.length > 0 && brief.name.trim().length > 0

  const update = <K extends keyof Brief>(key: K, value: Brief[K]) =>
    setBrief((prev) => ({ ...prev, [key]: value }))

  const toggleNeed = (need: string) =>
    update(
      "needs",
      brief.needs.includes(need)
        ? brief.needs.filter((item) => item !== need)
        : [...brief.needs, need]
    )

  const handleSend = () => {
    const subject = `Project brief: ${brief.needs.join(", ")}${brief.company ? ` (${brief.company})` : ""}`
    const body = `Hi Rutwik,\n\n${formatBrief(brief)}\n\nThanks,\n${brief.name}`
    trackEvent({
      name: "send_hire_brief",
      properties: {
        needs: brief.needs.join(","),
        engagement: brief.engagement,
        timeline: brief.timeline,
      },
    })
    fireConfetti()
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    toast.add({
      type: "success",
      title: "Your email app should open now",
      description: `If it doesn't, write to ${email}.`,
    })
  }

  const handleCopy = async () => {
    await copyToClipboardWithEvent(`${formatBrief(brief)}\n\nTo: ${email}`, {
      name: "copy_hire_brief",
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] gap-0 overflow-y-auto p-0 sm:max-w-4xl">
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <form
            className="space-y-5 p-5 sm:p-6"
            onSubmit={(e) => {
              e.preventDefault()
              if (isReady) handleSend()
            }}
          >
            <div className="space-y-1.5 pr-8">
              <DialogTitle className="font-display text-display-s tracking-display lowercase">
                Start a project brief
              </DialogTitle>
              <DialogDescription className="text-sm text-pretty">
                Four quick choices. I get a clear email, you get a reply about
                what it would take.
              </DialogDescription>
            </div>

            <ChipGroup
              legend="What do you need?"
              hint="Pick one or more"
              options={NEEDS}
              isSelected={(option) => brief.needs.includes(option)}
              onToggle={toggleNeed}
            />

            <ChipGroup
              legend="How would we work?"
              options={ENGAGEMENTS}
              isSelected={(option) => brief.engagement === option}
              onToggle={(option) => update("engagement", option)}
            />

            <ChipGroup
              legend="When?"
              options={TIMELINES}
              isSelected={(option) => brief.timeline === option}
              onToggle={(option) => update("timeline", option)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Your name" htmlFor={`${ids}-name`}>
                <input
                  id={`${ids}-name`}
                  value={brief.name}
                  onChange={(e) => update("name", e.target.value)}
                  autoComplete="name"
                  required
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Company (optional)" htmlFor={`${ids}-company`}>
                <input
                  id={`${ids}-company`}
                  value={brief.company}
                  onChange={(e) => update("company", e.target.value)}
                  autoComplete="organization"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            <Field label="A few lines about it" htmlFor={`${ids}-notes`}>
              <textarea
                id={`${ids}-notes`}
                value={brief.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                placeholder="Who is it for, what should it do, any deadline…"
                className={cn(INPUT_CLASS, "h-auto resize-none py-2")}
              />
            </Field>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={!isReady}
              >
                <SendIcon data-icon="inline-start" />
                Send by email
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckIcon data-icon="inline-start" />
                ) : (
                  <CopyIcon data-icon="inline-start" />
                )}
                {copied ? "Copied" : "Copy brief"}
              </Button>
            </div>
            {!isReady && (
              <p className="text-xs text-muted-foreground">
                Pick what you need and add your name to send.
              </p>
            )}
          </form>

          <BriefReceipt brief={brief} date={today} isReady={isReady} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

const INPUT_CLASS =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 dark:bg-input/30"

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function ChipGroup({
  legend,
  hint,
  options,
  isSelected,
  onToggle,
}: {
  legend: string
  hint?: string
  options: string[]
  isSelected: (option: string) => boolean
  onToggle: (option: string) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">
        {legend}
        {hint && (
          <span className="ml-2 font-normal text-muted-foreground">{hint}</span>
        )}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = isSelected(option)
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(option)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
                selected
                  ? "border-brand bg-brand/12 text-brand-strong"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {selected && <CheckIcon className="size-3.5" aria-hidden />}
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** The brief as it will arrive, filled in live as the visitor chooses. */
function BriefReceipt({
  brief,
  date,
  isReady,
}: {
  brief: Brief
  date: string
  isReady: boolean
}) {
  const rows: [string, string][] = [
    ["From", [brief.name, brief.company].filter(Boolean).join(", ")],
    ["Needs", brief.needs.join(", ")],
    ["Type", brief.engagement],
    ["When", brief.timeline],
    ["Notes", brief.notes.trim()],
  ]

  return (
    <div className="border-rule bg-paper-2 p-5 max-md:border-t sm:p-6 md:border-l">
      <div aria-live="polite" aria-label="Brief preview">
        <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3 md:pr-10">
          <p className="font-display text-title tracking-display lowercase">
            The brief
          </p>
          <p className="text-sm text-muted-foreground tabular-nums">{date}</p>
        </div>

        <dl className="text-[0.9375rem]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-2.5"
            >
              <dt className="text-sm text-muted-foreground lowercase">
                {label}
              </dt>
              <dd
                className={cn(
                  "wrap-break-word",
                  label === "Notes" && "line-clamp-5 whitespace-pre-wrap",
                  !value && "text-muted-foreground"
                )}
              >
                {value || "Not set yet"}
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 py-2.5">
            <dt className="text-sm text-muted-foreground lowercase">To</dt>
            <dd>Rutwik Shinde, Pune</dd>
          </div>
        </dl>

        <p
          className={cn(
            "mt-4 text-sm",
            isReady ? "text-brand-strong" : "text-muted-foreground"
          )}
        >
          {isReady ? "Ready to send." : "Filling in…"}
        </p>
      </div>
    </div>
  )
}
