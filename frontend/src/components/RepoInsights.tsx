import { useEffect } from 'react'
import LanguageDonut from '@/components/LanguageDonut'
import StatsCard from '@/components/StatsCard'
import TopRepos from '@/components/TopRepos'
import { useGetUserRepos } from '@/hooks/useGetUserRepos'
import { REPO_SAMPLE_SIZE } from '@/lib/repoStats'
import type { GithubUser } from '@/types/github'

type RepoInsightsProps = {
  user: GithubUser
}

// Fetches the user's repo list once and feeds it to the stats, language,
// and top-repo cards, so the page makes a single `/repos` call for the set.
const RepoInsights = ({ user }: RepoInsightsProps) => {
  const { data: repos, loading, error, getUserRepos, retry } = useGetUserRepos()

  useEffect(() => {
    getUserRepos(user.login, { per_page: REPO_SAMPLE_SIZE })
  }, [user.login, getUserRepos])

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatsCard
        user={user}
        repos={repos}
        loading={loading}
        error={error}
        onRetry={retry}
      />
      <LanguageDonut
        repos={repos}
        loading={loading}
        error={error}
        onRetry={retry}
      />
      <div className="sm:col-span-2">
        <TopRepos
          repos={repos}
          loading={loading}
          error={error}
          onRetry={retry}
        />
      </div>
    </div>
  )
}

export default RepoInsights
