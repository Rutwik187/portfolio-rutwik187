import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { USER } from "../data/user"

/**
 * The page at a glance, under the hero: that Rutwik is open to work, and
 * three facts a visitor would otherwise dig for. The numbers live in the
 * user data, so the page, the agent and llms.txt all say the same thing.
 */
export function AvailabilityStrip() {
  const facts = [
    { label: "Clients served", value: USER.clientCount },
    { label: "Building since", value: String(USER.buildingSince) },
    { label: "India, UTC+5:30", value: "Pune" },
  ]

  return (
    <section
      aria-label="At a glance"
      className="border-y border-rule bg-paper-2"
    >
      <dl className="page-container grid grid-cols-3 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
        <div className="col-span-3 flex flex-col justify-center gap-1.5 border-b border-rule py-6 lg:col-span-1 lg:border-b-0 lg:py-7 lg:pr-8">
          <dt className="flex items-center gap-2 text-sm text-muted-foreground lowercase">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden />
            Available now
          </dt>
          <dd>
            <Link
              href="#contact"
              className="group/available text-[0.9375rem] text-foreground underline-offset-4 hover:underline"
            >
              Freelance, contract and full-time roles
              <ArrowRightIcon
                className="ml-1.5 inline-block size-4 align-[-0.2em] text-brand-strong transition-transform duration-150 group-hover/available:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </dd>
        </div>

        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={cn(
              "flex flex-col gap-1.5 border-rule py-6 lg:justify-center lg:border-l lg:px-8 lg:py-7",
              index > 0 && "border-l pl-4"
            )}
          >
            <dt className="text-sm text-muted-foreground lowercase">
              {fact.label}
            </dt>
            <dd className="order-first font-display text-[2.25rem] leading-none tracking-display">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
