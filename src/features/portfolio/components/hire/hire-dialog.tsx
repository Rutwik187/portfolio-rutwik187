"use client"

import { useId, useMemo, useState } from "react"
import { decodeEmail } from "@/utils/string"
import { useAtom } from "jotai"
import { CheckIcon, LoaderIcon, SendIcon } from "lucide-react"

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
import { USER } from "@/features/portfolio/data/user"

import { BRIEF_KINDS, type BriefKind } from "./hire-brief"
import { hireDialogOpenAtom } from "./hire-state"

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent"; name: string; email: string }
  | { state: "error"; message: string }

/**
 * The project brief: a name, an email, what it is about and a few lines.
 * It goes straight to Rutwik's inbox through /api/brief, and a reply goes
 * back to the visitor's email.
 */
export function HireDialog() {
  const [open, setOpen] = useAtom(hireDialogOpenAtom)
  const [kind, setKind] = useState<BriefKind>(BRIEF_KINDS[0])
  const [status, setStatus] = useState<Status>({ state: "idle" })
  const ids = useId()
  const email = useMemo(() => decodeEmail(USER.emailB64), [])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    // A sent brief leaves the thanks in place until the dialog has closed.
    if (!next && status.state !== "sending") {
      setTimeout(() => setStatus({ state: "idle" }), 300)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const brief = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      kind,
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
    }

    setStatus({ state: "sending" })
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      })
      const result = (await response.json().catch(() => ({}))) as {
        error?: string
      }
      if (!response.ok) {
        throw new Error(result.error ?? "The brief could not be sent.")
      }

      trackEvent({ name: "send_hire_brief", properties: { kind } })
      fireConfetti()
      setStatus({
        state: "sent",
        name: brief.name.trim().split(/\s+/)[0],
        email: brief.email.trim(),
      })
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "The brief could not be sent.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] gap-0 overflow-y-auto p-6 sm:max-w-lg sm:p-8">
        {status.state === "sent" ? (
          <Sent name={status.name} email={status.email} />
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 pr-8">
              <DialogTitle className="font-display text-display-s tracking-display lowercase">
                Start a project brief
              </DialogTitle>
              <DialogDescription className="text-[0.9375rem] text-pretty">
                A few lines are enough. It comes straight to my inbox, and I
                reply by email.
              </DialogDescription>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor={`${ids}-name`}>
                <input
                  id={`${ids}-name`}
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Your email" htmlFor={`${ids}-email`}>
                <input
                  id={`${ids}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">It is about</legend>
              <div className="flex flex-wrap gap-2">
                {BRIEF_KINDS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={kind === option}
                    onClick={() => setKind(option)}
                    className={cn(
                      "h-9 rounded-full border px-3.5 text-sm transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.97]",
                      kind === option
                        ? "border-brand bg-brand/12 text-brand-strong"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label="A few lines about it" htmlFor={`${ids}-message`}>
              <textarea
                id={`${ids}-message`}
                name="message"
                required
                minLength={10}
                maxLength={3000}
                rows={5}
                placeholder="What are you building, who is it for, and when do you need it?"
                className={cn(INPUT_CLASS, "h-auto resize-none py-2.5")}
              />
            </Field>

            {/* Only bots see and fill this in. */}
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="sr-only"
              aria-hidden
            />

            <div className="space-y-3">
              <Button
                type="submit"
                variant="brand"
                size="lg"
                className="w-full"
                disabled={status.state === "sending"}
              >
                {status.state === "sending" ? (
                  <LoaderIcon
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                ) : (
                  <SendIcon data-icon="inline-start" />
                )}
                {status.state === "sending" ? "Sending…" : "Send brief"}
              </Button>

              <p
                className={cn(
                  "text-center text-sm",
                  status.state === "error"
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
                aria-live="polite"
              >
                {status.state === "error" && `${status.message} `}
                {status.state === "error" ? "Write to " : "Or write to "}
                <a
                  href={`mailto:${email}`}
                  className="text-foreground underline decoration-rule-2 underline-offset-4 hover:decoration-brand"
                >
                  {email}
                </a>
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-[0.9375rem] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 dark:bg-input/30"

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
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function Sent({ name, email }: { name: string; email: string }) {
  return (
    <div
      className="flex flex-col items-start gap-5 py-4 pr-8"
      aria-live="polite"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-brand-strong">
        <CheckIcon className="size-5" aria-hidden />
      </span>
      <div className="space-y-2">
        <DialogTitle className="font-display text-display-s tracking-display lowercase">
          Thanks, {name}
        </DialogTitle>
        <DialogDescription className="text-[0.9375rem] text-pretty">
          Your brief is in my inbox. I will reply to {email}.
        </DialogDescription>
      </div>
    </div>
  )
}
