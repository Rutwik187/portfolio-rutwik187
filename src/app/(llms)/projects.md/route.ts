import { PROJECTS } from "@/features/portfolio/data/projects"
import { WORK } from "@/features/portfolio/data/work"

const list = (items: string[]) => items.map((item) => `- ${item}`).join("\n")

const featured = WORK.map((item) => {
  const role = item.role ? `\nRole: ${item.role}` : ""
  const links = item.links
    .map((link) => `[${link.label}](${link.href})`)
    .join(", ")
  const process = item.process
    ? `\n\n${item.process.title}:\n\n${item.process.lanes
        .map(
          (lane) =>
            `${lane.title}:\n\n${lane.steps
              .map(
                (step, index) => `${index + 1}. ${step.title}: ${step.detail}`
              )
              .join("\n")}`
        )
        .join("\n\n")}`
    : ""

  return `### ${item.title} (${item.client}, ${item.year})

${item.description}
${role}
Links: ${links}

${list(item.highlights)}${process}

Stack: ${item.stack.join(", ")}`
}).join("\n\n")

const more = PROJECTS.map((item) => {
  const skills = `\n\nSkills: ${item.skills.join(", ")}`
  const description = item.description ? `\n\n${item.description.trim()}` : ""
  return `### ${item.title}\n\nProject URL: ${item.link}${skills}${description}`
}).join("\n\n")

const content = `# Projects

## Selected work

${featured}

## More projects

${more}
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
