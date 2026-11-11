import {
  BrainCircuitIcon,
  ChartColumnIcon,
  GemIcon,
  HeartHandshakeIcon,
  MicIcon,
  ScissorsIcon,
  StethoscopeIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react"

import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "welfare-chat",
    title: "AI Welfare Assistant",
    period: {
      start: "06.2026",
      end: "06.2026",
    },
    link: "https://welfare-chat.vercel.app/chat",
    skills: ["Next.js", "TypeScript", "Gemini", "PostgreSQL", "Neon"],
    description: `Chat assistant that supports university students in plain language.
- The server triages every message before the model answers
- Safeguarding rules live in code, not only in the prompt
- Answers from a knowledge base, asks a follow-up question, or hands over to staff`,
    icon: <HeartHandshakeIcon />,
  },
  {
    id: "glossy-and-glow",
    title: "Glossy and Glow",
    period: {
      start: "04.2026",
    },
    link: "https://www.glossyandglow.in",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "E-commerce"],
    description:
      "Online store for a jewellery brand: rings, pendants, waist chains, and bracelets.",
    icon: <GemIcon />,
  },
  {
    id: "tech-kpi",
    title: "Team Workspace",
    period: {
      start: "10.2026",
    },
    link: "https://github.com/Rutwik187/Tech-KPI",
    skills: [
      "Next.js",
      "TypeScript",
      "Better Auth",
      "Drizzle",
      "PostgreSQL",
      "Microsoft Entra ID",
    ],
    description: `A practical dashboard for a tech team's daily standups, tasks, bugs, and weekly delivery.
- Sign-in with company Microsoft accounts only, no passwords
- Demo mode that keeps changes in the browser`,
    icon: <ChartColumnIcon />,
  },
  {
    id: "ai-mock-interview",
    title: "AI Mock Interview",
    period: {
      start: "04.2026",
      end: "04.2026",
    },
    link: "https://github.com/Rutwik187/AI-Mock-Interview",
    skills: [
      "Next.js",
      "TypeScript",
      "Turborepo",
      "Drizzle",
      "PostgreSQL",
      "Better Auth",
    ],
    description: "Practise job interviews with an AI interviewer.",
    icon: <MicIcon />,
  },
  {
    id: "podcast-clipper",
    title: "Podcast Clipper",
    period: {
      start: "09.2025",
      end: "09.2025",
    },
    link: "https://github.com/Rutwik187/podcast-clipper",
    skills: ["Python", "TypeScript", "Computer Vision", "Video Processing"],
    description:
      "Cuts long podcast videos into short clips. Active speaker detection keeps the person who is talking in the frame.",
    icon: <ScissorsIcon />,
  },
  {
    id: "patient-management",
    title: "Patient Manager",
    period: {
      start: "03.2025",
      end: "05.2025",
    },
    link: "https://github.com/Rutwik187/patient-management",
    skills: ["Next.js", "TypeScript"],
    description:
      "A patient management tool I built for my sister, who is a doctor. My most demanding client.",
    icon: <StethoscopeIcon />,
  },
  {
    id: "fine-tuning-llm",
    title: "Fine-tuning an LLM",
    period: {
      start: "01.2025",
      end: "01.2025",
    },
    link: "https://github.com/Rutwik187/fine-tuning-llm",
    skills: ["Python", "Jupyter", "LoRA", "SFT", "DPO"],
    description:
      "Notebooks that fine-tune a language model with supervised fine-tuning (LoRA), then align it with DPO.",
    icon: <BrainCircuitIcon />,
  },
  {
    id: "pune-kabaddi",
    title: "Pune Kabaddi Association",
    period: {
      start: "12.2023",
      end: "01.2024",
    },
    link: "https://pune-kabaddi-association.vercel.app",
    skills: ["Next.js", "TypeScript", "Admin Dashboard"],
    description:
      "Web app for the Pune Kabaddi Association to schedule events and manage participants from an admin dashboard.",
    icon: <UsersIcon />,
  },
  {
    id: "gauranga-trophies",
    title: "Gauranga Trophies",
    period: {
      start: "10.2023",
      end: "12.2023",
    },
    link: "https://www.gaurangatrophies.in",
    skills: ["React", "Redux", "Sanity", "E-commerce"],
    description: "Online store and catalogue for a trophy and awards maker.",
    icon: <TrophyIcon />,
  },
]
