import type { GithubRepo, GithubUser } from '@/types/github'

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000
const YEAR_MS = 365 * 24 * 60 * 60 * 1000

// GitHub caps `per_page` at 100 and the search page doesn't paginate the
// shared repo fetch, so stats/preview work off the 100 most recently
// updated repos.
export const REPO_SAMPLE_SIZE = 100

export type RepoStats = {
  stars: number
  forks: number
  activeCount: number
  languageCount: number
  topLanguage: string | null
  topRepo: GithubRepo | null
  ageYears: number
}

// Aggregate a user's repo list into the numbers shown in the stats card.
// `repos` is whatever the caller fetched (we cap at GitHub's 100/page and
// don't paginate), so treat the result as a sample when there are more.
export const computeRepoStats = (
  repos: GithubRepo[],
  user: GithubUser,
): RepoStats => {
  const now = Date.now()
  const languageCounts = new Map<string, number>()
  let stars = 0
  let forks = 0
  let activeCount = 0
  let topRepo: GithubRepo | null = null

  for (const repo of repos) {
    stars += repo.stargazers_count
    forks += repo.forks_count
    if (now - new Date(repo.pushed_at).getTime() < NINETY_DAYS_MS) {
      activeCount += 1
    }
    if (repo.language) {
      languageCounts.set(
        repo.language,
        (languageCounts.get(repo.language) ?? 0) + 1,
      )
    }
    if (!topRepo || repo.stargazers_count > topRepo.stargazers_count) {
      topRepo = repo
    }
  }

  const topLanguage =
    [...languageCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  return {
    stars,
    forks,
    activeCount,
    languageCount: languageCounts.size,
    topLanguage,
    topRepo: topRepo && topRepo.stargazers_count > 0 ? topRepo : null,
    ageYears: (now - new Date(user.created_at).getTime()) / YEAR_MS,
  }
}
