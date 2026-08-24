import { useCallback, useState } from 'react'
import { API_BASE_URL } from '@/lib/utils'
import type { GithubRepo } from '@/types/github'

type GetUserReposParams = {
  type?: 'owner' | 'member' | 'all'
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

type UseGetUserReposResult = {
  data: GithubRepo[] | null
  loading: boolean
  error: string | null
  getUserRepos: (
    username: string,
    params?: GetUserReposParams,
  ) => Promise<void>
}

export const useGetUserRepos = (): UseGetUserReposResult => {
  const [data, setData] = useState<GithubRepo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUserRepos = useCallback(
    async (username: string, params: GetUserReposParams = {}) => {
      setLoading(true)
      setError(null)

      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) query.set(key, String(value))
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/users/${username}/repos?${query.toString()}`,
        )
        if (!res.ok) {
          throw new Error(
            `Failed to fetch repos for "${username}" (${res.status})`,
          )
        }
        const json = (await res.json()) as GithubRepo[]
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { data, loading, error, getUserRepos }
}
