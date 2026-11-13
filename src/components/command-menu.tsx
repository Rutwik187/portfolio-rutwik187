"use client"

import React, { useCallback, useState } from "react"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodeEmail } from "@/utils/string"
import { useRouter } from "@bprogress/next/app"
import { useTiks } from "@rexa-developer/tiks/react"
import { useSetAtom } from "jotai"
import {
  BriefcaseBusinessIcon,
  CoffeeIcon,
  CopyIcon,
  CornerDownLeftIcon,
  DownloadIcon,
  FileTextIcon,
  Gamepad2Icon,
  GraduationCapIcon,
  HandshakeIcon,
  HouseIcon,
  LayersIcon,
  MonitorIcon,
  MoonStarIcon,
  PartyPopperIcon,
  SendIcon,
  SparklesIcon,
  SunMediumIcon,
  TextInitialIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { fireConfetti } from "@/lib/confetti"
import { trackEvent } from "@/lib/events"
import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import { useMutationObserver } from "@/hooks/use-mutation-observer"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { toast } from "@/components/ui/toast"
import { hireDialogOpenAtom } from "@/features/portfolio/components/hire/hire-state"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { SearchIcon } from "./icons"
import { RutwikMark } from "./rutwik-mark"
import { Button } from "./ui/button"
import { Kbd, KbdGroup } from "./ui/kbd"

type CommandKind = "command" | "page" | "link"

type CommandLinkItem = {
  title: string
  href: string
  kind: CommandKind
  icon: React.ReactElement
  shortcut?: string
  keywords?: string[]
  openInNewTab?: boolean
}

const PAGE_LINKS: CommandLinkItem[] = [
  {
    title: "Home",
    href: "/",
    kind: "page",
    icon: <HouseIcon />,
    shortcut: "GH",
  },
  {
    title: "Play Snake",
    href: "/play",
    kind: "page",
    icon: <Gamepad2Icon />,
    shortcut: "GP",
    keywords: ["game", "fun"],
  },
]

const SECTION_LINKS: CommandLinkItem[] = [
  {
    title: "About",
    href: "/#about",
    kind: "page",
    icon: <TextInitialIcon />,
  },
  {
    title: "Selected work",
    href: "/#work",
    kind: "page",
    icon: <SparklesIcon />,
    keywords: ["portfolio", "projects", "clients", "apps", "rag"],
  },
  {
    title: "Experience",
    href: "/#experience",
    kind: "page",
    icon: <BriefcaseBusinessIcon />,
    keywords: ["work", "jobs"],
  },
  {
    title: "Stack",
    href: "/#stack",
    kind: "page",
    icon: <LayersIcon />,
    keywords: ["skills", "tech"],
  },
  {
    title: "Education",
    href: "/#education",
    kind: "page",
    icon: <GraduationCapIcon />,
  },
  {
    title: "Contact",
    href: "/#contact",
    kind: "page",
    icon: <HandshakeIcon />,
    keywords: ["hire", "freelance", "email"],
  },
]

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  kind: "link",
  icon: SOCIAL_ICONS[item.name],
  openInNewTab: true,
}))

const OTHER_LINK_ITEMS: CommandLinkItem[] = [
  {
    title: "Download vCard",
    href: "/vcard",
    kind: "command",
    icon: <DownloadIcon />,
    keywords: ["contact"],
  },
  {
    title: "llms.txt",
    href: "/llms.txt",
    kind: "link",
    icon: <FileTextIcon />,
    openInNewTab: true,
    keywords: ["ai", "markdown"],
  },
]

const CHAI_LINES = [
  "Kettle on. Adrak, elaichi, extra sugar.",
  "One cutting chai, coming right up.",
  "Chai brewed. Productivity +10.",
  "Chai is not a drink. It is a deployment strategy.",
]

export function CommandMenu({
  enabledHotkeys = false,
}: {
  enabledHotkeys?: boolean
}) {
  const router = useRouter()

  const { setTheme } = useTheme()

  const [open, setOpen] = useState(false)

  const [selectedCommandKind, setSelectedCommandKind] =
    useState<CommandKind | null>(null)

  const [click] = useClickSound()

  const { success: tiksSuccess } = useTiks()

  const setHireOpen = useSetAtom(hireDialogOpenAtom)

  useHotkeys(
    "mod+k, slash",
    (e) => {
      e.preventDefault()

      setOpen((open) => {
        if (!open) {
          trackEvent({
            name: "open_command_menu",
            properties: {
              method: "keyboard",
              key: e.key === "/" ? "/" : e.metaKey ? "cmd+k" : "ctrl+k",
            },
          })
        }
        return !open
      })
    },
    { enabled: enabledHotkeys }
  )

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false)

      trackEvent({
        name: "command_menu_action",
        properties: {
          action: "navigate",
          href: href,
          open_in_new_tab: openInNewTab,
        },
      })

      if (openInNewTab) {
        window.open(href, "_blank", "noopener")
      } else {
        // Typed routes cannot see the anchors inside the home page.
        router.push(href as Parameters<typeof router.push>[0])
      }
    },
    [router]
  )

  const handleCopyEmail = useCallback(() => {
    setOpen(false)
    copyToClipboardWithEvent(decodeEmail(USER.emailB64), {
      name: "copy_email",
      properties: {
        method: "command_menu",
      },
    })
    toast.add({ type: "success", title: "Email copied" })
    tiksSuccess()
  }, [tiksSuccess])

  const createThemeHandler = useCallback(
    (theme: "light" | "dark" | "system") => () => {
      click()
      setOpen(false)

      trackEvent({
        name: "command_menu_action",
        properties: {
          action: "change_theme",
          theme: theme,
        },
      })

      setTheme(theme)
    },
    [click, setTheme]
  )

  const handleStartBrief = useCallback(() => {
    setOpen(false)
    trackEvent({
      name: "open_hire_brief",
      properties: { source: "command_menu" },
    })
    setHireOpen(true)
  }, [setHireOpen])

  const handleBrewChai = useCallback(() => {
    setOpen(false)
    trackEvent({
      name: "command_menu_action",
      properties: { action: "brew_chai" },
    })
    toast.add({
      type: "success",
      title: CHAI_LINES[Math.floor(Math.random() * CHAI_LINES.length)],
    })
  }, [])

  const handleCelebrate = useCallback(() => {
    setOpen(false)
    trackEvent({
      name: "command_menu_action",
      properties: { action: "celebrate" },
    })
    fireConfetti()
  }, [])

  const handleLinkHighlight = useCallback((link: CommandLinkItem) => {
    setSelectedCommandKind(link.kind)
  }, [])

  const handleCommandHighlight = useCallback(() => {
    setSelectedCommandKind("command")
  }, [])

  return (
    <>
      <CommandMenuTrigger
        onClick={() => {
          setOpen(true)
          trackEvent({
            name: "open_command_menu",
            properties: {
              method: "click",
            },
          })
        }}
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />

        <div className="rounded-xl bg-background ring-1 ring-border">
          <CommandList className="min-h-80 scroll-fade">
            <CommandEmpty>No results. Maybe try “chai”?</CommandEmpty>

            <CommandLinkGroup
              heading="Pages"
              links={PAGE_LINKS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            <CommandLinkGroup
              heading="Sections"
              links={SECTION_LINKS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            <CommandGroup heading="Contact">
              <CommandMenuItem
                keywords={["hire", "freelance", "project", "brief", "job"]}
                onHighlight={handleCommandHighlight}
                onSelect={handleStartBrief}
              >
                <SendIcon />
                Start a project brief
              </CommandMenuItem>
              <CommandMenuItem
                keywords={["mail", "hire"]}
                onHighlight={handleCommandHighlight}
                onSelect={handleCopyEmail}
              >
                <CopyIcon />
                Copy email address
              </CommandMenuItem>
            </CommandGroup>

            <CommandLinkGroup
              heading="Social links"
              links={SOCIAL_LINK_ITEMS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />

            <CommandGroup heading="Just for fun">
              <CommandMenuItem
                keywords={["tea", "coffee", "break"]}
                onHighlight={handleCommandHighlight}
                onSelect={handleBrewChai}
              >
                <CoffeeIcon />
                Brew a chai
              </CommandMenuItem>
              <CommandMenuItem
                keywords={["confetti", "party"]}
                onHighlight={handleCommandHighlight}
                onSelect={handleCelebrate}
              >
                <PartyPopperIcon />
                Celebrate
              </CommandMenuItem>
            </CommandGroup>

            <CommandGroup heading="Theme">
              <CommandMenuItem
                keywords={["theme"]}
                onHighlight={handleCommandHighlight}
                onSelect={createThemeHandler("light")}
              >
                <SunMediumIcon />
                Light
              </CommandMenuItem>
              <CommandMenuItem
                keywords={["theme"]}
                onHighlight={handleCommandHighlight}
                onSelect={createThemeHandler("dark")}
              >
                <MoonStarIcon />
                Dark
              </CommandMenuItem>
              <CommandMenuItem
                keywords={["theme"]}
                onHighlight={handleCommandHighlight}
                onSelect={createThemeHandler("system")}
              >
                <MonitorIcon />
                System
              </CommandMenuItem>
            </CommandGroup>

            <CommandLinkGroup
              heading="Other"
              links={OTHER_LINK_ITEMS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />
          </CommandList>
        </div>

        <CommandMenuFooter selectedCommandKind={selectedCommandKind} />
      </CommandDialog>
    </>
  )
}

export default CommandMenu

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="gap-1.5 border-none px-1.5 text-muted-foreground will-change-[scale] select-none"
      variant="ghost"
      size="sm"
      {...props}
    >
      <SearchIcon />

      <span className="font-sans text-sm/4 font-medium sm:sr-only">
        Search…
      </span>

      {/* Tablets rarely have a keyboard, and the header has no room for the
      hint until md. */}
      <KbdGroup className="hidden gap-0.75 md:in-[.os-macos_&]:flex">
        <Kbd className="w-5 min-w-auto">⌘</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>

      <KbdGroup className="hidden gap-0.75 md:not-[.os-macos_&]:flex">
        <Kbd>Ctrl</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>
    </Button>
  )
}

function CommandMenuItem({
  children,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.()
      }
    })
  })

  return (
    <CommandItem ref={ref} {...props}>
      {children}
    </CommandItem>
  )
}

function CommandLinkGroup({
  heading,
  links,
  onLinkHighlight,
  onLinkSelect,
}: {
  heading: string
  links: CommandLinkItem[]
  onLinkHighlight: (link: CommandLinkItem) => void
  onLinkSelect: (href: string, openInNewTab?: boolean) => void
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => (
        <CommandMenuItem
          key={link.href}
          keywords={link.keywords}
          onHighlight={() => onLinkHighlight(link)}
          onSelect={() => onLinkSelect(link.href, link.openInNewTab)}
        >
          {link.icon}

          <p className="line-clamp-1">{link.title}</p>

          {link.shortcut && (
            <CommandShortcut className="font-mono tracking-[0.2em] max-sm:hidden">
              {link.shortcut}
            </CommandShortcut>
          )}
        </CommandMenuItem>
      ))}
    </CommandGroup>
  )
}

const ENTER_ACTION_LABELS: Record<CommandKind, string> = {
  command: "Run command",
  page: "Go to page",
  link: "Open link",
}

function CommandMenuFooter({
  selectedCommandKind,
}: {
  selectedCommandKind: CommandKind | null
}) {
  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between gap-2 rounded-b-2xl px-4 text-xs font-medium">
        <RutwikMark className="size-5 text-muted-foreground" />

        <div className="flex items-center gap-2 max-sm:hidden">
          <span>{ENTER_ACTION_LABELS[selectedCommandKind ?? "page"]}</span>
          <Kbd>
            <CornerDownLeftIcon />
          </Kbd>
        </div>
      </div>
    </>
  )
}
