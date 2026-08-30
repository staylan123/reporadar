import { useMemo } from 'react'
import { FiRefreshCw, FiStar } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import type { GithubRepo } from '@/types/github'

type TopReposProps = {
  repos: GithubRepo[] | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

const TOP_COUNT = 6
// Single-hue magnitude bar (dataviz skill: ranked magnitude → one hue).
const BAR_COLOR = '#2a78d6'

const TopRepos = ({ repos, loading, error, onRetry }: TopReposProps) => {
  const top = useMemo(() => {
    if (!repos) return []
    return [...repos]
      .filter((repo) => repo.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, TOP_COUNT)
  }, [repos])

  const max = top[0]?.stargazers_count ?? 0

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-card-foreground">
        Top repositories
      </h2>

      {loading && !repos && (
        <p className="text-sm text-muted-foreground">Reading signal...</p>
      )}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={onRetry}
            disabled={loading}
          >
            <FiRefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      )}

      {!error && repos && top.length === 0 && (
        <p className="text-sm text-muted-foreground">No starred repositories.</p>
      )}

      {!error && top.length > 0 && (
        <ul className="flex flex-col gap-2.5">
          {top.map((repo) => {
            const pct = max > 0 ? (repo.stargazers_count / max) * 100 : 0
            return (
              <li key={repo.id} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-medium text-card-foreground hover:underline"
                  >
                    {repo.name}
                  </a>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">
                    <FiStar className="size-3" />
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: BAR_COLOR,
                    }}
                    title={`${repo.name} — ${repo.stargazers_count.toLocaleString()} stars`}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TopRepos
