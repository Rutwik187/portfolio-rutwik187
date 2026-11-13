import { TECH_STACK } from "../data/tech-stack"
import type { TechStack as TechStackType } from "../types/tech-stack"

const ID = "stack"

export function TechStack() {
  return (
    <section
      id={ID}
      aria-labelledby={`${ID}-title`}
      className="page-container grid gap-y-10 lg:grid-cols-12 lg:gap-x-(--gap-columns)"
    >
      <h2
        id={`${ID}-title`}
        className="font-display text-display-s tracking-display lowercase lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:col-span-4 lg:self-start"
      >
        <a
          href={`#${ID}`}
          className="underline-offset-[0.12em] hover:underline"
        >
          The tools behind the work
        </a>
      </h2>

      <dl className="lg:col-span-8">
        {Object.entries(groupByCategory(TECH_STACK)).map(
          ([category, items]) => {
            const categoryId = `${ID}-${category
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}`

            return (
              <div
                key={category}
                className="grid gap-y-3 border-t border-rule py-5 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-x-8"
              >
                <dt
                  id={categoryId}
                  className="font-display text-title tracking-display lowercase"
                >
                  {category}
                </dt>

                <dd>
                  <ul
                    aria-labelledby={categoryId}
                    className="flex flex-wrap gap-2"
                  >
                    {items.map((item) => (
                      <li key={item.key} className="flex">
                        <a
                          data-agent={`tech-${item.key}`}
                          href={item.href}
                          target="_blank"
                          rel="noopener"
                          className="flex h-8 items-center gap-1.5 rounded-full border border-rule-2 px-3 text-sm text-ink-2 transition-colors duration-150 hover:bg-paper-2 hover:text-foreground [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
                        >
                          {item.icon}
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )
          }
        )}
      </dl>
    </section>
  )
}

function groupByCategory(
  items: TechStackType[]
): Record<string, TechStackType[]> {
  return items.reduce<Record<string, TechStackType[]>>((acc, item) => {
    for (const category of item.categories) {
      ;(acc[category] ??= []).push(item)
    }
    return acc
  }, {})
}
