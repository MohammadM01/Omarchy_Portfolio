import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { commandPaletteItems, profile } from '../../data/portfolioData'
import { useWindows } from '../../contexts/WindowContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { useSound } from '../../contexts/ThemeContext'
import { useToast } from '../../contexts/ToastContext'
import clsx from 'clsx'

export function CommandPalette({ open, onClose, onReplayBoot }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef(null)
  const { openWindow } = useWindows()
  const { open: openTerminal } = useTerminal()
  const { play } = useSound()
  const { push } = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commandPaletteItems
    return commandPaletteItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.id.includes(q),
    )
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setIndex(0)
      window.setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => {
    setIndex(0)
  }, [query])

  const run = (item) => {
    if (!item) return
    play('click')
    switch (item.action) {
      case 'window':
        openWindow(item.id)
        push(`Opened ${item.label}`, 'accent')
        break
      case 'terminal':
        openTerminal()
        push('Terminal ready', 'info')
        break
      case 'resume':
        window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer')
        push('Resume download started', 'success')
        break
      case 'boot':
        onReplayBoot?.()
        break
      default:
        break
    }
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[index])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-start justify-center bg-black/50 px-3 pt-[12vh] backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="w-full max-w-lg overflow-hidden border border-omarchy-rose/25 bg-omarchy-surface/95 shadow-2xl backdrop-blur-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-omarchy-border px-3 py-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command… (projects, contact, resume)"
                className="w-full bg-transparent font-mono text-sm text-omarchy-text outline-none placeholder:text-omarchy-muted"
                aria-label="Command search"
              />
            </div>
            <ul className="max-h-72 overflow-auto py-1" role="listbox">
              {filtered.length === 0 && (
                <li className="px-3 py-3 font-mono text-xs text-omarchy-muted">
                  No matches
                </li>
              )}
              {filtered.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === index}
                    className={clsx(
                      'flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs transition-colors',
                      i === index
                        ? 'bg-omarchy-accent/15 text-omarchy-accent'
                        : 'text-omarchy-dim hover:bg-omarchy-panel hover:text-omarchy-text',
                    )}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(item)}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-omarchy-muted">{item.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-omarchy-border px-3 py-1.5 font-mono text-[10px] text-omarchy-muted">
              ↑↓ navigate · Enter open · Esc close · Ctrl+K toggle
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

CommandPalette.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onReplayBoot: PropTypes.func,
}
