import dynamic from "next/dynamic"
import Link from "next/link"

import { GITHUB_USERNAME, MAIN_NAV } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GitHubIcon } from "@/components/icons"
import { NavDesktop } from "@/components/nav-desktop"
import { RutwikLogo } from "@/components/rutwik-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { XRayToggle } from "@/components/x-ray/x-ray-toggle"
import { HireButton } from "@/features/portfolio/components/hire/hire-button"

import { ScrollProgress } from "./scroll-progress"

const CommandMenu = dynamic(() => import("@/components/command-menu"))

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-background">
      <div className="page-container flex h-(--header-height) items-center gap-2 sm:gap-6">
        <Link href="/" aria-label="Home" className="shrink-0">
          <RutwikLogo />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center gap-1 max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <Separator
            orientation="vertical"
            className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <CommandMenu enabledHotkeys />
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
          <XRayToggle />
          <ThemeToggle />
          <HireButton
            source="header"
            size="sm"
            variant="brand"
            className="ml-2 h-9 rounded-full px-4 lowercase"
          >
            Hire me
          </HireButton>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
