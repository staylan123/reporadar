import { useCallback, useRef, useState } from 'react'
import { API, readError } from '@/lib/api'
import type { GithubContributions } from '@/types/github'

type UseGetUserContributionsResult = {
  data: GithubContributions | null
  loading: boolean
  error: string | null
  getUserContributions: (username: string) => Promise<void>
  retry: () => void
}

export const useGetUserContributions = (): UseGetUserContributionsResult => {
  const [data, setData] = useState<GithubContributions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastUsernameRef = useRef<string | null>(null)

  const getUserContributions = useCallback(async (username: string) => {
    lastUsernameRef.current = username
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(API.GITHUB.GET_USER_CONTRIBUTIONS(username))
      if (!res.ok) {
        throw new Error(
          await readError(res, `Failed to fetch contributions for "${username}"`),
        )
      }
      const json = (await res.json()) as GithubContributions
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const retry = useCallback(() => {
    if (!lastUsernameRef.current) return
    getUserContributions(lastUsernameRef.current)
  }, [getUserContributions])

  return { data, loading, error, getUserContributions, retry }
}
