import type { ReactNode } from 'react'
import { GitFork } from 'lucide-react'
import {
  FiActivity,
  FiAlertCircle,
  FiGitBranch,
  FiGitCommit,
  FiGitPullRequest,
  FiMessageSquare,
  FiStar,
  FiTag,
  FiTrash2,
} from 'react-icons/fi'
import type { GithubEvent } from '@/types/github'

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

// GitHub's Events API has a heterogeneous payload per `type` — this maps
// each one to a short human-readable summary of the action (repo name and
// timestamp are rendered separately, alongside this).
// https://docs.github.com/en/rest/using-the-rest-api/github-event-types
export const describeEvent = (event: GithubEvent): string => {
  const { type, payload } = event

  switch (type) {
    case 'PushEvent': {
      const count = payload.distinct_size ?? payload.size ?? 0
      return `Pushed ${count} commit${count === 1 ? '' : 's'}`
    }
    case 'PullRequestEvent':
      return `${capitalize(payload.action)} pull request #${payload.number}`
    case 'PullRequestReviewEvent':
      return `Reviewed pull request #${payload.pull_request?.number}`
    case 'IssuesEvent':
      return `${capitalize(payload.action)} issue #${payload.number}`
    case 'IssueCommentEvent':
      return `Commented on issue #${payload.issue?.number}`
    case 'CommitCommentEvent':
      return 'Commented on a commit'
    case 'CreateEvent':
      return payload.ref_type === 'repository'
        ? 'Created the repository'
        : `Created ${payload.ref_type} "${payload.ref}"`
    case 'DeleteEvent':
      return `Deleted ${payload.ref_type} "${payload.ref}"`
    case 'ForkEvent':
      return 'Forked'
    case 'WatchEvent':
      return 'Starred'
    case 'ReleaseEvent':
      return `${capitalize(payload.action)} release ${payload.release?.tag_name ?? ''}`.trim()
    default:
      return type.replace(/Event$/, '')
  }
}

const EVENT_ICONS: Record<string, ReactNode> = {
  PushEvent: <FiGitCommit className="size-4" />,
  PullRequestEvent: <FiGitPullRequest className="size-4" />,
  PullRequestReviewEvent: <FiGitPullRequest className="size-4" />,
  IssuesEvent: <FiAlertCircle className="size-4" />,
  IssueCommentEvent: <FiMessageSquare className="size-4" />,
  CommitCommentEvent: <FiMessageSquare className="size-4" />,
  CreateEvent: <FiGitBranch className="size-4" />,
  DeleteEvent: <FiTrash2 className="size-4" />,
  ForkEvent: <GitFork className="size-4" />,
  WatchEvent: <FiStar className="size-4" />,
  ReleaseEvent: <FiTag className="size-4" />,
}

export const getEventIcon = (type: string): ReactNode =>
  EVENT_ICONS[type] ?? <FiActivity className="size-4" />
