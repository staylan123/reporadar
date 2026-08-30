import { useEffect, useState, type SubmitEvent } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import ActivityLog from '@/components/ActivityLog'
import ProfileHeader from '@/components/ProfileHeader'
import RepoInsights from '@/components/RepoInsights'
import RepoPreview from '@/components/RepoPreview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetUser } from '@/hooks/useGetUser'

const SearchPage = () => {
  const { username: usernameParam } = useParams<{ username?: string }>()
  const navigate = useNavigate()
  const [username, setUsername] = useState(usernameParam ?? '')
  const { data, loading, error, getUser } = useGetUser()

  // Keep the input in sync when the URL's username changes from outside
  // this form (e.g. browser back/forward).
  useEffect(() => {
    setUsername(usernameParam ?? '')
  }, [usernameParam])

  useEffect(() => {
    if (usernameParam) getUser(usernameParam)
  }, [usernameParam, getUser])

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) return
    navigate(`/search/${trimmed}`)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-8">
      <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
        />
        <Button type="submit" disabled={loading || !username.trim()}>
          <FiSearch className="size-4" />
          Search
        </Button>
      </form>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && (
        <div className="grid gap-4 lg:grid-cols-[22rem_1fr] lg:items-start">
          <ProfileHeader user={data} />
          <div className="flex flex-col gap-4">
            <RepoInsights user={data} />
            <RepoPreview
              username={data.login}
              totalRepos={data.public_repos}
            />
            <ActivityLog username={data.login} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
