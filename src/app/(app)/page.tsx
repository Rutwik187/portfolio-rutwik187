import type { Metadata } from "next"
import type { ProfilePage, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { Contact } from "@/features/portfolio/components/contact"
import { Education } from "@/features/portfolio/components/education"
import { Experiences } from "@/features/portfolio/components/experiences"
import { GitHubContributions } from "@/features/portfolio/components/github-contributions"
import { Hello } from "@/features/portfolio/components/hello"
import { Overview } from "@/features/portfolio/components/overview"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { Projects } from "@/features/portfolio/components/projects"
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

      <div className="**:data-[slot=panel]:scroll-mt-[calc(var(--header-height)+(--spacing(8)))]">
        <div className="mx-auto md:max-w-3xl lg:max-w-5xl">
          <ProfileHeader />
          <Overview />
          <SectionGap />

          <Work />
          <SectionGap />

          <Hello />
          <GitHubContributions />
          <SectionGap />

          <Experiences />
          <SectionGap />

          <TechStack />
          <SectionGap />

          <Projects />
          <SectionGap />

          <Education />
          <SectionGap />

          <Contact />
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
