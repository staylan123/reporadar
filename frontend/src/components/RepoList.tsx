import { useEffect } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiGitBranch,
  FiRefreshCw,
  FiStar,
} from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetUserRepos } from '@/hooks/useGetUserRepos'
import { formatDate } from '@/lib/utils'
import { LANGUAGE_COLORS } from '@/lib/languageColors'

type RepoListProps = {
  username: string
}

type SortOption = 'full_name' | 'created' | 'updated'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'updated', label: 'Last updated' },
  { value: 'created', label: 'Created' },
  { value: 'full_name', label: 'Name' },
]
const DEFAULT_SORT: SortOption = 'updated'

const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.some((option) => option.value === value)

export const RepoList = ({ username }: RepoListProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, hasNext, loading, error, getUserRepos, retry } =
    useGetUserRepos()

  const sortParam = searchParams.get('sort')
  const sort = isSortOption(sortParam) ? sortParam : DEFAULT_SORT

  const pageParam = Number(searchParams.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1

  useEffect(() => {
    getUserRepos(username, { sort, page })
  }, [username, sort, page, getUserRepos])

  const handleSortChange = (value: string) => {
    if (!isSortOption(value)) return
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    params.set('page', '1') // changing sort restarts pagination
    setSearchParams(params)
  }

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(nextPage))
    setSearchParams(params)
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-card-foreground">
          Repositories
          {data && (
            <span className="ml-1.5 font-normal text-muted-foreground">
              ({data.length})
            </span>
          )}
        </h2>

        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger
            size="sm"
            aria-label="Sort repositories"
            disabled={loading}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && !data && (
        <p className="text-sm text-muted-foreground">Loading repos...</p>
      )}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={retry}
            disabled={loading}
          >
            <FiRefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      )}

      {!error && data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No repositories.</p>
      )}

      {!error && data && data.length > 0 && (
        <div className="flex flex-col divide-y divide-border">
          {data.map((repo) => (
            <div
              key={repo.id}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
            >
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

      {!error && data && (page > 1 || hasNext) && (
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
          >
            <FiChevronLeft className="size-3.5" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => goToPage(page + 1)}
            disabled={!hasNext || loading}
          >
            Next
            <FiChevronRight className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
