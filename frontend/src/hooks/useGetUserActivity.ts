import { useCallback, useRef, useState } from 'react'
import { API_BASE_URL } from '@/lib/utils'
import type { GithubEvent } from '@/types/github'

type GetUserActivityParams = {
  per_page?: number
  page?: number
}

type GetUserActivityResponse = {
  activity: GithubEvent[]
  has_next: boolean
}

type UseGetUserActivityResult = {
  data: GithubEvent[] | null
  hasNext: boolean
  loading: boolean
  error: string | null
  getUserActivity: (
    username: string,
    params?: GetUserActivityParams,
  ) => Promise<void>
  retry: () => void
}

export const useGetUserActivity = (): UseGetUserActivityResult => {
  const [data, setData] = useState<GithubEvent[] | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastCallRef = useRef<{
    username: string
    params: GetUserActivityParams
  } | null>(null)

  const getUserActivity = useCallback(
    async (username: string, params: GetUserActivityParams = {}) => {
      lastCallRef.current = { username, params }
      setLoading(true)
      setError(null)

      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) query.set(key, String(value))
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/users/${username}/activity?${query.toString()}`,
        )
        if (!res.ok) {
          throw new Error(
            `Failed to fetch activity for "${username}" (${res.status})`,
          )
        }
        const json = (await res.json()) as GetUserActivityResponse
        setData(json.activity)
        setHasNext(json.has_next)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setData(null)
        setHasNext(false)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const retry = useCallback(() => {
    if (!lastCallRef.current) return
    const { username, params } = lastCallRef.current
    getUserActivity(username, params)
  }, [getUserActivity])

  return { data, hasNext, loading, error, getUserActivity, retry }
}
