import { ArrowUpRightIcon, MapPinIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { EmailButton } from "./email-button"
import { HireButton } from "./hire/hire-button"
import { CurrentLocalTimeItem } from "./overview/current-local-time-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
} from "./overview/intro-item"
import { Panel, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "contact"

export function Contact() {
  return (
    <Panel id={ID} className="px-4">
      <div className="relative isolate overflow-hidden rounded-3xl border bg-card px-6 py-12 sm:px-12 sm:py-16">
        {/* Saffron light from the top left, gold from the bottom right. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_0%_0%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent),radial-gradient(50%_70%_at_100%_100%,color-mix(in_oklab,var(--brand-2)_12%,transparent),transparent)]"
          aria-hidden
        />

        <PanelTitle className="text-4xl sm:text-5xl">
          <a href={`#${ID}`}>Let&apos;s work together</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>

        <p className="mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
          Have a product to build, or a role to fill? I&apos;m open to freelance
          projects, contracts and full-time work. A few lines about what you
          need are enough to start.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <HireButton
            source="contact"
            data-agent="hire"
            variant="brand"
            size="lg"
            className="px-4"
          >
            Start a project brief
          </HireButton>
          <EmailButton
            variant="outline"
            size="lg"
            className="px-3.5"
            showAddress
          />
          <Button
            variant="ghost"
            size="lg"
            nativeButton={false}
            render={
              <a href={SOCIAL.linkedin.href} target="_blank" rel="noopener">
                LinkedIn
                <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            }
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-muted-foreground">
          <IntroItem>
            <IntroItemIcon>
              <MapPinIcon />
            </IntroItemIcon>
            <IntroItemContent>{USER.address}</IntroItemContent>
          </IntroItem>

          <CurrentLocalTimeItem timeZone={USER.timeZone} />
        </div>
      </div>
    </Panel>
  )
}
