import { AgentPrompt } from "@/components/agent/agent-prompt"

import { EmailButton } from "./email-button"
import { HireButton } from "./hire/hire-button"
import { SocialLinks } from "./social-links"

export function Intro() {
  return (
    <div className="space-y-8">
      <p className="text-[2rem]/[1.1] font-semibold tracking-[-0.03em] text-balance text-muted-foreground sm:text-[2.75rem]/[1.05]">
        I build <span className="text-foreground">web apps</span>,{" "}
        <span className="text-foreground">mobile apps</span> and{" "}
        <span className="text-foreground">AI agents</span> that people actually
        use.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <HireButton source="intro" variant="brand" size="lg" className="px-4">
          Hire me
        </HireButton>
        <EmailButton variant="outline" size="lg" className="px-3.5" />
        <SocialLinks size="icon-lg" />
      </div>

      <AgentPrompt />
    </div>
  )
}
