import dynamic from "next/dynamic"
import Link from "next/link"

import { GITHUB_USERNAME, MAIN_NAV } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GitHubIcon } from "@/components/icons"
import { NavDesktop } from "@/components/nav-desktop"
import { RutwikLogo } from "@/components/rutwik-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { HireButton } from "@/features/portfolio/components/hire/hire-button"

import { ScrollProgress } from "./scroll-progress"

const CommandMenu = dynamic(() => import("@/components/command-menu"))

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip border-b border-line bg-background/85 px-2 backdrop-blur-md">
      <div className="mx-auto flex h-(--header-height) items-center gap-2 pr-2 pl-4 sm:gap-4 md:max-w-3xl lg:max-w-5xl">
        <Link href="/" aria-label="Home" className="shrink-0">
          <RutwikLogo />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <Separator
            orientation="vertical"
            className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <CommandMenu enabledHotkeys />
          <Separator
            orientation="vertical"
            className="mx-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="max-sm:hidden"
            nativeButton={false}
            render={
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener"
                aria-label="GitHub profile"
              >
                <GitHubIcon />
              </a>
            }
          />
          <Separator
            orientation="vertical"
            className="mx-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <ThemeToggle />
          <HireButton
            source="header"
            size="sm"
            className="ml-2 bg-brand text-brand-foreground hover:bg-brand/85"
          >
            Hire me
          </HireButton>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
