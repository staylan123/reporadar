import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

// For bare "YYYY-MM-DD" dates (e.g. GitHub's contribution calendar) rather
// than full timestamps. `new Date("2025-09-28")` parses as UTC midnight,
// which formats back one day early in any timezone behind UTC — appending a
// time-of-day with no "Z" forces local-time parsing instead, so the calendar
// day stays the one the API meant.
export const formatDay = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export const toHref = (url: string) =>
  url.startsWith("http") ? url : `https://${url}`

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
})

export const formatRelativeTime = (value: string) => {
  const diffSeconds = Math.round(
    (new Date(value).getTime() - Date.now()) / 1000,
  )

  for (const [unit, secondsInUnit] of RELATIVE_TIME_UNITS) {
    if (Math.abs(diffSeconds) >= secondsInUnit) {
      return relativeTimeFormatter.format(
        Math.round(diffSeconds / secondsInUnit),
        unit,
      )
    }
  }

  return relativeTimeFormatter.format(diffSeconds, "second")
}
