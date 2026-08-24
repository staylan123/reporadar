import { useEffect } from 'react'
import { FiExternalLink, FiGitBranch, FiStar } from 'react-icons/fi'
import { useGetUserRepos } from '@/hooks/useGetUserRepos'
import { formatDate } from '@/lib/utils'
import { LANGUAGE_COLORS } from '@/lib/languageColors'

type RepoListProps = {
  username: string
}

export const RepoList = ({ username }: RepoListProps) => {
  const { data, loading, error, getUserRepos } = useGetUserRepos()

  useEffect(() => {
    getUserRepos(username, { sort: 'updated' })
  }, [username, getUserRepos])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading repos...</p>
  }
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }
  if (!data) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-card-foreground">
        Repositories
        <span className="ml-1.5 font-normal text-muted-foreground">
          ({data.length})
        </span>
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No repositories.</p>
      ) : (
        <div className="flex max-h-[32rem] flex-col divide-y divide-border overflow-y-auto">
          {data.map((repo) => (
            <div key={repo.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-card-foreground hover:underline"
                >
                  {repo.name}
                  <FiExternalLink className="size-3.5 text-muted-foreground" />
                </a>
                {repo.fork && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    Fork
                  </span>
                )}
                {repo.private && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    Private
                  </span>
                )}
              </div>

              {repo.description && (
                <p className="text-sm text-card-foreground">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {repo.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          LANGUAGE_COLORS[repo.language] ?? '#8b8b8b',
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <FiStar className="size-3.5" />
                  {repo.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiGitBranch className="size-3.5" />
                  {repo.forks_count}
                </span>
                <span>Updated {formatDate(repo.pushed_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
