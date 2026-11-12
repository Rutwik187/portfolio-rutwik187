"use client"

import { WORK } from "../data/work"
import { useOpenWork } from "./work/use-open-work"

/** Clients in my home city get no place label; it would repeat on most names. */
const HOME_CITY = "Pune"

/** The clients behind the selected work. Each name opens its project. */
export function ShippedFor() {
  const openWork = useOpenWork()

  return (
    <section className="px-4 pt-16 sm:pt-20" aria-labelledby="shipped-for">
      <h2
        id="shipped-for"
        className="font-mono text-xs tracking-widest text-muted-foreground uppercase"
      >
        Shipped for
      </h2>

      <ul className="mt-4 flex flex-wrap items-baseline gap-x-8 gap-y-3">
        {WORK.map((work) => {
          const [name, place] = work.client
            .split(",")
            .map((part) => part.trim())

          return (
            <li key={work.id}>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`${work.client}: open ${work.title}`}
                className="text-lg font-semibold tracking-tight text-muted-foreground transition-colors duration-200 hover:text-foreground"
                onClick={() => openWork(work.id, "shipped_for")}
              >
                {name}
                {place && place !== HOME_CITY && (
                  <span className="ml-1.5 rounded-sm bg-brand/12 px-1 py-px align-middle font-mono text-[0.6875rem] font-medium tracking-wider text-brand-strong">
                    {place}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
