import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "rscoe",
    school: "JSPM's Rajarshi Shahu College of Engineering (RSCOE), Pune",
    degree: "Bachelor of Technology",
    period: {
      start: "2020",
      end: "2024",
    },
    description: `- Graduated with a CGPA above 9.
- Built the official websites for [E-Cell RSCOE](https://e-cell-rscoe.vercel.app) and its [E-Summit](https://e-summit.vercel.app).
- Took part in hackathons and contributed to open source during Hacktoberfest.`,
    skills: [
      "Data Structures",
      "Algorithms",
      "C++",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
    ],
    isExpanded: true,
  },
]
