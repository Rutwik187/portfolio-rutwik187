/**
 * Which source file draws each home page section, for X-ray mode. The route
 * at `/x-ray.json` reads these files at build time, so the code shown is
 * always the code that shipped.
 */
export const X_RAY_SECTIONS = {
  hero: {
    component: "ProfileHeader",
    file: "src/features/portfolio/components/profile-header.tsx",
  },
  work: {
    component: "WorkList",
    file: "src/features/portfolio/components/work/work-list.tsx",
  },
  about: {
    component: "Hello",
    file: "src/features/portfolio/components/hello.tsx",
  },
  github: {
    component: "GitHubContributionGraph",
    file: "src/features/portfolio/components/github-contributions/graph.tsx",
  },
  experience: {
    component: "ExperienceItem",
    file: "src/features/portfolio/components/experiences/experience-item.tsx",
  },
  stack: {
    component: "TechStack",
    file: "src/features/portfolio/components/tech-stack.tsx",
  },
  education: {
    component: "EducationItem",
    file: "src/features/portfolio/components/education/education-item.tsx",
  },
  contact: {
    component: "Contact",
    file: "src/features/portfolio/components/contact.tsx",
  },
} as const

export type XRaySectionId = keyof typeof X_RAY_SECTIONS

export type XRaySource = {
  component: string
  file: string
  /** Line count of the whole file. */
  lines: number
  /** Line number (1-based) where `code` starts. */
  startLine: number
  /** The file from its first export on; the imports above it are skipped. */
  code: string
}

export type XRayData = {
  sections: Record<XRaySectionId, XRaySource>
  totalLines: number
  builtAt: string
  commit: string | null
}
