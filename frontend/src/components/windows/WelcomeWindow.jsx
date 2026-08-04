import { Window } from '../ui/Window'
import { BadgeList } from '../ui/Badge'
import { WinLogo } from '../ui/WinLogo'
import { ProfilePhoto } from '../ui/ProfilePhoto'
import { useTerminal } from '../../contexts/TerminalContext'
import { useWindows } from '../../contexts/WindowContext'
import { badges, profile } from '../../data/portfolioData'
import { FileDown } from 'lucide-react'

export function WelcomeWindow() {
  const { open: openTerminal } = useTerminal()
  const { openWindow } = useWindows()

  return (
    <Window id="welcome" title="Welcome" width={580} variant="welcome">
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative shrink-0">
            <ProfilePhoto
              size="lg"
              rounded="lg"
              className="!h-[88px] !w-[88px] !shadow-none !ring-0"
            />
            <span className="welcome-badge-slot absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center overflow-hidden rounded-[4px]">
              <WinLogo className="h-5 w-5" glow={false} />
            </span>
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-win-accent">
              Open to work
            </p>
            <h1 className="welcome-name text-[25px] font-semibold leading-tight">
              {profile.name}
            </h1>
            <p className="welcome-role mt-1 text-[15px] font-normal">
              {profile.title}
            </p>
            <p className="mt-1 text-[13px] font-normal text-win-accent">
              {profile.availability}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <BadgeList items={badges} variant="welcome" />
        </div>

        <p className="welcome-muted mt-4 text-[14px] leading-[1.5]">
          {profile.tagline}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openTerminal}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-win-accent px-4 text-[14px] font-medium text-white transition hover:brightness-110"
          >
            Open Terminal
          </button>
          <button
            type="button"
            onClick={() => openWindow('projects')}
            className="welcome-secondary inline-flex h-10 items-center justify-center rounded-lg bg-transparent px-4 text-[14px] font-medium transition"
          >
            Projects
          </button>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="welcome-resume inline-flex h-10 items-center gap-1.5 text-[13px] transition hover:underline"
          >
            <FileDown className="h-3.5 w-3.5" strokeWidth={2} />
            Resume
          </a>
        </div>

        <p className="welcome-hint mt-5 text-[12px]">
          Ctrl+K Start search · Ctrl+` terminal · Ctrl+W close
        </p>
      </div>
    </Window>
  )
}
