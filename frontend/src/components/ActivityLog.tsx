import { useEffect } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useGetUserActivity } from '@/hooks/useGetUserActivity'
import { describeEvent, getEventIcon } from '@/lib/githubActivity'
import { formatRelativeTime } from '@/lib/utils'

type ActivityLogProps = {
  username: string
}

const ActivityLog = ({ username }: ActivityLogProps) => {
  const { data, loading, error, getUserActivity, retry } =
    useGetUserActivity()

  useEffect(() => {
    getUserActivity(username)
  }, [username, getUserActivity])

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-card-foreground">
        Recent activity
      </h2>

      {loading && !data && (
        <p className="text-sm text-muted-foreground">Loading activity...</p>
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
        <p className="text-sm text-muted-foreground">
          No public activity in the last 90 days.
        </p>
      )}

      {!error && data && data.length > 0 && (
        <div className="flex max-h-[300px] flex-col divide-y divide-border overflow-y-auto">
          {data.map((event) => (
            <div key={event.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 shrink-0 text-muted-foreground">
                {getEventIcon(event.type)}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-card-foreground">
                  {describeEvent(event)}
                </p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
                  <a
                    href={`https://github.com/${event.repo.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent-foreground hover:underline"
                  >
                    {event.repo.name}
                  </a>
                  <span>·</span>
                  <span>{formatRelativeTime(event.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityLog
