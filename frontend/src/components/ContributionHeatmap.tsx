import { useEffect, useMemo } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useGetUserContributions } from '@/hooks/useGetUserContributions'
import {
  colorFor,
  computeThresholds,
  EMPTY_COLOR,
  LEVEL_COLORS,
  toWeeks,
  WEEKDAY_LABELS,
  type ContributionWeek,
} from '@/lib/contributionStats'
import { formatDay } from '@/lib/utils'

type ContributionHeatmapProps = {
  username: string
}

const ContributionHeatmap = ({ username }: ContributionHeatmapProps) => {
  const { data, loading, error, getUserContributions, retry } =
    useGetUserContributions()

  useEffect(() => {
    getUserContributions(username)
  }, [username, getUserContributions])

  const { weeks, thresholds } = useMemo(() => {
    if (!data) return { weeks: [] as ContributionWeek[], thresholds: [0, 0, 0] }
    return {
      weeks: toWeeks(data.days),
      thresholds: computeThresholds(data.days),
    }
  }, [data])

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-card-foreground">
          Contributions
        </h2>
        {data && (
          <span className="text-xs text-muted-foreground">
            {data.total.toLocaleString()} in the last year
          </span>
        )}
      </div>

      {loading && !data && (
        <p className="text-sm text-muted-foreground">Reading signal...</p>
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

      {!error && weeks.length > 0 && (
        <div className="flex flex-col gap-2 overflow-x-auto pb-1">
          <div className="flex w-fit gap-[3px]">
            <div className="grid grid-rows-7 gap-[3px] pr-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <span
                  key={i}
                  className="flex h-[11px] items-center text-[9px] leading-none text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>

            <div
              className="grid grid-flow-col grid-rows-7 gap-[3px]"
              role="img"
              aria-label={`Contribution calendar: ${data?.total ?? 0} contributions in the last year`}
            >
              {weeks.map((week, wi) =>
                week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className="size-[11px] rounded-[2px]"
                    style={{ backgroundColor: colorFor(day.count, thresholds) }}
                    title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDay(day.date)}`}
                  />
                )),
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end text-[10px] text-muted-foreground">
            Less
            <span
              className="size-[11px] rounded-[2px]"
              style={{ backgroundColor: EMPTY_COLOR }}
            />
            {LEVEL_COLORS.map((color) => (
              <span
                key={color}
                className="size-[11px] rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            ))}
            More
          </div>
        </div>
      )}
    </div>
  )
}

export default ContributionHeatmap
