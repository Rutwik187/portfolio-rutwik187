import { SITE_INFO } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"

const content = `# ${USER.displayName}

> ${USER.bio}

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_INFO.url}/experience.md): Where I have worked and what I built there.
- [Education](${SITE_INFO.url}/education.md): Where I studied and what I built along the way.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects, newest first.
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
