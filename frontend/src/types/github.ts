export type GithubUser = {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  fork: boolean
  private: boolean
  created_at: string
  updated_at: string
  pushed_at: string
}

export type GithubContributionDay = {
  date: string
  count: number
}

export type GithubContributions = {
  total: number
  days: GithubContributionDay[]
}

// GitHub's Events API — payload shape varies by `type` (PushEvent,
// PullRequestEvent, WatchEvent, ...), so it's typed loosely here and
// narrowed per-type where it's read.
export type GithubEvent = {
  id: string
  type: string
  actor: {
    id: number
    login: string
    avatar_url: string
  }
  repo: {
    id: number
    name: string
  }
  payload: Record<string, any>
  public: boolean
  created_at: string
}
