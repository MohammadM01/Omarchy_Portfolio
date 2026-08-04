import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTerminal } from '../contexts/TerminalContext'
import { useWindows } from '../contexts/WindowContext'

export function useKeyboardShortcuts({ onOpenStart }) {
  const { toggle, isOpen, close } = useTerminal()
  const { closeActive, openWindow } = useWindows()

  useEffect(() => {
    const onKey = (e) => {
      const meta = e.ctrlKey || e.metaKey
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        onOpenStart?.()
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
      if (meta && e.key === '0') {
        e.preventDefault()
        openWindow('ai')
        return
      }
      if (meta && e.key >= '1' && e.key <= '9') {
        const map = [
          'about',
          'experience',
          'skills',
          'projects',
          'achievements',
          'education',
          'github',
          'contact',
          'terminal',
        ]
        const id = map[Number(e.key) - 1]
        if (!id) return
        e.preventDefault()
        if (id === 'terminal') toggle()
        else openWindow(id)
      }
      if (e.key === 'Escape' && isOpen) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, closeActive, isOpen, close, onOpenStart, openWindow])
}

export function KeyboardShortcuts({ onOpenStart }) {
  useKeyboardShortcuts({ onOpenStart })
  return null
}

KeyboardShortcuts.propTypes = {
  onOpenStart: PropTypes.func,
}
