import { cn } from "@/lib/utils"

/**
 * A terminal prompt (`>_`) in a rounded tile. The underscore is the brand
 * accent; pass `blink` to make it behave like a cursor.
 */
export function RutwikMark({
  className,
  blink = false,
  ...props
}: React.ComponentProps<"svg"> & { blink?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-7", className)}
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9.5 10.5 15 16l-5.5 5.5"
        stroke="var(--background)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={cn(blink && "animate-cursor-blink")}
        d="M17.5 21.5h6"
        stroke="var(--brand)"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function RutwikLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <RutwikMark />
      <span className="font-mono text-[0.9375rem] font-medium">
        <span className="text-muted-foreground">~/</span>rutwik
      </span>
    </span>
  )
}

/** Static SVG source for the favicon and OG image. */
export function getMarkSVG({
  background = "#0c0a09",
  foreground = "#fdfcfb",
  accent = "#f97316",
} = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="${background}"/><path d="M9.5 10.5 15 16l-5.5 5.5" stroke="${foreground}" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 21.5h6" stroke="${accent}" stroke-width="2.75" stroke-linecap="round"/></svg>`
}
