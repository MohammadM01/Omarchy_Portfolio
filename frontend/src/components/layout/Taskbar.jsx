import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Wifi,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Search,
} from 'lucide-react'
import { APPS } from '../../data/portfolioData'
import { MOBILE_TASKBAR_IDS } from '../../constants'
import { useWindows } from '../../contexts/WindowContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useSound } from '../../contexts/SoundContext'
import { useClock } from '../../hooks/useClock'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { WinLogo } from '../ui/WinLogo'
import { AppIcon } from '../ui/AppIcon'
import { ProfilePhoto } from '../ui/ProfilePhoto'
import { StartMenu } from './StartMenu'

function TaskbarButton({ app, active, minimized, onClick }) {
  return (
    <button
      type="button"
      title={app.label}
      aria-label={app.label}
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200',
        active
          ? 'bg-white/15 dark:bg-white/12'
          : 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]',
      )}
    >
      <span
        className={clsx(
          'transition-transform duration-200 group-hover:scale-105 group-active:scale-90',
          active && 'task-bounce',
        )}
      >
        <AppIcon id={app.id} size={32} />
      </span>
      <span
        className={clsx(
          'absolute bottom-1 h-[3px] rounded-full transition-all duration-200',
          active
            ? 'w-4 win-theme-bar'
            : minimized
              ? 'w-2.5 bg-white/40'
              : 'w-0 bg-white/30 group-hover:w-3',
        )}
      />
    </button>
  )
}

TaskbarButton.propTypes = {
  app: PropTypes.object.isRequired,
  active: PropTypes.bool,
  minimized: PropTypes.bool,
  onClick: PropTypes.func,
}

export function Taskbar({ onReplayBoot, startOpen, setStartOpen }) {
  const { windows, openWindow, focusWindow, isOpen } = useWindows()
  const { toggle: toggleTerminal, isOpen: termOpen } = useTerminal()
  const { isDark, toggleTheme } = useTheme()
  const { enabled: soundOn, toggle: toggleSound, play } = useSound()
  const { time, date } = useClock()
  const isMobile = useIsMobile()
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

  const apps = useMemo(() => {
    if (!isMobile) return APPS
    return APPS.filter((a) => MOBILE_TASKBAR_IDS.includes(a.id))
  }, [isMobile])

  const launch = (app) => {
    play('click')
    setStartOpen(false)
    if (app.id === 'terminal' || app.kind === 'terminal') {
      toggleTerminal()
      return
    }
    if (isOpen(app.id)) focusWindow(app.id)
    else {
      play('open')
      openWindow(app.id)
    }
  }

  return (
    <>
      <StartMenu
        open={startOpen}
        onClose={() => setStartOpen(false)}
        onLaunch={launch}
        onReplayBoot={onReplayBoot}
      />

      <footer
        className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]"
        aria-label="Taskbar"
      >
        <div
          className={clsx(
            'pointer-events-auto flex max-w-full origin-bottom scale-[1.01] items-center gap-1 rounded-[22px] px-2 py-1.5',
            'border border-white/20 dark:border-white/10',
            'bg-white/55 dark:bg-[#1c1c1e]/72',
            'shadow-[0_8px_32px_rgba(0,0,0,0.28),0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)]',
            'backdrop-blur-[28px] backdrop-saturate-150',
            'transition-[background,box-shadow] duration-300',
          )}
        >
          <button
            type="button"
            aria-label="Start"
            aria-expanded={startOpen}
            onClick={() => {
              play('click')
              setStartOpen((v) => !v)
            }}
            className={clsx(
              'grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-all duration-200',
              startOpen
                ? 'bg-white/25 dark:bg-white/15'
                : 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]',
            )}
          >
            <WinLogo className="h-7 w-7" glow />
          </button>

          {!isMobile && (
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                play('click')
                setStartOpen(true)
              }}
              className="mx-0.5 flex h-9 w-[140px] shrink-0 items-center gap-2 rounded-full bg-black/[0.06] px-3 text-xs text-win-muted transition-colors hover:bg-black/[0.1] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] sm:w-[168px]"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Search</span>
            </button>
          )}

          <div className="mx-1 hidden h-7 w-px bg-black/10 dark:bg-white/10 sm:block" />

          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {apps.map((app) => {
              const win = windows[app.id]
              const active =
                app.id === 'terminal'
                  ? termOpen
                  : Boolean(win?.open && !win?.minimized)
              const minimized = Boolean(win?.open && win?.minimized)
              return (
                <TaskbarButton
                  key={app.id}
                  app={app}
                  active={active}
                  minimized={minimized}
                  onClick={() => launch(app)}
                />
              )
            })}
          </nav>

          <div className="mx-1 h-7 w-px bg-black/10 dark:bg-white/10" />

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
              onClick={() => {
                toggleSound()
                play('click')
              }}
              className="grid h-10 w-10 place-items-center rounded-2xl text-win-text transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
            >
              {soundOn ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              aria-label="Network"
              title={online ? 'Connected' : 'Offline'}
              className={clsx(
                'grid h-10 w-10 place-items-center rounded-2xl transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08]',
                online ? 'text-win-text' : 'text-win-danger',
              )}
            >
              <Wifi className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              onClick={() => {
                toggleTheme()
                play('click')
              }}
              className="grid h-10 w-10 place-items-center rounded-2xl text-win-text transition-all duration-300 hover:bg-black/[0.06] hover:text-win-accent dark:hover:bg-white/[0.08]"
            >
              {isDark ? (
                <Sun className="h-4 w-4 transition-transform duration-300" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300" />
              )}
            </button>
            <button
              type="button"
              aria-label="Open About Me"
              onClick={() => {
                play('open')
                openWindow('about')
              }}
              className="ml-0.5 grid h-10 w-10 place-items-center rounded-2xl transition-transform hover:scale-105"
            >
              <ProfilePhoto size="sm" className="!h-8 !w-8" />
            </button>
          </div>

          <button
            type="button"
            className="ml-0.5 hidden min-w-[4.75rem] flex-col justify-center rounded-2xl px-2.5 py-1 text-right transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08] sm:flex"
            onClick={() => {
              play('click')
              openWindow('welcome')
            }}
          >
            <p className="text-[12px] font-semibold leading-tight tabular-nums text-win-text">
              {time}
            </p>
            <p className="text-[10px] leading-tight text-win-muted">{date}</p>
          </button>
        </div>
      </footer>
    </>
  )
}

Taskbar.propTypes = {
  onReplayBoot: PropTypes.func,
  startOpen: PropTypes.bool,
  setStartOpen: PropTypes.func,
}
