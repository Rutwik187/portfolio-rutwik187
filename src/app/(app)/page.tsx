import type { Metadata } from "next"
import type { ProfilePage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { getAgentCatalog } from "@/components/agent/agent-catalog"
import { AgentChat } from "@/components/agent/agent-chat"
import { XRayController } from "@/components/x-ray/x-ray-controller"
import { XRaySection } from "@/components/x-ray/x-ray-section"
import { AvailabilityStrip } from "@/features/portfolio/components/availability-strip"
import { Contact } from "@/features/portfolio/components/contact"
import { Experiences } from "@/features/portfolio/components/experiences"
import { Hello } from "@/features/portfolio/components/hello"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
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

      <div className="relative isolate">
        <XRaySection id="hero">
          <ProfileHeader />
        </XRaySection>
        <AvailabilityStrip />

        <SectionGap size="s" />
        <XRaySection id="work">
          <Work />
        </XRaySection>

        <SectionGap size="l" />
        <XRaySection id="stack">
          <TechStack />
        </XRaySection>

        <SectionGap size="m" />
        <XRaySection id="experience">
          <Experiences />
        </XRaySection>

        <SectionGap size="m" />
        <XRaySection id="about">
          <Hello />
        </XRaySection>

        <SectionGap size="l" />
        <XRaySection id="contact">
          <Contact />
        </XRaySection>
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

/**
 * Space between sections, in three steps (120, 144 and 176px at desktop
 * sizes), mixed so the seams do not all read the same.
 */
function SectionGap({ size }: { size: "s" | "m" | "l" }) {
  return (
    <div
      className={
        size === "s"
          ? "h-16 lg:h-30"
          : size === "m"
            ? "h-20 lg:h-36"
            : "h-24 lg:h-44"
      }
      aria-hidden
    />
  )
}
