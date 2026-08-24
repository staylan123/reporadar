import { useState, type SubmitEvent } from 'react'
import { ProfileHeader } from '@/components/ProfileHeader'
import { RepoList } from '@/components/RepoList'
import { Input } from '@/components/ui/input'
import { useGetUser } from '@/hooks/useGetUser'

export const SearchPage = () => {
  const [username, setUsername] = useState('')
  const { data, loading, error, getUser } = useGetUser()

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim()) return
    getUser(username.trim())
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-8">
      <form onSubmit={handleSubmit} className="max-w-sm">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
        />
      </form>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && (
        <>
          <ProfileHeader user={data} />
          <RepoList username={data.login} />
        </>
      )}
    </div>
  )
}
