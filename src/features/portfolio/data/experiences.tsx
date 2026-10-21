import {
  BotIcon,
  CodeXmlIcon,
  LayoutTemplateIcon,
  SmartphoneIcon,
  StoreIcon,
} from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "aiedx",
    companyName: "AIEdX / BubblSpace",
    companyIcon: <BotIcon />,
    companyWebsite: "https://bubblspace.com",
    location: "India",
    locationType: "Remote",
    positions: [
      {
        id: "1",
        title: "Full Stack AI Developer",
        employmentPeriod: {
          start: "2024",
        },
        employmentType: "Full-time",
        icon: <BotIcon />,
        description: `- Build [BubblSpace](https://bubblspace.com), a platform where people build, customise, and share their own AI agents.
- Built the first BubblSpace chat prototype: a ChatGPT-style app with chat history and authentication.
- Take features from idea to production across the stack: UI, APIs, databases, and LLM integrations.`,
        skills: [
          "TypeScript",
          "Next.js",
          "React",
          "Node.js",
          "Python",
          "LLMs",
          "AI Agents",
          "Vercel AI SDK",
          "PostgreSQL",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "priyam-it",
    companyName: "Priyam IT Services",
    companyIcon: <StoreIcon />,
    location: "Pune",
    locationType: "On-site",
    positions: [
      {
        id: "1",
        title: "Full Stack Developer",
        employmentPeriod: {
          start: "2023",
          end: "2024",
        },
        icon: <CodeXmlIcon />,
        description: `- Delivered web solutions for 10+ clients across IT, e-commerce, and agriculture.
- Kept a 95% on-time project completion rate, within budget.
- Built an e-commerce platform for small businesses: shop-owner dashboard, coupons, and online payments.`,
        skills: [
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "MongoDB",
          "Sanity",
          "Stripe",
          "Redux",
          "Tailwind CSS",
        ],
      },
    ],
  },
  {
    id: "qviple",
    companyName: "QVIPLE",
    companyIcon: <SmartphoneIcon />,
    location: "India",
    locationType: "Remote",
    positions: [
      {
        id: "1",
        title: "Front-End Developer",
        employmentPeriod: {
          start: "2022",
          end: "2023",
        },
        icon: <LayoutTemplateIcon />,
        description: `- Designed and built mobile-first web views for the QVIPLE startup.
- Focused on fast, touch-friendly layouts for users on phones.`,
        skills: ["React", "JavaScript", "CSS", "Responsive Design"],
      },
    ],
  },
]
