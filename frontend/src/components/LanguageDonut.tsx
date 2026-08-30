import { useMemo, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import type { GithubRepo } from '@/types/github'

type LanguageDonutProps = {
  repos: GithubRepo[] | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

// Validated categorical palette (dataviz skill reference instance, light).
// Slot order is the CVD-safety mechanism — don't reorder.
const PALETTE = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4']
const OTHER_COLOR = '#898781'
const MAX_SLICES = PALETTE.length

const RADIUS = 48
const STROKE = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 2 // px of surface between segments

type Slice = {
  name: string
  count: number
  pct: number
  color: string
}

type LanguageData = {
  slices: Slice[]
  total: number
}

const EMPTY: LanguageData = { slices: [], total: 0 }

const buildSlices = (repos: GithubRepo[]): LanguageData => {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (repo.language) {
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const total = sorted.reduce((sum, [, count]) => sum + count, 0)
  if (total === 0) return EMPTY

  const slices: Slice[] = sorted
    .slice(0, MAX_SLICES)
    .map(([name, count], i) => ({
      name,
      count,
      pct: count / total,
      color: PALETTE[i],
    }))

  const otherCount = sorted
    .slice(MAX_SLICES)
    .reduce((sum, [, count]) => sum + count, 0)
  if (otherCount > 0) {
    slices.push({
      name: 'Other',
      count: otherCount,
      pct: otherCount / total,
      color: OTHER_COLOR,
    })
  }

  return { slices, total }
}

const LanguageDonut = ({ repos, loading, error, onRetry }: LanguageDonutProps) => {
  const [active, setActive] = useState<number | null>(null)

  const { slices, total } = useMemo(
    () => (repos ? buildSlices(repos) : EMPTY),
    [repos],
  )

  const focused = active !== null ? slices[active] : null

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-card-foreground">Languages</h2>

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

      {!error && repos && slices.length === 0 && (
        <p className="text-sm text-muted-foreground">No language data.</p>
      )}

      {!error && slices.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <svg
              viewBox="0 0 120 120"
              className="size-32 shrink-0"
              role="img"
              aria-label={`Language breakdown: ${slices
                .map((s) => `${s.name} ${Math.round(s.pct * 100)}%`)
                .join(', ')}`}
            >
              <g transform="rotate(-90 60 60)">
                {slices.map((slice, i) => {
                  const len = slice.pct * CIRCUMFERENCE
                  const offset = slices
                    .slice(0, i)
                    .reduce((sum, s) => sum + s.pct * CIRCUMFERENCE, 0)
                  const dash = Math.max(len - GAP, 0.001)
                  return (
                    <circle
                      key={slice.name}
                      cx="60"
                      cy="60"
                      r={RADIUS}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth={STROKE}
                      strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                      strokeDashoffset={-offset}
                      className="cursor-pointer transition-opacity"
                      opacity={active === null || active === i ? 1 : 0.3}
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                    />
                  )
                })}
              </g>
              <text
                x="60"
                y="55"
                textAnchor="middle"
                className="fill-card-foreground text-[15px] font-semibold"
              >
                {focused ? `${Math.round(focused.pct * 100)}%` : total}
              </text>
              <text
                x="60"
                y="71"
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {focused ? focused.name : 'repos'}
              </text>
            </svg>

            <ul className="flex min-w-36 flex-1 flex-col gap-1.5">
              {slices.map((slice, i) => (
                <li
                  key={slice.name}
                  className="flex items-center gap-2 text-sm transition-opacity"
                  style={{
                    opacity: active === null || active === i ? 1 : 0.4,
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="flex-1 truncate text-card-foreground">
                    {slice.name}
                  </span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {slice.count} · {Math.round(slice.pct * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
            Share of each repository&apos;s primary language, across the user&apos;s
            most recently updated repos.
          </p>
        </>
      )}
    </div>
  )
}

export default LanguageDonut
