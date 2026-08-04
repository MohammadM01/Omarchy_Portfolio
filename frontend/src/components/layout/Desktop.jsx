import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Taskbar } from './Taskbar'
import { Workspace } from './Workspace'
import { ContextMenu } from './ContextMenu'
import { KeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useSound } from '../../contexts/SoundContext'
import { useToast } from '../../contexts/ToastContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useWindows } from '../../contexts/WindowContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { PORTFOLIO_REPO_URL } from '../../constants'

export function Desktop({ onReplayBoot }) {
  const { play } = useSound()
  const { push } = useToast()
  const { toggleTheme } = useTheme()
  const { openWindow } = useWindows()
  const { open: openTerminal } = useTerminal()
  const [startOpen, setStartOpen] = useState(false)
  const [menu, setMenu] = useState({ open: false, x: 0, y: 0 })
  const [editMode, setEditMode] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const readyToastSent = useRef(false)

  useEffect(() => {
    play('boot')
    if (readyToastSent.current) return
    readyToastSent.current = true
    push('Desktop ready. Press Ctrl+K to search.', 'accent', 3200)
  }, [play, push])

  const onContextMenu = (e) => {
    e.preventDefault()
    const pad = 8
    const w = 260
    const h = 320
    const x = Math.min(e.clientX, window.innerWidth - w - pad)
    const y = Math.min(e.clientY, window.innerHeight - h - pad)
    setMenu({ open: true, x, y })
  }

  const onAction = (id) => {
    play('click')

    if (id === 'refresh') {
      setRefreshKey((k) => k + 1)
      push('Desktop refreshed', 'info', 1600)
      return
    }
    if (id === 'theme') {
      toggleTheme()
      push('Theme switched', 'accent', 1400)
      return
    }
    if (id === 'github-project') {
      window.open(PORTFOLIO_REPO_URL, '_blank', 'noopener,noreferrer')
      return
    }
    if (id === 'edit-mode') {
      setEditMode((v) => {
        const next = !v
        push(
          next
            ? 'Edit mode on. Drag icons to rearrange.'
            : 'Edit mode off',
          'accent',
          2200,
        )
        return next
      })
      return
    }
    if (id === 'personalize' || id === 'settings') {
      openWindow('personalize', { width: 660, height: 760 })
      return
    }
    if (id === 'this-pc') {
      openWindow('this-pc', { width: 820, height: 640 })
      return
    }
    if (id === 'edge') {
      openWindow('edge', { width: 660, height: 540 })
      return
    }
    if (id === 'feedback') {
      openWindow('contact', { width: 620, height: 600 })
      return
    }
    if (id === 'terminal') {
      openTerminal()
      return
    }
    openWindow(id)
  }

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent text-win-text"
      onContextMenu={onContextMenu}
      role="application"
      aria-label="Mohammad's Portfolio desktop"
    >
      <KeyboardShortcuts onOpenStart={() => setStartOpen(true)} />
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <Workspace
          onOpenApp={onAction}
          editMode={editMode}
          refreshKey={refreshKey}
          onExitEdit={() => {
            setEditMode(false)
            push('Edit mode off', 'info', 1400)
          }}
        />
      </main>
      <Taskbar
        onReplayBoot={onReplayBoot}
        startOpen={startOpen}
        setStartOpen={setStartOpen}
      />
      <ContextMenu
        open={menu.open}
        x={menu.x}
        y={menu.y}
        editMode={editMode}
        onClose={() => setMenu((m) => ({ ...m, open: false }))}
        onAction={onAction}
      />
    </div>
  )
}

Desktop.propTypes = {
  onReplayBoot: PropTypes.func,
}
