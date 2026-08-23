import { useState, type SubmitEvent } from 'react'
import { Input } from '@/components/ui/input'
import { useGetUser } from '@/hooks/useGetUser'

const App = () => {
  const [username, setUsername] = useState('')
  const { data, loading, error, getUser } = useGetUser()

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim()) return
    getUser(username.trim())
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-8">
      <form onSubmit={handleSubmit}>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
        />
      </form>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && (
        <div className="flex items-center gap-3">
          <img
            src={data.avatar_url}
            alt={data.login}
            className="size-12 rounded-full"
          />
          <div>
            <p className="font-medium">{data.name ?? data.login}</p>
            <p className="text-sm text-muted-foreground">@{data.login}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
