import { useMemo, type ReactNode } from 'react'
import { FiCode, FiGitBranch, FiRefreshCw, FiStar, FiZap } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { LANGUAGE_COLORS } from '@/lib/languageColors'
import { computeRepoStats, REPO_SAMPLE_SIZE } from '@/lib/repoStats'
import type { GithubRepo, GithubUser } from '@/types/github'

type StatsCardProps = {
  user: GithubUser
  repos: GithubRepo[] | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

const StatsCard = ({ user, repos, loading, error, onRetry }: StatsCardProps) => {
  const stats = useMemo(
    () => (repos ? computeRepoStats(repos, user) : null),
    [repos, user],
  )
  const sampled = repos ? user.public_repos > repos.length : false

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-card-foreground">Stats</h2>

      {loading && !stats && (
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

      {!error && stats && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Stat
              icon={<FiStar className="size-3.5" />}
              value={stats.stars.toLocaleString()}
              label="Total stars"
            />
            <Stat
              icon={<FiGitBranch className="size-3.5" />}
              value={stats.forks.toLocaleString()}
              label="Total forks"
            />
            <Stat
              icon={<FiZap className="size-3.5" />}
              value={stats.activeCount.toLocaleString()}
              label="Active (90d)"
            />
            <Stat
              icon={<FiCode className="size-3.5" />}
              value={stats.languageCount.toLocaleString()}
              label="Languages"
            />
          </div>

          <dl className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
            {stats.topLanguage && (
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Top language</dt>
                <dd className="inline-flex items-center gap-1.5 text-card-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        LANGUAGE_COLORS[stats.topLanguage] ?? '#8b8b8b',
                    }}
                  />
                  {stats.topLanguage}
                </dd>
              </div>
            )}
            {stats.topRepo && (
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Most starred</dt>
                <dd className="min-w-0">
                  <a
                    href={stats.topRepo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 truncate text-card-foreground hover:underline"
                  >
                    <span className="truncate">{stats.topRepo.name}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground">
                      <FiStar className="size-3" />
                      {stats.topRepo.stargazers_count.toLocaleString()}
                    </span>
                  </a>
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">On GitHub</dt>
              <dd className="text-card-foreground">
                {stats.ageYears < 1
                  ? 'under a year'
                  : `${Math.floor(stats.ageYears)} yr${
                      Math.floor(stats.ageYears) === 1 ? '' : 's'
                    }`}
              </dd>
            </div>
          </dl>

          {sampled && (
            <p className="text-xs text-muted-foreground">
              Based on the {REPO_SAMPLE_SIZE} most recently updated repos.
            </p>
          )}
        </>
      )}
    </div>
  )
}

type StatProps = {
  icon: ReactNode
  value: string
  label: string
}

const Stat = ({ icon, value, label }: StatProps) => (
  <div className="flex flex-col gap-0.5 rounded-md border border-border bg-background p-2.5">
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="text-lg font-semibold text-card-foreground">{value}</span>
  </div>
)

export default StatsCard
