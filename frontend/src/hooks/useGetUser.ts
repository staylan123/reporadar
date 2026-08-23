import { useCallback, useState } from 'react'

const API_BASE_URL = 'http://localhost:8000'

export type GithubUser = {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

type UseGetUserResult = {
  data: GithubUser | null
  loading: boolean
  error: string | null
  getUser: (username: string) => Promise<void>
}

export function useGetUser(): UseGetUserResult {
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
