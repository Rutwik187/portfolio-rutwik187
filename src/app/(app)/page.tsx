import type { Metadata } from "next"
import type { ProfilePage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { getAgentCatalog } from "@/components/agent/agent-catalog"
import { AgentChat } from "@/components/agent/agent-chat"
import { XRayController } from "@/components/x-ray/x-ray-controller"
import { XRaySection } from "@/components/x-ray/x-ray-section"
import { Contact } from "@/features/portfolio/components/contact"
import { Education } from "@/features/portfolio/components/education"
import { Experiences } from "@/features/portfolio/components/experiences"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { Hello } from "@/features/portfolio/components/hello"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
import { ShippedFor } from "@/features/portfolio/components/shipped-for"
import { TechStack } from "@/features/portfolio/components/tech-stack"
import { Work } from "@/features/portfolio/components/work"
import { USER } from "@/features/portfolio/data/user"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={getProfilePageJsonLd()} />
      <XRayController />
      <AgentChat catalog={getAgentCatalog()} />

      <div className="relative isolate **:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+(--spacing(8)))]">
        <div
          className="pointer-events-none absolute -inset-x-2 top-0 -z-10 h-192 hero-glow"
          aria-hidden
        />

        <div className="mx-auto md:max-w-3xl lg:max-w-5xl">
          <XRaySection id="hero">
            <ProfileHeader />
          </XRaySection>
          <XRaySection id="clients">
            <ShippedFor />
          </XRaySection>
          <SectionGap />

          <XRaySection id="work">
            <Work />
          </XRaySection>
          <SectionGap />

          <XRaySection id="about">
            <Hello />
          </XRaySection>
          <XRaySection id="github">
            <GitHubContributions />
          </XRaySection>
          <SectionGap />

          <XRaySection id="experience">
            <Experiences />
          </XRaySection>
          <SectionGap />

          <XRaySection id="stack">
            <TechStack />
          </XRaySection>
          <SectionGap />

          <XRaySection id="projects">
            <Projects />
          </XRaySection>
          <SectionGap />

          <XRaySection id="education">
            <Education />
          </XRaySection>
          <SectionGap />

          <XRaySection id="contact">
            <Contact />
          </XRaySection>
        </div>
      </div>
    </>
  )
}

function getProfilePageJsonLd(): WithContext<ProfilePage> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/"),
    dateCreated: new Date(USER.dateCreated).toISOString(),
    dateModified: new Date().toISOString(),
    // Reference the Person defined in the WebSite node (rendered globally in
    // the root layout) so both blocks resolve to the same entity.
    mainEntity: { "@id": JSON_LD_ID.person },
  }
}

/** Space between sections. Whitespace, not a line, keeps the page calm. */
function SectionGap() {
  return <div className="h-16 sm:h-24" aria-hidden />
}
