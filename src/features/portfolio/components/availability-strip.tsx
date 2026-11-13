import Link from "next/link"

/**
 * Who Rutwik works with, in one line under the hero. It sits below the first
 * screen rather than over the header, so the hero starts at the top.
 */
export function AvailabilityStrip() {
  return (
    <div className="border-y border-rule bg-paper-2">
      <p className="page-container flex h-12 items-center justify-center text-sm text-muted-foreground">
        <Link
          href="#contact"
          className="underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
        >
          Open to freelance
          <span className="max-sm:hidden"> projects, contracts</span> and
          full-time work
        </Link>
      </p>
    </div>
  )
}
