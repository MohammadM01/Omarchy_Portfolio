import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowClockwise24Regular,
  DarkTheme24Regular,
  Globe24Regular,
  Edit24Regular,
  PaintBrush24Regular,
} from '@fluentui/react-icons'

const ITEMS = [
  { id: 'refresh', label: 'Refresh', Icon: ArrowClockwise24Regular },
  { id: 'theme', label: 'Switch theme', Icon: DarkTheme24Regular },
  {
    id: 'github-project',
    label: 'View this project in Github',
    Icon: Globe24Regular,
  },
  { id: 'edit-mode', label: 'Enter edit mode', Icon: Edit24Regular },
  { id: 'personalize', label: 'Personalize', Icon: PaintBrush24Regular },
]

export function ContextMenu({ x, y, open, onClose, onAction, editMode }) {
  useEffect(() => {
    if (!open) return
    const close = () => onClose?.()
    window.addEventListener('click', close)
    window.addEventListener('scroll', close, true)
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('click', close)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const items = ITEMS.map((item) =>
    item.id === 'edit-mode'
      ? {
          ...item,
          label: editMode ? 'Exit edit mode' : 'Enter edit mode',
        }
      : item,
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.ul
          role="menu"
          initial={{ opacity: 0, scale: 0.96, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 4 }}
          transition={{ duration: 0.14 }}
          className="win-acrylic fixed z-[90] min-w-[248px] overflow-hidden rounded-[12px] border border-[var(--color-win-border)] py-1.5 text-[13px] shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
          style={{ left: x, top: y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {items.map((item, i) => (
            <li key={item.id}>
              {i === 3 && (
                <div
                  className="my-1 border-t border-[var(--color-win-border)]"
                  aria-hidden
                />
              )}
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-win-text transition-colors hover:bg-[linear-gradient(90deg,#ad6eca33,#3b91d833)]"
                onClick={() => {
                  onAction?.(item.id)
                  onClose?.()
                }}
              >
                <item.Icon
                  className="h-[16px] w-[16px] shrink-0 text-win-muted"
                  aria-hidden
                />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  )
}

ContextMenu.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAction: PropTypes.func,
  editMode: PropTypes.bool,
}
