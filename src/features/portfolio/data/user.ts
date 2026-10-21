import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Rutwik",
  lastName: "Shinde",
  displayName: "Rutwik Shinde",
  username: "rutwik187",
  gender: "male",
  pronouns: "he/him",
  bio: "Full Stack AI Developer from Pune. I build web apps and AI agents that people actually use.",
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
  about: `- Hi, I'm Rutwik. I'm a full stack developer from Pune who loves turning messy ideas into products people actually use.
- These days I build AI agents and LLM-powered apps with [AIEdX](https://aiedx.com) and [BubblSpace](https://bubblspace.com), from prompt to production.
- Before that, I delivered web products for 10+ clients across e-commerce, IT, and agriculture: storefronts, booking platforms, dashboards, and payment flows.
- My favourite part of programming is the problem-solving. I love the moment a stubborn bug finally gives up.
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
