import { useEffect, useMemo, useState } from 'react'
import { profile } from '../../data/portfolioData'
import { useWindows } from '../../contexts/WindowContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useClock } from '../../hooks/useClock'

export function StatusBar() {
  const { activeId, windows } = useWindows()
  const { isOpen: termOpen } = useTerminal()
  const { preset, soundEnabled } = useTheme()
  const { time } = useClock()
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const openCount = useMemo(
    () => Object.values(windows).filter((w) => w.open && !w.minimized).length,
    [windows],
  )

  const focusLabel = termOpen
    ? 'terminal'
    : activeId
      ? activeId.replace(/^project-/, '')
      : 'desktop'

  return (
    <footer
      className="glass relative z-40 flex h-7 shrink-0 items-center justify-between gap-3 border-t border-omarchy-border px-3 font-mono text-[10px] text-omarchy-muted"
      role="status"
      aria-label="System status"
    >
      <div className="flex min-w-0 items-center gap-3 truncate">
        <span className="text-omarchy-rose">{profile.monogram}</span>
        <span className="hidden truncate sm:inline">{profile.availability}</span>
        <span className="truncate sm:hidden">Mumbai / Remote</span>
      </div>
      <div className="flex shrink-0 items-center gap-3 tabular-nums">
        <span>wins:{openCount}</span>
        <span className="hidden md:inline">focus:{focusLabel}</span>
        <span className="hidden md:inline">{preset.label}</span>
        <span>{soundEnabled ? 'snd:on' : 'snd:off'}</span>
        <span className={online ? 'text-omarchy-success' : 'text-omarchy-danger'}>
          {online ? 'net:up' : 'net:down'}
        </span>
        <span className="text-omarchy-dim">{time}</span>
      </div>
    </footer>
  )
}
