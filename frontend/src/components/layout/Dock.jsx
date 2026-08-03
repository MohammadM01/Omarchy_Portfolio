import PropTypes from 'prop-types'
import clsx from 'clsx'
import {
  Award,
  Briefcase,
  Code2,
  FileDown,
  FolderKanban,
  Github,
  GraduationCap,
  Mail,
  TerminalSquare,
  User,
} from 'lucide-react'
import { useWindows } from '../../contexts/WindowContext'
import { useTerminal } from '../../contexts/TerminalContext'
import { useSound } from '../../contexts/ThemeContext'
import { useToast } from '../../contexts/ToastContext'
import { useIsMobile, useIsDesktop } from '../../hooks/useMediaQuery'
import { profile } from '../../data/portfolioData'
import { DOCK_MOBILE_IDS } from '../../constants'

const ITEMS = [
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare, kind: 'terminal' },
  { id: 'about', label: 'About', icon: User, kind: 'window' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, kind: 'window' },
  { id: 'experience', label: 'Experience', icon: Briefcase, kind: 'window' },
  { id: 'skills', label: 'Skills', icon: Code2, kind: 'window' },
  { id: 'education', label: 'Education', icon: GraduationCap, kind: 'window' },
  { id: 'achievements', label: 'Achievements', icon: Award, kind: 'window' },
  { id: 'github', label: 'GitHub', icon: Github, kind: 'window' },
  { id: 'contact', label: 'Contact', icon: Mail, kind: 'window' },
  { id: 'resume', label: 'Resume', icon: FileDown, kind: 'resume' },
]

function DockItem({ item, vertical }) {
  const { openWindow, isOpen } = useWindows()
  const { open: openTerminal, isOpen: termOpen, toggle } = useTerminal()
  const { play } = useSound()
  const { push } = useToast()
  const Icon = item.icon

  const isActive =
    item.kind === 'terminal'
      ? termOpen
      : item.kind === 'window'
        ? isOpen(item.id)
        : false

  const onClick = () => {
    play('click')
    if (item.kind === 'terminal') {
      if (termOpen) toggle()
      else {
        openTerminal()
        play('open')
      }
      return
    }
    if (item.kind === 'resume') {
      window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer')
      push('Resume opened', 'success')
      return
    }
    openWindow(item.id)
    play('open')
    push(`Opened ${item.label}`, 'info', 1600)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'group relative flex touch-manipulation items-center justify-center transition-all duration-200',
        vertical ? 'h-11 w-11' : 'h-12 min-w-[2.75rem] flex-1 sm:flex-none sm:w-12',
        isActive
          ? 'text-omarchy-rose'
          : 'text-omarchy-muted hover:text-omarchy-text',
      )}
    >
      <span
        className={clsx(
          'grid place-items-center border transition-all duration-200',
          vertical ? 'h-9 w-9' : 'h-10 w-10',
          isActive
            ? 'scale-105 border-omarchy-rose/55 bg-omarchy-rose/15'
            : 'border-transparent group-hover:scale-110 group-hover:border-omarchy-border group-hover:bg-omarchy-panel',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>

      {vertical && (
        <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap border border-omarchy-border bg-omarchy-surface px-2 py-1 font-mono text-[10px] text-omarchy-text opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {item.label}
        </span>
      )}

      {isActive && (
        <span
          className={clsx(
            'absolute bg-omarchy-rose',
            vertical
              ? 'left-0 top-1/2 h-4 w-0.5 -translate-y-1/2'
              : 'bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2',
          )}
        />
      )}
    </button>
  )
}

DockItem.propTypes = {
  item: PropTypes.object.isRequired,
  vertical: PropTypes.bool,
}

export function Dock() {
  const isDesktop = useIsDesktop()
  const isMobile = useIsMobile()
  const vertical = isDesktop && !isMobile

  const items = isMobile
    ? ITEMS.filter((i) => DOCK_MOBILE_IDS.includes(i.id))
    : ITEMS

  if (vertical) {
    return (
      <aside
        className="glass relative z-40 flex w-14 shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-omarchy-border py-3"
        aria-label="Dock"
      >
        {items.map((item) => (
          <DockItem key={item.id} item={item} vertical />
        ))}
      </aside>
    )
  }

  return (
    <nav
      className="glass relative z-40 flex h-14 shrink-0 items-center justify-around gap-0.5 overflow-x-auto border-t border-omarchy-border px-1 sm:justify-center sm:gap-1"
      aria-label="Dock"
    >
      {items.map((item) => (
        <DockItem key={item.id} item={item} vertical={false} />
      ))}
    </nav>
  )
}
