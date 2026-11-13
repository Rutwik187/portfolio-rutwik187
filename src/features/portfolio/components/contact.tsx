import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import { AgentAskCard } from "@/components/agent/agent-ask-card"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

import { EmailButton } from "./email-button"
import { HireButton } from "./hire/hire-button"
import { CurrentLocalTimeItem } from "./overview/current-local-time-item"

const ID = "contact"

/** The close: the brief, the address, and where and when Rutwik is. */
export function Contact() {
  return (
    <section id={ID} aria-labelledby={`${ID}-title`} className="page-container">
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-(--gap-columns)">
        <h2
          id={`${ID}-title`}
          className="reveal font-display text-display tracking-display lowercase lg:col-span-12"
        >
          <a
            href={`#${ID}`}
            className="underline-offset-[0.12em] hover:underline"
          >
            Have a product to build, or a role to fill?
          </a>
        </h2>

        <div className="lg:col-span-6">
          <p className="max-w-[48ch] text-lead text-muted-foreground">
            I’m open to freelance projects, contracts and full-time work. A few
            lines about what you need are enough to start.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <HireButton
              source="contact"
              data-agent="hire"
              variant="brand"
              size="pill"
              className="lowercase"
            >
              Start a project brief
            </HireButton>
            <EmailButton variant="outline" size="pill" showAddress />
          </div>
        </div>

        <dl className="self-end text-[0.9375rem] lg:col-span-5 lg:col-start-8">
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-t border-rule py-4">
            <dt className="text-muted-foreground lowercase">Based in</dt>
            <dd>{USER.address}</dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-t border-rule py-4">
            <dt className="text-muted-foreground lowercase">Local time</dt>
            <dd>
              <CurrentLocalTimeItem timeZone={USER.timeZone} />
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-y border-rule py-4">
            <dt className="text-muted-foreground lowercase">Elsewhere</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {SOCIAL_LINKS.map((item) => (
                  <li key={item.name}>
                    <a
                      href={addQueryParams(item.href, UTM_PARAMS)}
                      target="_blank"
                      rel="noopener"
                      className="underline decoration-rule-2 underline-offset-4 hover:decoration-brand"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <AgentAskCard />
    </section>
  )
}
