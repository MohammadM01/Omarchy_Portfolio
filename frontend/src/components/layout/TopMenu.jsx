import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { ChevronDown, Circle, Menu, Wifi, X } from 'lucide-react'
import { useClock } from '../../hooks/useClock'
import { useTheme } from '../../contexts/ThemeContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { useWindows } from '../../contexts/WindowContext'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { profile, themePresets } from '../../data/portfolioData'
import { OmarchyMark } from '../ui/OmarchyMark'
import clsx from 'clsx'

export function TopMenu({ onReplayBoot, onOpenPalette }) {
  const { time, date } = useClock()
  const {
    toggleTheme,
    isDark,
    presetId,
    setPresetId,
    soundEnabled,
    toggleSound,
  } = useTheme()
  const { open: openTerminal, run } = useTerminal()
  const { openWindow, closeActive } = useWindows()
  const isMobile = useIsMobile()
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const barRef = useRef(null)

  const MENUS = {
    File: [
      { label: 'Open Terminal', action: 'terminal' },
      { label: 'Command Palette', action: 'palette' },
      { label: 'Download Resume', action: 'resume' },
      { label: 'Close Window', action: 'close' },
    ],
    View: [
      { label: `Theme: ${isDark ? 'Dark' : 'Light'}`, action: 'theme' },
      { label: `Sound: ${soundEnabled ? 'On' : 'Off'}`, action: 'sound' },
      ...themePresets.map((p) => ({
        label: `Accent: ${p.label}${p.id === presetId ? ' ✓' : ''}`,
        action: `preset:${p.id}`,
      })),
      { label: 'Open About', action: 'about' },
    ],
    Help: [
      { label: 'Terminal Help', action: 'help-term' },
      { label: 'Profile Card', action: 'profile' },
      { label: 'Replay Boot Intro', action: 'boot' },
    ],
  }

  useEffect(() => {
    const onDoc = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const runAction = (action) => {
    setOpenMenu(null)
    setMobileOpen(false)
    if (action.startsWith('preset:')) {
      setPresetId(action.slice(7))
      return
    }
    switch (action) {
      case 'terminal':
        openTerminal()
        break
      case 'palette':
        onOpenPalette?.()
        break
      case 'resume':
        window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer')
        break
      case 'close':
        closeActive()
        break
      case 'theme':
        toggleTheme()
        break
      case 'sound':
        toggleSound()
        break
      case 'about':
        openWindow('about')
        break
      case 'help-term':
        openTerminal()
        window.setTimeout(() => run('help'), 80)
        break
      case 'profile':
        openTerminal()
        window.setTimeout(() => run('./mohammad_mulla --profile --full'), 80)
        break
      case 'boot':
        onReplayBoot?.()
        break
      default:
        break
    }
  }

  return (
    <header
      ref={barRef}
      className="glass relative z-50 flex h-10 shrink-0 items-center justify-between border-b border-omarchy-border px-3"
      role="banner"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <OmarchyMark className="h-4 w-4 text-omarchy-accent" />
          <span className="omarchy-gradient-text font-mono text-xs font-semibold tracking-[0.14em]">
            OMARCHY
          </span>
        </div>

        {isMobile ? (
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="grid h-8 w-8 place-items-center text-omarchy-dim hover:text-omarchy-text"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        ) : (
          <nav className="flex items-center gap-0.5" aria-label="Application menu">
            {Object.keys(MENUS).map((name) => (
              <div key={name} className="relative">
                <button
                  type="button"
                  className={clsx(
                    'px-2 py-1 font-mono text-[11px] transition-colors',
                    openMenu === name
                      ? 'bg-omarchy-accent text-[#12081a]'
                      : 'text-omarchy-dim hover:bg-omarchy-panel hover:text-omarchy-text',
                  )}
                  aria-expanded={openMenu === name}
                  onClick={() => setOpenMenu((m) => (m === name ? null : name))}
                >
                  {name}
                </button>
                <AnimatePresence>
                  {openMenu === name && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-1 min-w-[200px] border border-omarchy-border bg-omarchy-surface/95 py-1 shadow-xl backdrop-blur-[10px]"
                      role="menu"
                    >
                      {MENUS[name].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center justify-between px-3 py-1.5 text-left font-mono text-[11px] text-omarchy-dim hover:bg-omarchy-panel hover:text-omarchy-accent"
                          onClick={() => runAction(item.action)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px] text-omarchy-dim">
        <button
          type="button"
          className="hidden px-1.5 py-0.5 text-omarchy-muted hover:text-omarchy-accent md:inline"
          onClick={onOpenPalette}
          title="Command palette (Ctrl+K)"
        >
          ⌘K
        </button>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <Wifi className="h-3 w-3 text-omarchy-success" aria-hidden />
          <span className="text-omarchy-success">connected</span>
        </span>
        <span className="hidden text-omarchy-muted md:inline">{date}</span>
        <span className="tabular-nums text-omarchy-text" aria-live="polite">
          {time}
        </span>
        <div
          className="grid h-6 w-6 place-items-center border border-omarchy-rose/50 bg-omarchy-panel font-mono text-[10px] font-semibold text-omarchy-rose"
          title={profile.name}
        >
          {profile.monogram}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 right-0 top-10 max-h-[70vh] overflow-auto border-b border-omarchy-border bg-omarchy-surface/98 p-2 backdrop-blur-[10px]"
          >
            {Object.entries(MENUS).map(([name, items]) => (
              <div key={name} className="mb-2">
                <div className="mb-1 flex items-center gap-1 px-2 font-mono text-[10px] uppercase tracking-wider text-omarchy-muted">
                  <ChevronDown className="h-3 w-3" />
                  {name}
                </div>
                {items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 font-mono text-xs text-omarchy-dim hover:bg-omarchy-panel hover:text-omarchy-accent"
                    onClick={() => runAction(item.action)}
                  >
                    <Circle className="h-1.5 w-1.5 fill-current" />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

TopMenu.propTypes = {
  onReplayBoot: PropTypes.func,
  onOpenPalette: PropTypes.func,
}
