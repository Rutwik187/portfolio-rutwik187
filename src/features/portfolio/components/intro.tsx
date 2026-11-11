import { EmailButton } from "./email-button"
import { HireButton } from "./hire/hire-button"
import { Panel, PanelContent } from "./panel"

export function Intro() {
  return (
    <Panel>
      <h2 className="sr-only">Introduction</h2>

      <PanelContent className="space-y-5 py-6">
        <p className="max-w-2xl text-2xl/snug font-medium tracking-tight text-balance text-muted-foreground sm:text-[1.75rem]/snug">
          I build <span className="text-foreground">web apps</span>,{" "}
          <span className="text-foreground">mobile apps</span> and{" "}
          <span className="text-foreground">AI agents</span> that people
          actually use.
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex flex-wrap gap-2">
            <HireButton
              source="intro"
              className="bg-brand text-brand-foreground hover:bg-brand/85"
            >
              Hire me
            </HireButton>
            <EmailButton variant="outline" />
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Open to freelance and full-time work
          </p>
        </div>
      </PanelContent>
    </Panel>
  )
}
