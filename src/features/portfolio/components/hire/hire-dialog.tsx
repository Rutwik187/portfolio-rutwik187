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
              <DialogTitle className="text-2xl font-semibold tracking-tight">
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

/** A printed receipt that mirrors the brief as it is filled in. */
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
    ["FROM", [brief.name, brief.company].filter(Boolean).join(", ") || "—"],
    ["NEED", brief.needs.join(", ") || "—"],
    ["TYPE", brief.engagement],
    ["WHEN", brief.timeline],
  ]

  return (
    <div className="flex items-start justify-center border-line bg-muted/50 dot-grid p-5 max-md:border-t sm:p-6 md:border-l">
      {/* The mask clips box shadows, so the shadow lives on a wrapper. */}
      <div className="w-full max-w-xs -rotate-1 drop-shadow-[0_10px_18px_rgb(28_25_23/0.14)]">
        <div
          className="bg-[#fffdf8] px-5 pt-5 pb-8 font-mono text-xs/relaxed text-zinc-800 dark:bg-zinc-200"
          // A torn, zig-zag bottom edge like a till receipt.
          style={{ mask: RECEIPT_EDGE_MASK, WebkitMask: RECEIPT_EDGE_MASK }}
          aria-live="polite"
          aria-label="Brief preview"
        >
          <div className="flex justify-between">
            <span className="font-semibold">PROJECT BRIEF</span>
            <span>{date}</span>
          </div>
          <Dashes />
          <dl className="space-y-1">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[3.5rem_1fr] gap-2">
                <dt className="text-zinc-500">{label}</dt>
                <dd className="wrap-break-word">{value}</dd>
              </div>
            ))}
          </dl>
          <Dashes />
          <p className="text-zinc-500">NOTES</p>
          <p className="line-clamp-5 min-h-10 whitespace-pre-wrap">
            {brief.notes.trim() || "—"}
          </p>
          <Dashes />
          <div className="grid grid-cols-[3.5rem_1fr] gap-2">
            <span className="text-zinc-500">TO</span>
            <span>Rutwik Shinde, Pune</span>
            <span className="text-zinc-500">STATUS</span>
            <span className={cn(isReady && "font-semibold text-orange-700")}>
              {isReady ? "ready to send ✓" : "filling in…"}
            </span>
          </div>
          <p className="mt-4 text-center font-handwritten text-base text-zinc-500">
            thank you, come again
          </p>
        </div>
      </div>
    </div>
  )
}

const RECEIPT_EDGE_MASK =
  "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 12px 100%"

function Dashes() {
  return (
    <div
      className="my-2.5 h-px bg-[linear-gradient(to_right,currentColor_50%,transparent_0)] bg-size-[6px_1px] text-zinc-400"
      aria-hidden
    />
  )
}
