import { Suspense } from "react"

import { getGitHubContributions } from "@/features/portfolio/data/github-contributions"

import { GitHubContributionFallback, GitHubContributionGraph } from "./graph"

export function GitHubContributions() {
  const contributions = getGitHubContributions()

  return (
    <div>
      <h3 className="sr-only">GitHub contributions</h3>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </div>
  )
}
