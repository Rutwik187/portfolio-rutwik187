"use client"

import { useAtomValue, useSetAtom } from "jotai"

import { cn } from "@/lib/utils"

import {
  FORM_SHOWN_SECONDS,
  HERO_FORMS,
  heroFieldAtom,
  heroFieldRequestAtom,
} from "./hero-field-state"

/**
 * The three things Rutwik builds, as a numbered index. While the field is
 * live, the form on show is marked and a bar runs under it; picking another
 * breaks the current form up and builds that one.
 */
export function HeroFieldIndex({ className }: { className?: string }) {
  const field = useAtomValue(heroFieldAtom)
  const setRequest = useSetAtom(heroFieldRequestAtom)

  return (
    <div
      role="group"
      aria-label="What I build"
      className={cn(
        "flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.8125rem] lowercase",
        className
      )}
    >
      {HERO_FORMS.map((item, index) => {
        const isActive = field.live && field.form === index
        const isRunning =
          isActive && (field.phase === "assemble" || field.phase === "hold")
        const content = (
          <>
            <span
              className={cn(
                "tabular-nums transition-colors",
                isActive ? "text-brand-strong" : "text-muted-foreground/70"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.label}</span>
            <span
              className="absolute inset-x-0 -bottom-1.5 h-px overflow-hidden bg-rule"
              aria-hidden
            >
              {isRunning && (
                <span
                  key={field.cycle}
                  className="block h-full origin-left animate-field-progress bg-brand motion-reduce:hidden"
                  style={{ animationDuration: `${FORM_SHOWN_SECONDS}s` }}
                />
              )}
            </span>
          </>
        )

        const itemClassName = cn(
          "relative flex items-baseline gap-2 lowercase transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground"
        )

        return field.live ? (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            className={cn(
              itemClassName,
              "extend-touch-target cursor-pointer outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            )}
            onClick={() => setRequest({ form: index, at: Date.now() })}
          >
            {content}
          </button>
        ) : (
          <span key={item.id} className={itemClassName}>
            {content}
          </span>
        )
      })}
    </div>
  )
}
