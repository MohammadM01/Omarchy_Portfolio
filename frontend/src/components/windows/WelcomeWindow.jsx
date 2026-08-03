import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { BadgeList } from '../ui/Badge'
import { WinLogo } from '../ui/WinLogo'
import { ProfilePhoto } from '../ui/ProfilePhoto'
import { TypeCursor } from '../ui/TypeCursor'
import { useTerminal } from '../../contexts/TerminalContext'
import { useWindows } from '../../contexts/WindowContext'
import { badges, profile } from '../../data/portfolioData'
import { useRevealText } from '../../hooks/useRevealText'
import { FileDown } from 'lucide-react'

export function WelcomeWindow() {
  const { open: openTerminal } = useTerminal()
  const { openWindow } = useWindows()
  const line = `Welcome — ${profile.tagline}`
  const { output, reduced } = useRevealText(line, { speed: 14 })

  return (
    <Window id="welcome" title="Welcome — Windows 12" width={520}>
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4 pb-1 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative shrink-0">
            <ProfilePhoto size="lg" rounded="xl" className="!h-24 !w-24 shadow-xl" />
            <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-win-bg)_80%,transparent)] shadow-md ring-1 ring-white/30">
              <WinLogo className="h-6 w-6" glow />
            </span>
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-win-accent">
              Desktop ready
            </p>
            <h1 className="text-xl font-semibold text-win-text md:text-2xl">
              {profile.name}
            </h1>
            <p className="text-sm text-win-dim">{profile.title}</p>
            <p className="mt-1 text-[11px] text-win-accent">
              {profile.availability}
            </p>
          </div>
        </div>

        <BadgeList items={badges} />

        <p className="min-h-[2.5rem] text-xs leading-relaxed text-win-muted">
          {output}
          {!reduced && <TypeCursor />}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="accent" onClick={openTerminal}>
            Open Terminal
          </Button>
          <Button variant="outline" onClick={() => openWindow('projects')}>
            Projects
          </Button>
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
            <Button variant="ghost" className="inline-flex items-center gap-1.5">
              <FileDown className="h-3.5 w-3.5" />
              Resume
            </Button>
          </a>
        </div>
        <p className="text-[10px] text-win-muted">
          Ctrl+K Start search · Ctrl+` terminal · Ctrl+W close
        </p>
      </div>
    </Window>
  )
}
