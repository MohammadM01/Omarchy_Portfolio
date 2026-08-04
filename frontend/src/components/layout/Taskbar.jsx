import { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Sun, Moon, Search } from 'lucide-react'
import { TASKBAR_APPS } from '../../data/portfolioData'
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
import { QuickSettingsTrigger } from './QuickSettings'
import { useMotionPrefs, springs } from '../../utils/motion'

function TaskbarButton({ app, active, minimized, onClick }) {
  const { reduced } = useMotionPrefs()
  return (
    <motion.button
      type="button"
      title={app.label}
      aria-label={app.label}
      aria-pressed={active}
      onClick={onClick}
      whileHover={reduced ? undefined : { scale: 1.06, y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.92 }}
      transition={springs.tap}
      className={clsx(
        'group relative flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-2xl transition-colors duration-150',
        active
          ? 'bg-white/15 dark:bg-white/12'
          : 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]',
      )}
    >
      <span
        className={clsx(
          'transition-transform duration-200',
          active && 'task-bounce',
        )}
      >
        <AppIcon id={app.id} size={34} />
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
    </motion.button>
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
  const { play } = useSound()
  const { time, date } = useClock()
  const isMobile = useIsMobile()

  const apps = useMemo(() => {
    if (!isMobile) return TASKBAR_APPS
    return TASKBAR_APPS.filter((a) => MOBILE_TASKBAR_IDS.includes(a.id))
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
            'pointer-events-auto flex origin-bottom items-center gap-1 rounded-[24px] px-2.5 py-2',
            'border border-white/20 dark:border-white/10',
            'bg-white/55 dark:bg-[#1c1c1e]/72',
            'shadow-[0_8px_32px_rgba(0,0,0,0.28),0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.35)]',
            'backdrop-blur-[28px] backdrop-saturate-150',
            'transition-[background,box-shadow] duration-300',
          )}
        >
          <motion.button
            type="button"
            aria-label="Start"
            aria-expanded={startOpen}
            onClick={() => {
              play('click')
              setStartOpen((v) => !v)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            transition={springs.tap}
            className={clsx(
              'grid h-[48px] w-[48px] shrink-0 place-items-center rounded-2xl transition-colors duration-200',
              startOpen
                ? 'bg-white/25 dark:bg-white/15'
                : 'hover:bg-black/[0.06] dark:hover:bg-white/[0.08]',
            )}
          >
            <WinLogo className="h-[34px] w-[34px]" glow />
          </motion.button>

          {!isMobile && (
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                play('click')
                setStartOpen(true)
              }}
              className="mx-0.5 flex h-[40px] w-[150px] shrink-0 items-center gap-2 rounded-full bg-black/[0.06] px-3.5 text-xs text-win-muted transition-colors hover:bg-black/[0.1] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] sm:w-[180px]"
            >
              <Search className="h-[14px] w-[14px] shrink-0" />
              <span className="truncate">Search</span>
            </button>
          )}

          <div className="mx-1 hidden h-8 w-px shrink-0 bg-black/10 dark:bg-white/10 sm:block" />

          <nav className="flex shrink-0 items-center gap-0.5">
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

          <div className="mx-1 h-8 w-px shrink-0 bg-black/10 dark:bg-white/10" />

          <div className="flex shrink-0 items-center gap-0.5">
            <motion.button
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              onClick={() => {
                toggleTheme()
                play('click')
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="grid h-[44px] w-[44px] place-items-center rounded-2xl text-win-text transition-colors duration-200 hover:bg-black/[0.06] hover:text-win-accent dark:hover:bg-white/[0.08]"
            >
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={springs.snappy}
                className="grid place-items-center"
              >
                {isDark ? (
                  <Sun className="h-[16px] w-[16px]" />
                ) : (
                  <Moon className="h-[16px] w-[16px]" />
                )}
              </motion.span>
            </motion.button>
            <QuickSettingsTrigger />
            <button
              type="button"
              aria-label="Open About Me"
              onClick={() => {
                play('open')
                openWindow('about')
              }}
              className="ml-0.5 grid h-[44px] w-[44px] place-items-center rounded-2xl transition-transform hover:scale-105"
            >
              <ProfilePhoto size="sm" className="!h-[34px] !w-[34px]" />
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
