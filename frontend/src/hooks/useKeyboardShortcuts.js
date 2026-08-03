import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTerminal } from '../contexts/TerminalContext'
import { useWindows } from '../contexts/WindowContext'

export function useKeyboardShortcuts({ onOpenPalette }) {
  const { toggle, isOpen, close } = useTerminal()
  const { closeActive } = useWindows()

  useEffect(() => {
    const onKey = (e) => {
      const meta = e.ctrlKey || e.metaKey
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        onOpenPalette?.()
        return
      }
      if (meta && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault()
        toggle()
        return
      }
      if (meta && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault()
        closeActive()
        return
      }
      if (e.key === 'Escape' && isOpen) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, closeActive, isOpen, close, onOpenPalette])
}

export function KeyboardShortcuts({ onOpenPalette }) {
  useKeyboardShortcuts({ onOpenPalette })
  return null
}

KeyboardShortcuts.propTypes = {
  onOpenPalette: PropTypes.func,
}
