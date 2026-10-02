import type { ReactNode } from 'react'
import { TECH_STACK, type TechItem } from '@/lib/aboutData'

const TechGrid = ({ items }: { items: TechItem[] }) => (
  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
    {items.map(({ name, href, Icon, color }) => (
      <a
        key={name}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 text-center transition-colors hover:border-accent-foreground hover:bg-accent"
      >
        <Icon
          className={color ? 'size-7' : 'size-7 text-card-foreground'}
          style={color ? { color } : undefined}
        />
        <span className="text-sm font-medium text-card-foreground">{name}</span>
      </a>
    ))}
  </div>
)

const Section = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
    <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
    {children}
  </section>
)

const AboutPage = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-8">
      <Section title="About RepoRadar">
        <p className="text-base text-card-foreground">
          RepoRadar is a project that combines a React frontend and a Python
          backend to make a dashboard that surfaces a GitHub profile's
          repositories, languages, and contribution activity.
        </p>
      </Section>

      <Section title="Tech stack">
        <TechGrid items={TECH_STACK} />
      </Section>

      <Section title="The GitHub API">
        <p className="text-base text-card-foreground">
          This app is built entirely on top of{' '}
          <a
            href="https://docs.github.com"
            target="_blank"
            rel="noreferrer"
            className="text-card-foreground hover:text-accent-foreground"
          >
            <span className="font-bold underline">GitHub's API docs</span>
          </a>
          .
        </p>
      </Section>
    </div>
  )
}

export default AboutPage
