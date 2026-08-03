import { Window } from '../ui/Window'
import { Button } from '../ui/Button'
import { BadgeList } from '../ui/Badge'
import { Monogram } from '../ui/OmarchyMark'
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
    <Window id="welcome" title="welcome — Omarchy" width={500}>
      <div className="space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-omarchy-accent">
          session ready
        </p>
        <div className="flex items-start gap-3">
          <Monogram value={profile.monogram} size="md" className="shrink-0" />
          <div>
            <h1 className="font-mono text-xl font-semibold text-omarchy-text md:text-2xl">
              {profile.name}
            </h1>
            <p className="text-sm text-omarchy-dim">{profile.title}</p>
            <p className="mt-1 font-mono text-[11px] text-omarchy-accent">
              {profile.availability}
            </p>
          </div>
        </div>

        <BadgeList items={badges} />

        <p className="min-h-[2.5rem] font-mono text-xs leading-relaxed text-omarchy-muted">
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
        <p className="font-mono text-[10px] text-omarchy-muted">
          Ctrl+K command palette · Ctrl+` terminal · Ctrl+W close
        </p>
      </div>
    </Window>
  )
}
