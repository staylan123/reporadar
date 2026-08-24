import { FaGithub } from 'react-icons/fa'
import { FiCalendar, FiLink, FiMail, FiMapPin, FiUsers } from 'react-icons/fi'
import { formatDate, toHref } from '@/lib/utils'
import type { GithubUser } from '@/types/github'

type ProfileHeaderProps = {
  user: GithubUser
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="size-28 shrink-0 rounded-full border border-border"
        />

        <div>
          <h1 className="text-xl font-semibold text-card-foreground">
            {user.name ?? user.login}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground hover:underline"
          >
            <FaGithub className="size-4" />@{user.login}
          </a>
        </div>

        {user.bio && <p className="text-sm text-card-foreground">{user.bio}</p>}
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {user.location && (
            <span className="inline-flex items-center gap-1.5">
              <FiMapPin className="size-4" />
              {user.location}
            </span>
          )}
          {user.blog && (
            <a
              href={toHref(user.blog)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent-foreground hover:underline"
            >
              <FiLink className="size-4" />
              {user.blog}
            </a>
          )}
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="inline-flex items-center gap-1.5 hover:text-accent-foreground hover:underline"
            >
              <FiMail className="size-4" />
              {user.email}
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <FiUsers className="size-4 text-muted-foreground" />
            <strong className="font-semibold text-card-foreground">
              {user.followers}
            </strong>
            <span className="text-muted-foreground">followers</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <strong className="font-semibold text-card-foreground">
              {user.following}
            </strong>
            <span className="text-muted-foreground">following</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <FiCalendar className="size-3.5" />
            Joined {formatDate(user.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiCalendar className="size-3.5" />
            Updated {formatDate(user.updated_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
