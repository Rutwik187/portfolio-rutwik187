import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Rutwik",
  lastName: "Shinde",
  displayName: "Rutwik Shinde",
  username: "rutwik187",
  gender: "male",
  pronouns: "he/him",
  bio: "Full Stack AI Developer from Pune. I build web apps, mobile apps and AI agents that people actually use.",
  flipSentences: [
    "Full Stack AI Developer.",
    "I turn ideas into shipped products.",
    "Next.js by day, LLMs by night.",
    "Powered by cutting chai.",
  ],
  address: "Pune, Maharashtra, India",
  emailB64: "cnV0d2lrc2hpbmRlMzRAZ21haWwuY29t", // base64 encoded
  website: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  jobTitle: "Full Stack AI Developer",
  jobs: [
    {
      title: "Full Stack AI Developer",
      company: "AIEdX / BubblSpace",
      website: "https://bubblspace.com",
      experienceId: "aiedx",
    },
  ],
  buildingSince: 2019,
  clientCount: "50+",
  about: `- Hi, I'm Rutwik, a full stack developer from Pune. I turn messy ideas into products people actually use.
- Today I build AI agents and LLM apps with [AIEdX](https://aiedx.com) and [BubblSpace](https://bubblspace.com). I have been building since 2019, and have shipped storefronts, booking platforms, dashboards and payment flows for 50+ clients.
- Outside of code: video games, movies, my dog, and a slowly improving guitar.
`,
  avatar: "https://avatars.githubusercontent.com/u/86617402?v=4",
  ogImage: "/og/simple",
  timeZone: "Asia/Kolkata",
  keywords: [
    "rutwik",
    "rutwik shinde",
    "rutwik187",
    "full stack developer pune",
    "ai developer pune",
    "next.js developer",
    "software developer india",
  ],
  dateCreated: "2026-10-21", // YYYY-MM-DD
}
