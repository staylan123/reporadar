import { useState, type SubmitEvent } from 'react'
import { FiSearch } from 'react-icons/fi'
import { ProfileHeader } from '@/components/ProfileHeader'
import { RepoList } from '@/components/RepoList'
import { Button } from '@/components/ui/button'
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
            <RepoList username={data.login} />
          </div>
        </div>
      )}
    </div>
  )
}
