import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { TopMenu } from './TopMenu'
import { Dock } from './Dock'
import { Workspace } from './Workspace'
import { StatusBar } from './StatusBar'
import { CommandPalette } from './CommandPalette'
import { KeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { useTheme, useSound } from '../../contexts/ThemeContext'
import { useToast } from '../../contexts/ToastContext'

export function DesktopShell({ onReplayBoot }) {
  const { isDark } = useTheme()
  const { play } = useSound()
  const { push } = useToast()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    play('boot')
    push('Desktop ready · Ctrl+K for commands', 'accent', 3200)
  }, [play, push])

  const openPalette = () => setPaletteOpen(true)

  return (
    <div
      className={clsx(
        'flex h-full min-h-0 w-full flex-col overflow-hidden',
        isDark ? 'bg-omarchy-bg text-omarchy-text' : 'omarchy-light-shell',
      )}
    >
      <KeyboardShortcuts onOpenPalette={openPalette} />
      <TopMenu onReplayBoot={onReplayBoot} onOpenPalette={openPalette} />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div className="order-2 shrink-0 md:order-1">
          <Dock />
        </div>
        <div className="order-1 min-h-0 min-w-0 flex-1 md:order-2">
          <Workspace />
        </div>
      </div>
      <StatusBar />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onReplayBoot={onReplayBoot}
      />
    </div>
  )
}

DesktopShell.propTypes = {
  onReplayBoot: PropTypes.func,
}
