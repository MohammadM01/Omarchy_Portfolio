import { Window } from '../ui/Window'
import { WinLogo } from '../ui/WinLogo'
import { Button } from '../ui/Button'
import { profile } from '../../data/portfolioData'

const REPO_URL = 'https://github.com/MohammadM01/Omarchy_Portfolio'
const DEMO_URL = 'https://tjy-gitnub.github.io/win12/desktop.html'

export function AboutWin12Window() {
  return (
    <Window id="about-win12" title="About Win12 Web version" width={480} height={420}>
      <div className="flex flex-col items-center gap-4 text-center">
        <WinLogo className="h-16 w-16" glow />
        <div>
          <h2 className="text-lg font-semibold text-win-text">
            Windows 12 · Web Portfolio
          </h2>
          <p className="mt-1 text-sm text-win-muted">
            Inspired by the open-source Win12 web desktop
          </p>
        </div>

        <div className="w-full rounded-xl border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_55%,transparent)] px-4 py-3 text-left text-sm text-win-dim">
          <p>
            This site is a Fluent-style desktop experience for{' '}
            <strong className="text-win-text">{profile.name}</strong> — apps,
            Start menu, Terminal, and mica windows in the browser.
          </p>
          <ul className="mt-3 space-y-1.5 font-mono text-[12px] text-win-muted">
            <li>Version · 1.0.0</li>
            <li>Stack · React · Vite · Tailwind · Framer Motion</li>
            <li>Owner · {profile.name}</li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            <Button size="sm">View on GitHub</Button>
          </a>
          <a href={DEMO_URL} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              Original Win12 demo
            </Button>
          </a>
        </div>
      </div>
    </Window>
  )
}
