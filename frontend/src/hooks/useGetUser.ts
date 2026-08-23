import { useCallback, useState } from 'react'
import type { GithubUser } from '@/types/github'

const API_BASE_URL = 'http://localhost:8000'

type UseGetUserResult = {
  data: GithubUser | null
  loading: boolean
  error: string | null
  getUser: (username: string) => Promise<void>
}

export const useGetUser = (): UseGetUserResult => {
  const [data, setData] = useState<GithubUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUser = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/users/${username}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch user "${username}" (${res.status})`)
      }
      const json = (await res.json()) as GithubUser
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, getUser }
}
