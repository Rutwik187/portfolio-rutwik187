"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { decodeEmail } from "@/utils/string"
import { useRouter } from "@bprogress/next/app"
import { useSetAtom } from "jotai"
import { useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"

import { fireConfetti } from "@/lib/confetti"
import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { hireDialogOpenAtom } from "@/features/portfolio/components/hire/hire-state"
import { workDialogAtom } from "@/features/portfolio/components/work/work-state"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { USER } from "@/features/portfolio/data/user"
import { WORK } from "@/features/portfolio/data/work"

type Line = {
  id: number
  kind: "input" | "output"
  content: React.ReactNode
}

type CommandContext = {
  args: string[]
  clear: () => void
  setTheme: (theme: string) => void
  resolvedTheme: string | undefined
  navigate: (href: "/play") => void
  openHire: () => void
  openWork: (id: string) => void
}

type Command = {
  description?: string
  /** Hidden commands still run, they just do not show up in `help`. */
  hidden?: boolean
  run: (ctx: CommandContext) => React.ReactNode
}

/** Folders `ls` and `cd` know about; each maps to a section id on the page. */
const SECTIONS = [
  "about",
  "work",
  "experience",
  "stack",
  "projects",
  "education",
  "contact",
]

const CHAI_LINES = [
  "One cutting chai, extra adrak. Productivity +10.",
  "Chai brewed. Bugs fear me now.",
  "Chai is not a drink. It is a deployment strategy.",
]

const PROMPT = "rutwik@pune:~$"

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-orange-400">{children}</span>
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-stone-400">{children}</span>
}

function ExternalLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="underline decoration-stone-500 underline-offset-2 hover:text-orange-300 hover:decoration-orange-300"
    >
      {children}
    </a>
  )
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

function puneTime() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: USER.timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date())
}

function puneHour() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: USER.timeZone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  )
}

const COMMANDS: Record<string, Command> = {
  help: {
    description: "list what this terminal can do",
    run: () => (
      <div className="grid grid-cols-[max-content_1fr] gap-x-4">
        {Object.entries(COMMANDS)
          .filter(([, command]) => !command.hidden)
          .map(([name, command]) => (
            <div key={name} className="contents">
              <Accent>{name}</Accent>
              <Muted>{command.description}</Muted>
            </div>
          ))}
        <span className="col-span-2 mt-1 text-stone-500">
          There are a few hidden ones too. Good luck.
        </span>
      </div>
    ),
  },
  whoami: {
    description: "the short version",
    run: () => (
      <span>
        {USER.displayName}. {USER.jobTitle} from <Accent>Pune, India</Accent>.
      </span>
    ),
  },
  about: {
    description: "the slightly longer version",
    run: () => (
      <span>
        {USER.bio} <Muted>Run `cd about` to read more.</Muted>
      </span>
    ),
  },
  skills: {
    description: "what I build with",
    run: () => {
      const groups = TECH_STACK.reduce<Record<string, string[]>>(
        (acc, item) => {
          for (const category of item.categories) {
            ;(acc[category] ??= []).push(item.title)
          }
          return acc
        },
        {}
      )

      return (
        <div className="grid grid-cols-[max-content_1fr] gap-x-4">
          {Object.entries(groups).map(([category, items]) => (
            <div key={category} className="contents">
              <Accent>{category.toLowerCase()}</Accent>
              <span>{items.join(", ")}</span>
            </div>
          ))}
        </div>
      )
    },
  },
  work: {
    description: "client work, with screenshots",
    run: ({ openWork }) => (
      <div className="space-y-0.5">
        {WORK.map((item) => (
          <div key={item.id}>
            <Accent>→</Accent>{" "}
            <button
              type="button"
              onClick={() => openWork(item.id)}
              className="underline decoration-stone-500 underline-offset-2 hover:text-orange-300 hover:decoration-orange-300"
            >
              {item.title}
            </button>{" "}
            <Muted>
              {item.kind}, {item.year}
            </Muted>
          </div>
        ))}
        <Muted>Click one to open it.</Muted>
      </div>
    ),
  },
  projects: {
    description: "the rest of what I shipped",
    run: () => (
      <div className="space-y-0.5">
        {PROJECTS.slice(0, 5).map((project) => (
          <div key={project.id}>
            <Accent>→</Accent>{" "}
            <ExternalLink href={project.link}>{project.title}</ExternalLink>
          </div>
        ))}
        <Muted>…and {PROJECTS.length - 5} more. Run `cd projects`.</Muted>
      </div>
    ),
  },
  experience: {
    description: "where I have worked",
    run: () => (
      <div className="space-y-0.5">
        {EXPERIENCES.map((experience) => {
          const position = experience.positions[0]
          const { start, end } = position.employmentPeriod
          return (
            <div key={experience.id}>
              <Muted>
                {start}–{end ?? "now"}
              </Muted>{" "}
              {position.title} <Accent>@</Accent> {experience.companyName}
            </div>
          )
        })}
      </div>
    ),
  },
  contact: {
    description: "say hi",
    run: () => {
      const email = decodeEmail(USER.emailB64)
      return (
        <div>
          <div>
            <Accent>email</Accent>{" "}
            <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>
          </div>
          {SOCIAL_LINKS.map((link) => (
            <div key={link.name}>
              <Accent>{link.title.toLowerCase()}</Accent>{" "}
              <ExternalLink href={link.href}>{link.handle}</ExternalLink>
            </div>
          ))}
        </div>
      )
    },
  },
  ls: {
    description: "list the sections of this page",
    run: () => (
      <div className="flex flex-wrap gap-x-4">
        {SECTIONS.map((section) => (
          <Accent key={section}>{section}/</Accent>
        ))}
        <span>snake.exe</span>
      </div>
    ),
  },
  cd: {
    description: "jump to a section, e.g. `cd work`",
    run: ({ args }) => {
      const target = (args[0] ?? "").replace(/\/$/, "")

      if (!target || target === "~" || target === "..") {
        window.scrollTo({ top: 0, behavior: "smooth" })
        return <Muted>Back to the top.</Muted>
      }

      if (SECTIONS.includes(target)) {
        scrollToSection(target)
        return <Muted>Jumping to {target}…</Muted>
      }

      return `cd: no such directory: ${target}`
    },
  },
  date: {
    description: "what time it is in Pune",
    run: () => {
      const hour = puneHour()
      const mood =
        hour < 6
          ? "I am probably asleep. Or debugging."
          : hour < 12
            ? "Morning chai, then code."
            : hour < 18
              ? "Peak shipping hours."
              : "Evening chai and side projects."
      return (
        <span>
          {puneTime()} in Pune. <Muted>{mood}</Muted>
        </span>
      )
    },
  },
  theme: {
    description: "toggle light and dark mode",
    run: ({ args, setTheme, resolvedTheme }) => {
      const next =
        args[0] === "light" || args[0] === "dark"
          ? args[0]
          : resolvedTheme === "dark"
            ? "light"
            : "dark"
      setTheme(next)
      return <Muted>Switched to {next} mode.</Muted>
    },
  },
  snake: {
    description: "play a game, you deserve a break",
    run: ({ navigate }) => {
      navigate("/play")
      return <Muted>Loading snake.exe…</Muted>
    },
  },
  chai: {
    description: "brew some chai",
    run: () => (
      <div>
        <pre className="leading-tight text-orange-300" aria-hidden>
          {"   ( (\n    ) )\n  .______.\n  |      |]\n  \\      /\n   `----'"}
        </pre>
        <span>{CHAI_LINES[Math.floor(Math.random() * CHAI_LINES.length)]}</span>
      </div>
    ),
  },
  hire: {
    description: "the best command",
    run: ({ openHire }) => {
      fireConfetti()
      setTimeout(openHire, 700)
      const email = decodeEmail(USER.emailB64)
      return (
        <span>
          Excellent choice. Opening a project brief… or write to{" "}
          <ExternalLink href={`mailto:${email}`}>{email}</ExternalLink>.
        </span>
      )
    },
  },
  clear: {
    description: "clear the screen",
    run: ({ clear }) => {
      clear()
      return null
    },
  },
  sudo: {
    hidden: true,
    run: (ctx) => {
      const { args } = ctx
      if (args.join(" ").startsWith("hire")) {
        return COMMANDS.hire.run(ctx)
      }
      return "visitor is not in the sudoers file. This incident will be reported to my mom."
    },
  },
  rm: {
    hidden: true,
    run: () => "Nice try. Production is not where we experiment.",
  },
  exit: {
    hidden: true,
    run: () => "There is no exit. Only `snake`.",
  },
  vim: {
    hidden: true,
    run: () => "You are now stuck in vim. Type `:q` to escape (it works here).",
  },
  ":q": {
    hidden: true,
    run: () => "Phew. You made it out.",
  },
  coffee: {
    hidden: true,
    run: () => "Error 418: I'm a teapot. This terminal only brews `chai`.",
  },
  namaskar: {
    hidden: true,
    run: () => (
      <span>
        <span lang="mr">नमस्कार!</span> Welcome to my corner of the internet.
      </span>
    ),
  },
  hello: {
    hidden: true,
    run: () => COMMANDS.namaskar.run({} as CommandContext),
  },
  hi: {
    hidden: true,
    run: () => COMMANDS.namaskar.run({} as CommandContext),
  },
  pwd: {
    hidden: true,
    run: () => "/home/rutwik/pune",
  },
  echo: {
    hidden: true,
    run: ({ args }) => args.join(" "),
  },
  git: {
    hidden: true,
    run: ({ args }) =>
      args[0] === "blame" ? "It was me. It is always me." : "Try `git blame`.",
  },
  npm: {
    hidden: true,
    run: () => "Installing 1,337 packages… just kidding. Nothing to install.",
  },
}

const COMMAND_NAMES = Object.keys(COMMANDS)

const INTRO_COMMAND = "whoami"

export function HeroTerminal({ className }: { className?: string }) {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const setHireOpen = useSetAtom(hireDialogOpenAtom)
  const setWorkDialog = useSetAtom(workDialogAtom)
  const shouldReduceMotion = useReducedMotion()

  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState("")
  const [isBooting, setIsBooting] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)

  const nextId = useRef(0)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pushLines = useCallback((...newLines: Omit<Line, "id">[]) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((line) => ({ ...line, id: nextId.current++ })),
    ])
  }, [])

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      const [name = "", ...args] = trimmed.split(/\s+/)
      const command = COMMANDS[name.toLowerCase()]

      pushLines({ kind: "input", content: trimmed })

      if (!trimmed) return

      trackEvent({
        name: "terminal_command",
        properties: { command: command ? name.toLowerCase() : "unknown" },
      })

      if (!command) {
        pushLines({
          kind: "output",
          content: (
            <span>
              command not found: {name}. Type <Accent>help</Accent> to see what
              works.
            </span>
          ),
        })
        return
      }

      const output = command.run({
        args,
        clear: () => setLines([]),
        setTheme,
        resolvedTheme,
        navigate: (href) => router.push(href),
        openHire: () => setHireOpen(true),
        openWork: (id) => setWorkDialog({ id, open: true }),
      })

      if (name.toLowerCase() === "clear") return

      if (output !== null && output !== undefined) {
        pushLines({ kind: "output", content: output })
      }
    },
    [pushLines, resolvedTheme, router, setTheme, setHireOpen, setWorkDialog]
  )

  // Boot sequence: type `whoami` like a person would, then hand over.
  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    pushLines({
      kind: "output",
      content: (
        <Muted>rutwik-os 1.0 (Pune edition). Chai level: optimal.</Muted>
      ),
    })

    const finish = () => {
      if (cancelled) return
      setInput("")
      runCommand(INTRO_COMMAND)
      pushLines({
        kind: "output",
        content: (
          <Muted>
            Type <Accent>help</Accent> and press Enter. Go on, it does not bite.
          </Muted>
        ),
      })
      setIsBooting(false)
    }

    if (shouldReduceMotion) {
      finish()
    } else {
      INTRO_COMMAND.split("").forEach((_, index) => {
        timers.push(
          setTimeout(
            () => {
              if (!cancelled) setInput(INTRO_COMMAND.slice(0, index + 1))
            },
            700 + index * 110
          )
        )
      })
      timers.push(setTimeout(finish, 700 + INTRO_COMMAND.length * 110 + 350))
    }

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      setLines([])
    }
    // Runs once on mount; the commands it calls are stable for the boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the newest line in view without scrolling the page itself.
  useEffect(() => {
    const el = outputRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isBooting) {
      e.preventDefault()
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      runCommand(input)
      if (input.trim()) setHistory((prev) => [...prev, input.trim()])
      setHistoryIndex(null)
      setInput("")
      return
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (history.length === 0) return
      e.preventDefault()
      const current = historyIndex ?? history.length
      const next =
        e.key === "ArrowUp"
          ? Math.max(0, current - 1)
          : Math.min(history.length, current + 1)
      setHistoryIndex(next === history.length ? null : next)
      setInput(history[next] ?? "")
      return
    }

    if (e.key === "Tab") {
      const partial = input.trim().toLowerCase()
      if (!partial || partial.includes(" ")) return
      const match = COMMAND_NAMES.find(
        (name) => name.startsWith(partial) && !COMMANDS[name].hidden
      )
      if (match) {
        e.preventDefault()
        setInput(match + " ")
      }
      return
    }

    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-stone-900 font-mono text-[0.8125rem]/relaxed text-stone-200 shadow-xl ring-1 shadow-stone-900/10 ring-stone-900/10 dark:bg-stone-900/70 dark:shadow-none dark:ring-white/10",
        className
      )}
      onClick={() => {
        // Do not steal a text selection the visitor is making.
        if (window.getSelection()?.toString()) return
        inputRef.current?.focus({ preventScroll: true })
      }}
    >
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-white/10 px-3.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-stone-600" />
          <span className="size-2.5 rounded-full bg-stone-600" />
          <span className="size-2.5 rounded-full bg-orange-400" />
        </div>
        <p className="flex-1 truncate text-center text-xs text-stone-400">
          rutwik@pune: ~
        </p>
        <span className="text-xs text-stone-500" aria-hidden>
          zsh
        </span>
      </div>

      <div
        ref={outputRef}
        className="no-scrollbar flex-1 space-y-1 overflow-y-auto overscroll-contain p-3.5"
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((line) =>
            line.kind === "input" ? (
              <p key={line.id} className="mt-1 wrap-break-word first:mt-0">
                <span className="text-orange-400" aria-hidden>
                  {PROMPT}
                </span>{" "}
                {line.content}
              </p>
            ) : (
              <div key={line.id} className="wrap-break-word">
                {line.content}
              </div>
            )
          )}
        </div>

        <label className="mt-1 flex items-center gap-2">
          <span className="shrink-0 text-orange-400" aria-hidden>
            {PROMPT}
          </span>
          <span className="sr-only">Terminal command</span>
          <span className="relative flex min-w-0 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                if (!isBooting) setInput(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              className="peer w-full min-w-0 bg-transparent text-stone-100 caret-transparent outline-none"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              readOnly={isBooting}
            />
            {/* A block cursor that follows the typed text. */}
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-pre"
              aria-hidden
            >
              <span className="invisible">{input}</span>
              <span className="h-[1.1em] w-[0.6em] animate-cursor-blink bg-orange-400/90" />
            </span>
          </span>
        </label>
      </div>
    </div>
  )
}
