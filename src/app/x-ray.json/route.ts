import { execFileSync } from "node:child_process"
import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  X_RAY_SECTIONS,
  type XRayData,
  type XRaySectionId,
  type XRaySource,
} from "@/config/x-ray"

// Built once, at build time, from the source files themselves. The browser
// fetches it only when someone turns X-ray mode on.
export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  const entries = await Promise.all(
    Object.entries(X_RAY_SECTIONS).map(async ([id, section]) => {
      // The route is static, so this read happens once at build time. The
      // ignore comment stops Turbopack tracing the whole project into the
      // server output for a read that never happens at request time.
      const source = await readFile(
        path.join(/*turbopackIgnore: true*/ process.cwd(), section.file),
        "utf8"
      )
      return [id, toXRaySource(section, source)] as const
    })
  )

  const sections = Object.fromEntries(entries) as Record<
    XRaySectionId,
    XRaySource
  >

  const data: XRayData = {
    sections,
    totalLines: entries.reduce((sum, [, source]) => sum + source.lines, 0),
    builtAt: process.env.BUILD_TIMESTAMP ?? new Date().toISOString(),
    commit: getCommit(),
  }

  return Response.json(data)
}

function toXRaySource(
  section: { component: string; file: string },
  source: string
): XRaySource {
  const lines = source.trimEnd().split("\n")
  // Start at the first export: the imports above it are noise on screen.
  const exportIndex = lines.findIndex((line) => line.startsWith("export "))
  const start = Math.max(exportIndex, 0)

  return {
    component: section.component,
    file: section.file,
    lines: lines.length,
    startLine: start + 1,
    code: lines.slice(start).join("\n"),
  }
}

/** The short commit hash: Vercel's, or the local repo's, or none. */
function getCommit(): string | null {
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA
  if (vercelSha) return vercelSha.slice(0, 7)

  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return null
  }
}
