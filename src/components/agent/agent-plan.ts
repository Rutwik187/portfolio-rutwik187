/**
 * The on-device agent's planner. It turns a visitor's question into an intent,
 * a list of steps to act out on the page, and an answer. It is a keyword
 * router, not a language model: no network call, and every fact in an answer
 * comes from the catalog, which is built from the real portfolio data.
 */

export type AgentCatalog = {
  work: {
    id: string
    title: string
    client: string
    kind: string
    year: string
    summary: string
    stack: string[]
  }[]
  tech: { key: string; title: string }[]
  currentRole: { title: string; company: string }
  roleCount: number
  firstYear: string
}

export type AgentStep =
  | { kind: "scroll"; target: string; label: string }
  | { kind: "point"; target: string; label: string }
  | { kind: "click"; target: string; label: string }
  | { kind: "xray"; label: string }
  | { kind: "theme"; label: string }
  | { kind: "navigate"; href: "/play"; label: string }

export type AgentPlan = {
  /** Shown in the trace, like a function call: `open_project("disha")`. */
  intent: string
  steps: AgentStep[]
  answer: string
  /** Questions to offer next. The on-device planner leaves this out. */
  followUps?: string[]
}

/** One earlier turn of the chat, sent so follow-up questions make sense. */
export type AgentTurn = { role: "user" | "assistant"; text: string }

/** CSS selectors for the elements the agent can act on. */
export const AGENT_TARGET = {
  section: (id: string) => `#${id}`,
  work: (id: string) => `[data-agent="work-${id}"]`,
  tech: (key: string) => `[data-agent="tech-${key}"]`,
  hire: `[data-agent="hire"]`,
}

const WORDS = {
  hire: [
    "hire",
    "hiring",
    "available",
    "availability",
    "freelance",
    "freelancer",
    "contract",
    "contractor",
    "rate",
    "rates",
    "cost",
    "price",
    "pricing",
    "budget",
    "contact",
    "email",
    "reach",
    "talk",
    "call",
    "work with",
    "work together",
    "project brief",
  ],
  code: [
    "code",
    "source",
    "xray",
    "x-ray",
    "how is this built",
    "how was this built",
    "how is this made",
    "how was this made",
  ],
  AI: ["ai", "agent", "agents", "llm", "llms", "rag", "gpt", "chatbot", "ml"],
  Mobile: ["mobile", "app", "apps", "android", "ios", "iphone"],
  Web: [
    "web",
    "website",
    "websites",
    "booking",
    "ecommerce",
    "e-commerce",
    "store",
    "storefront",
    "dashboard",
  ],
  work: ["work", "projects", "project", "portfolio", "shipped", "built"],
  experience: [
    "experience",
    "years",
    "career",
    "worked",
    "companies",
    "company",
    "jobs",
    "job history",
    "resume",
    "cv",
    "background",
    "roles",
  ],
  education: [
    "education",
    "degree",
    "college",
    "university",
    "studied",
    "cgpa",
  ],
  theme: ["theme", "dark", "light", "mode"],
  play: ["game", "games", "snake", "play", "bored", "fun"],
  about: ["who", "about", "introduce", "yourself", "bio", "rutwik"],
}

const KINDS = ["AI", "Mobile", "Web"] as const

export function planFor(question: string, catalog: AgentCatalog): AgentPlan {
  const query = normalize(question)
  const has = (words: string[]) => matchesAny(query, words)

  const project = catalog.work.find((work) =>
    matchesAny(query, projectAliases(work))
  )
  if (project) return openProject(project)

  const tech = catalog.tech.find((item) => matchesAny(query, techAliases(item)))
  if (tech) return checkSkill(tech, catalog)

  if (has(WORDS.hire)) return startBrief()
  if (has(WORDS.code)) return showCode()

  const kinds = KINDS.filter((kind) => has(WORDS[kind]))
  if (kinds.length > 0) return showWorkOfKinds(kinds, catalog)
  if (has(WORDS.work)) return showAllWork(catalog)

  if (has(WORDS.experience)) return showExperience(catalog)
  if (has(WORDS.education)) {
    return {
      intent: "show_section(education)",
      steps: [scrollTo("education", "Education")],
      answer: "Here is where he studied, and what he built along the way.",
    }
  }
  if (has(WORDS.theme)) {
    return {
      intent: "toggle_theme()",
      steps: [{ kind: "theme", label: "Switch the theme" }],
      answer: "Done. Ask again to switch it back.",
    }
  }
  if (has(WORDS.play)) {
    return {
      intent: "navigate(/play)",
      steps: [{ kind: "navigate", href: "/play", label: "Open snake.exe" }],
      answer: "Opening Snake. It eats squares on a contribution graph.",
    }
  }
  if (has(WORDS.about)) {
    return {
      intent: "show_section(about)",
      steps: [scrollTo("about", "About")],
      answer: `Rutwik is a full stack developer from Pune. He is ${article(catalog.currentRole.title)} ${catalog.currentRole.title} at ${catalog.currentRole.company}.`,
    }
  }

  return {
    intent: "unknown()",
    steps: [],
    answer:
      "I can open a project, check a skill, show his AI or mobile work, start a hire brief, or show the code behind this page. Try “show me AI work”.",
  }
}

function openProject(work: AgentCatalog["work"][number]): AgentPlan {
  return {
    intent: `open_project("${work.id}")`,
    steps: [
      scrollTo("work", "Selected work"),
      {
        kind: "click",
        target: AGENT_TARGET.work(work.id),
        label: `Open ${work.title}`,
      },
    ],
    answer: `${work.title}, for ${work.client.split(",")[0]} (${work.year}). ${work.summary}.`,
  }
}

function checkSkill(
  tech: AgentCatalog["tech"][number],
  catalog: AgentCatalog
): AgentPlan {
  const name = tech.title.toLowerCase()
  const shippedIn = catalog.work.filter((work) =>
    work.stack.some((item) => item.toLowerCase().startsWith(name))
  )

  const steps: AgentStep[] = [
    scrollTo("stack", "Stack"),
    {
      kind: "point",
      target: AGENT_TARGET.tech(tech.key),
      label: `Find ${tech.title}`,
    },
  ]
  if (shippedIn.length > 0) {
    steps.push(scrollTo("work", "Selected work"), {
      kind: "point",
      target: AGENT_TARGET.work(shippedIn[0].id),
      label: `Show ${shippedIn[0].title}`,
    })
  }

  return {
    intent: `check_skill("${tech.key}")`,
    steps,
    answer:
      shippedIn.length > 0
        ? `Yes. ${tech.title} is in his stack, and he shipped it in ${list(shippedIn.map((work) => work.title))}.`
        : `Yes. ${tech.title} is in his stack.`,
  }
}

function startBrief(): AgentPlan {
  return {
    intent: "start_brief()",
    steps: [
      scrollTo("contact", "Let's work together"),
      {
        kind: "click",
        target: AGENT_TARGET.hire,
        label: "Open the project brief",
      },
    ],
    answer:
      "He is open to freelance projects, contracts and full-time roles. I opened the project brief: your name, your email and a few lines, and it goes straight to his inbox.",
  }
}

function showCode(): AgentPlan {
  return {
    intent: "xray(view: full)",
    steps: [{ kind: "xray", label: "Turn on X-ray" }],
    answer:
      "This is the real source of every section, read from the repo when the site was built. Press Esc to see the page again.",
  }
}

function showWorkOfKinds(
  kinds: readonly string[],
  catalog: AgentCatalog
): AgentPlan {
  const matches = catalog.work.filter((work) => kinds.includes(work.kind))
  const [first] = matches

  return {
    intent: `filter_work(kind: ${kinds.map((kind) => `"${kind}"`).join(" | ")})`,
    steps: [
      scrollTo("work", "Selected work"),
      ...matches.map(
        (work): AgentStep => ({
          kind: "point",
          target: AGENT_TARGET.work(work.id),
          label: `Find ${work.title}`,
        })
      ),
      {
        kind: "click",
        target: AGENT_TARGET.work(first.id),
        label: `Open ${first.title}`,
      },
    ],
    answer: `${matches.length} ${list([...kinds])} ${matches.length === 1 ? "project" : "projects"}: ${list(matches.map((work) => work.title))}. Opening ${first.title}.`,
  }
}

function showAllWork(catalog: AgentCatalog): AgentPlan {
  const [first] = catalog.work
  return {
    intent: "list_work()",
    steps: [
      scrollTo("work", "Selected work"),
      {
        kind: "click",
        target: AGENT_TARGET.work(first.id),
        label: `Open ${first.title}`,
      },
    ],
    answer: `${catalog.work.length} client products, all shipped. Opening the first: ${first.title}.`,
  }
}

function showExperience(catalog: AgentCatalog): AgentPlan {
  return {
    intent: "show_section(experience)",
    steps: [scrollTo("experience", "Experience")],
    answer: `${catalog.roleCount} roles since ${catalog.firstYear}. Today he is ${article(catalog.currentRole.title)} ${catalog.currentRole.title} at ${catalog.currentRole.company}.`,
  }
}

function scrollTo(id: string, title: string): AgentStep {
  return {
    kind: "scroll",
    target: AGENT_TARGET.section(id),
    label: `Scroll to ${title}`,
  }
}

function projectAliases(work: AgentCatalog["work"][number]) {
  const title = work.title.toLowerCase()
  const client = work.client.split(",")[0].toLowerCase()
  // A first word only counts if it is distinctive, so "high" alone does not
  // open High Octane.
  const firstWords = [title, client]
    .map((name) => name.split(" ")[0])
    .filter((word) => word.length >= 5)
  return [title, client, ...firstWords]
}

function techAliases(item: AgentCatalog["tech"][number]) {
  const title = item.title.toLowerCase()
  return [title, item.key, title.replace(/[^a-z0-9+]/g, "")]
}

function normalize(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/[^a-z0-9.+#/\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `
}

/** Whole words only: "ai" must not match inside "available". */
function matchesAny(query: string, words: string[]) {
  return words.some((word) => query.includes(` ${word} `))
}

function list(items: string[]) {
  if (items.length <= 1) return items.join("")
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
}

function article(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a"
}
