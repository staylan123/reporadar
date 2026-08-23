import { GitFork } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold">
          <GitFork className="size-5" />
          <span>RepoRadar</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
