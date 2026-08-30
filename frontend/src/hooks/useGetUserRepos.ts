import { useCallback, useRef, useState } from 'react'
import { API } from '@/lib/api'
import type { GithubRepo } from '@/types/github'

type GetUserReposParams = {
  type?: 'owner' | 'member' | 'all'
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

type GetUserReposResponse = {
  repos: GithubRepo[]
  has_next: boolean
}

type UseGetUserReposResult = {
  data: GithubRepo[] | null
  hasNext: boolean
  loading: boolean
  error: string | null
  getUserRepos: (
    username: string,
    params?: GetUserReposParams,
  ) => Promise<void>
  retry: () => void
}

export const useGetUserRepos = (): UseGetUserReposResult => {
  const [data, setData] = useState<GithubRepo[] | null>(null)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastCallRef = useRef<{
    username: string
    params: GetUserReposParams
  } | null>(null)

  const getUserRepos = useCallback(
    async (username: string, params: GetUserReposParams = {}) => {
      lastCallRef.current = { username, params }
      setLoading(true)
      setError(null)

      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) query.set(key, String(value))
      }

      try {
        const res = await fetch(
          `${API.GITHUB.GET_USER_REPOS(username)}?${query.toString()}`,
        )
        if (!res.ok) {
          throw new Error(
            `Failed to fetch repos for "${username}" (${res.status})`,
          )
        }
        const json = (await res.json()) as GetUserReposResponse
        setData(json.repos)
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
    getUserRepos(username, params)
  }, [getUserRepos])

  return { data, hasNext, loading, error, getUserRepos, retry }
}
