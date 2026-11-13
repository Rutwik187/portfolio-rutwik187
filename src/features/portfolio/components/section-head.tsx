import { cn } from "@/lib/utils"

/**
 * A section's head block: a lowercase serif head on the left, its one line
 * on the right, baselines aligned. The words stay in sentence case in the
 * source, so screen readers and search see the real casing.
 */
export function SectionHead({
  id,
  href,
  title,
  line,
  className,
}: {
  id: string
  /** The section's own anchor, so the head links to itself. */
  href: `#${string}`
  title: React.ReactNode
  line?: React.ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "mb-12 grid gap-y-5 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-x-(--gap-columns)",
        className
      )}
    >
      <h2
        id={id}
        className="font-display text-display-s tracking-display lowercase lg:col-span-6"
      >
        <a href={href} className="underline-offset-[0.12em] hover:underline">
          {title}
        </a>
      </h2>
      {line && (
        <p className="max-w-[44ch] text-lead text-muted-foreground lg:col-span-5 lg:col-start-8">
          {line}
        </p>
      )}
    </header>
  )
}
