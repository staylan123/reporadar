import { useEffect } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import RepoList from '@/components/RepoList'
import { useGetUser } from '@/hooks/useGetUser'

const RepoPage = () => {
  const { username } = useParams<{ username: string }>()
  const { data, loading, error, getUser } = useGetUser()

  useEffect(() => {
    if (username) getUser(username)
  }, [username, getUser])

  if (!username) return null

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-8">
      <Link
        to={`/search/${username}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-foreground hover:underline"
      >
        <FiArrowLeft className="size-4" />
        Back to search
      </Link>

      <h1 className="text-xl font-semibold text-foreground">
        {data?.name ?? username}&apos;s repositories
      </h1>

      {loading && !data && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {data && <RepoList username={username} totalRepos={data.public_repos} />}
    </div>
  )
}

export default RepoPage
