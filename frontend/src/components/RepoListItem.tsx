import { FiExternalLink, FiGitBranch, FiStar } from 'react-icons/fi'
import { formatDate } from '@/lib/utils'
import { LANGUAGE_COLORS } from '@/lib/languageColors'
import type { GithubRepo } from '@/types/github'

type RepoListItemProps = {
  repo: GithubRepo
}

const RepoListItem = ({ repo }: RepoListItemProps) => {
  return (
    <div className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-card-foreground hover:underline"
        >
          {repo.name}
          <FiExternalLink className="size-3.5 text-muted-foreground" />
        </a>
        {repo.fork && (
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            Fork
          </span>
        )}
        {repo.private && (
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            Private
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-sm text-card-foreground">{repo.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#8b8b8b',
              }}
            />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <FiStar className="size-3.5" />
          {repo.stargazers_count}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiGitBranch className="size-3.5" />
          {repo.forks_count}
        </span>
        <span>Updated {formatDate(repo.pushed_at)}</span>
      </div>
    </div>
  )
}

export default RepoListItem
