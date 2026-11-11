import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SOCIAL } from "@/features/portfolio/data/social-links"

import { EmailButton } from "./email-button"
import { HireButton } from "./hire/hire-button"
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "contact"

export function Contact() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Let&apos;s work together</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <PanelContent className="space-y-5">
        <p className="max-w-xl text-pretty text-muted-foreground">
          Have a product to build, or a role to fill? I&apos;m open to freelance
          projects, contracts and full-time work. A few lines about what you
          need are enough to start.
        </p>

        <div className="flex flex-wrap gap-2">
          <HireButton
            source="contact"
            className="bg-brand text-brand-foreground hover:bg-brand/85"
          >
            Start a project brief
          </HireButton>
          <EmailButton variant="outline" showAddress />
          <Button
            variant="ghost"
            nativeButton={false}
            render={
              <a href={SOCIAL.linkedin.href} target="_blank" rel="noopener">
                LinkedIn
                <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            }
          />
        </div>
      </PanelContent>
    </Panel>
  )
}
