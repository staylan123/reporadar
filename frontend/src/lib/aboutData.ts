import type { IconType } from 'react-icons'
import { FiGlobe } from 'react-icons/fi'
import {
  SiBaseui,
  SiFastapi,
  SiLucide,
  SiPython,
  SiReact,
  SiReactrouter,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'

export type NameLink = {
  name: string
  href: string
}

export type TechItem = NameLink & {
  Icon: IconType
  // Real brand hex (from simple-icons). Omitted for brands with no official
  // logo in that set (httpx) or whose logo is monochrome black/near-white
  // (shadcn, Base UI) — hardcoding those would make them invisible in one
  // theme, so they fall back to the default foreground color instead.
  color?: string
}

export const TECH_STACK: TechItem[] = [
  { name: 'React', href: 'https://react.dev', Icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', href: 'https://www.typescriptlang.org', Icon: SiTypescript, color: '#3178C6' },
  { name: 'Vite', href: 'https://vite.dev', Icon: SiVite, color: '#9135FF' },
  { name: 'Tailwind CSS', href: 'https://tailwindcss.com', Icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'React Router', href: 'https://reactrouter.com', Icon: SiReactrouter, color: '#CA4245' },
  { name: 'shadcn', href: 'https://ui.shadcn.com', Icon: SiShadcnui },
  { name: 'Base UI', href: 'https://base-ui.com', Icon: SiBaseui },
  { name: 'lucide-react', href: 'https://lucide.dev', Icon: SiLucide, color: '#F56565' },
  { name: 'FastAPI', href: 'https://fastapi.tiangolo.com', Icon: SiFastapi, color: '#009688' },
  { name: 'Python', href: 'https://www.python.org', Icon: SiPython, color: '#3776AB' },
  { name: 'httpx', href: 'https://www.python-httpx.org', Icon: FiGlobe },
]
