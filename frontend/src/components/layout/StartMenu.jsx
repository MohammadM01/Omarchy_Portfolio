import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import { FileDown, RotateCcw, Search, Power } from 'lucide-react'
import { APPS, profile, badges } from '../../data/portfolioData'
import { ProfilePhoto } from '../ui/ProfilePhoto'
import { AppIcon } from '../ui/AppIcon'
import { useTheme } from '../../contexts/ThemeContext'

export function StartMenu({ open, onClose, onLaunch, onReplayBoot }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return APPS
    return APPS.filter(
      (a) => a.label.toLowerCase().includes(q) || a.id.includes(q),
    )
  }, [query])

  const achievementsApp = APPS.find((a) => a.id === 'achievements')

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close Start menu"
            className="fixed inset-0 z-[60] bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Start menu"
            className="fixed bottom-[4.75rem] left-1/2 z-[70] flex max-h-[min(594px,calc(100%-130px))] w-[min(720px,calc(100vw-1.25rem))] -translate-x-1/2 overflow-hidden rounded-[20px] border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_50%,transparent)] p-1 shadow-[3px_3px_25px_1px_var(--color-win-shadow)] backdrop-blur-[80px] backdrop-saturate-[1.3] sm:w-[min(860px,calc(100vw-2rem))]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-win-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for apps, settings, and documents"
                  className="w-full rounded-full border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_70%,transparent)] py-2.5 pl-10 pr-4 text-sm text-win-text outline-none placeholder:text-win-muted focus:border-[var(--color-win-accent)]"
                />
              </div>

              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-win-text">Pinned</p>
                <span className="text-[11px] text-win-muted">All apps</span>
              </div>

              <div className="scrollbar-win mb-3 grid flex-1 grid-cols-3 gap-1 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
                {filtered.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => onLaunch?.(app)}
                    className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-center transition-colors hover:bg-[var(--color-win-hover)]"
                  >
                    <AppIcon id={app.id} size={44} />
                    <span className="line-clamp-2 text-[12px] leading-tight text-win-text">
                      {app.label}
                    </span>
                  </button>
                ))}
                {!filtered.length && (
                  <p className="col-span-full py-8 text-center text-sm text-win-muted">
                    No results for “{query}”
                  </p>
                )}
              </div>

              <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[var(--color-win-border)] bg-[color-mix(in_srgb,var(--color-win-bg)_55%,transparent)] px-3 py-2.5">
                <ProfilePhoto size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-win-text">
                    {profile.name}
                  </p>
                  <p className="truncate text-[11px] text-win-muted">
                    {profile.email}
                  </p>
                </div>
                <button
                  type="button"
                  title="Replay boot"
                  aria-label="Replay boot"
                  onClick={() => {
                    onClose?.()
                    onReplayBoot?.()
                  }}
                  className="grid h-9 w-9 place-items-center rounded-xl text-win-muted hover:bg-[var(--color-win-hover)] hover:text-win-text"
                >
                  <Power className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="hidden w-[280px] shrink-0 flex-col border-l border-[var(--color-win-border)] p-4 md:flex">
              <p className="mb-3 text-[13px] font-semibold text-win-text">
                Recommended
              </p>
              <div className="space-y-1">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--color-win-hover)]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-win-accent/15 text-win-accent">
                    <FileDown className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-win-text">Resume.pdf</p>
                    <p className="text-[11px] text-win-muted">Document</p>
                  </div>
                </a>
                {badges.slice(0, 3).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onLaunch?.(achievementsApp)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-[var(--color-win-hover)]"
                  >
                    <AppIcon id="achievements" size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-win-text">{b.short}</p>
                      <p className="truncate text-[11px] text-win-muted">{b.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-auto space-y-1 border-t border-[var(--color-win-border)] pt-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm text-win-text hover:bg-[var(--color-win-hover)]"
                >
                  <RotateCcw className="h-4 w-4 text-win-accent" />
                  {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                </button>
                {onReplayBoot && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose?.()
                      onReplayBoot()
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm text-win-text hover:bg-[var(--color-win-hover)]"
                  >
                    <Power className="h-4 w-4 text-win-accent" />
                    Replay boot
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

StartMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onLaunch: PropTypes.func,
  onReplayBoot: PropTypes.func,
}
