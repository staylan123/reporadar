import { useEffect } from 'react'
import { FiArrowRight, FiRefreshCw } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import RepoListItem from '@/components/RepoListItem'
import { useGetUserRepos } from '@/hooks/useGetUserRepos'

type RepoPreviewProps = {
  username: string
  totalRepos: number
}

const PREVIEW_COUNT = 10

const RepoPreview = ({ username, totalRepos }: RepoPreviewProps) => {
  const { data, loading, error, getUserRepos, retry } = useGetUserRepos()

  useEffect(() => {
    getUserRepos(username, { per_page: PREVIEW_COUNT })
  }, [username, getUserRepos])

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-card-foreground">
          Repositories
          <span className="ml-1.5 font-normal text-muted-foreground">
            ({totalRepos})
          </span>
        </h2>

        {totalRepos > PREVIEW_COUNT && (
          <Link
            to={`/search/${username}/repos`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-foreground hover:underline"
          >
            View all repos
            <FiArrowRight className="size-3.5" />
          </Link>
        )}
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
        <div className="-mx-1 max-h-[500px] overflow-y-auto px-1">
          <div className="flex flex-col divide-y divide-border">
            {data.map((repo) => (
              <RepoListItem key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RepoPreview
