import type { GithubContributions } from '@/types/github'

// Sequential blue ramp, light->dark (dataviz skill reference palette).
// Level -1 ("no contributions") uses a neutral surface, not the ramp.
export const EMPTY_COLOR = '#e1e0d9'
export const LEVEL_COLORS = ['#cde2fb', '#6da7ec', '#2a78d6', '#184f95']

export type ContributionWeek = GithubContributions['days']

// Row labels for the 7-day grid, Sunday-first to match `toWeeks` below.
// Only alternating days are labeled (GitHub's own calendar does the same) —
// labeling all 7 at an 11px row height is cramped and redundant; the blanks
// still render as empty rows so the grid stays aligned with the day cells.
export const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

// GitHub pads the calendar to full weeks starting on a Sunday, so chunking
// the flat day list into groups of 7 reproduces the weeks as-is.
export const toWeeks = (days: GithubContributions['days']): ContributionWeek[] => {
  const weeks: ContributionWeek[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

// Buckets counts into 4 non-zero levels by quartile of this user's own
// non-zero days, so the ramp stays meaningful whether someone's busiest day
// was 3 commits or 300.
export const computeThresholds = (days: GithubContributions['days']): number[] => {
  const nonZero = days
    .map((d) => d.count)
    .filter((c) => c > 0)
    .sort((a, b) => a - b)
  if (nonZero.length === 0) return [0, 0, 0]
  const at = (p: number) =>
    nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))]
  return [at(0.25), at(0.5), at(0.75)]
}

const levelFor = (count: number, thresholds: number[]): number => {
  if (count <= 0) return -1
  if (count <= thresholds[0]) return 0
  if (count <= thresholds[1]) return 1
  if (count <= thresholds[2]) return 2
  return 3
}

export const colorFor = (count: number, thresholds: number[]): string => {
  const level = levelFor(count, thresholds)
  return level === -1 ? EMPTY_COLOR : LEVEL_COLORS[level]
}
