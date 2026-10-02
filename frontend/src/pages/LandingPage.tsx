import { GitFork } from 'lucide-react'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CODE_WORDS = [
  'repositories',
  'pull requests',
  'commits',
  'issues',
  'languages',
  'contributions',
  'stars',
]

const TYPEWRITER_SEQUENCE = CODE_WORDS.flatMap((word) => [word, 1400])

const LandingPage = () => {
  return (
    <div className="hero-gradient flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm font-medium text-card-foreground backdrop-blur">
          <GitFork className="size-4" />
          RepoRadar
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Explore GitHub{' '}
          <span className="bg-linear-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
            profiles &amp; repos
          </span>
        </h1>

        <p className="text-lg text-balance text-muted-foreground">
          Look up any GitHub user and see their{' '}
          <TypeAnimation
            sequence={TYPEWRITER_SEQUENCE}
            wrapper="span"
            speed={35}
            deletionSpeed={45}
            repeat={Infinity}
            className="font-semibold text-accent-foreground"
          />{' '}
          at a glance.
        </p>

        <Link
          to="/search"
          className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-6')}
        >
          Start searching
          <FiArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default LandingPage
