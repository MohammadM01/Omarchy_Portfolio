import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { AppIcon } from '../ui/AppIcon'
import { storageGet, storageSet } from '../../utils/storage'
import { STORAGE_KEYS } from '../../constants'

export const DEFAULT_DESKTOP_ICONS = [
  { id: 'this-pc', label: 'This PC' },
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
  { id: 'terminal', label: 'Terminal' },
]

function loadOrder() {
  const saved = storageGet(STORAGE_KEYS.desktopIcons, null)
  if (!Array.isArray(saved) || !saved.length) return DEFAULT_DESKTOP_ICONS
  const map = Object.fromEntries(DEFAULT_DESKTOP_ICONS.map((i) => [i.id, i]))
  const ordered = saved.map((id) => map[id]).filter(Boolean)
  const missing = DEFAULT_DESKTOP_ICONS.filter(
    (i) => !saved.includes(i.id),
  )
  return [...ordered, ...missing]
}

export function DesktopIcon({
  id,
  label,
  onOpen,
  editMode,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  return (
    <button
      type="button"
      draggable={editMode}
      onDragStart={(e) => {
        if (!editMode) return
        e.dataTransfer.setData('text/plain', id)
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(id)
      }}
      onDragOver={(e) => {
        if (!editMode) return
        e.preventDefault()
        onDragOver?.(id)
      }}
      onDrop={(e) => {
        if (!editMode) return
        e.preventDefault()
        const from = e.dataTransfer.getData('text/plain')
        onDrop?.(from, id)
      }}
      onDoubleClick={() => {
        if (!editMode) onOpen?.(id)
      }}
      onClick={() => {
        if (editMode) return
        if (window.matchMedia('(max-width: 768px)').matches) onOpen?.(id)
      }}
      className={clsx(
        'group flex w-[86px] flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 text-center',
        editMode
          ? 'cursor-grab bg-white/10 ring-1 ring-white/25 active:cursor-grabbing'
          : 'hover:bg-white/10',
      )}
    >
      <span
        className={clsx(
          'transition-transform duration-150',
          editMode ? 'desktop-icon-wiggle' : 'group-hover:scale-105 group-active:scale-90',
        )}
      >
        <AppIcon id={id} size={52} />
      </span>
      <span
        className="line-clamp-2 max-w-[84px] text-[12px] font-medium leading-[14px] text-white"
        style={{
          textShadow: '0 1px 3px rgba(0,0,0,0.85), 0 0 8px rgba(0,0,0,0.4)',
        }}
      >
        {label}
      </span>
    </button>
  )
}

DesktopIcon.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onOpen: PropTypes.func,
  editMode: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
}

export function DesktopIcons({ onOpen, className, editMode = false, refreshKey = 0 }) {
  const [icons, setIcons] = useState(loadOrder)

  useEffect(() => {
    if (refreshKey > 0) setIcons(loadOrder())
  }, [refreshKey])

  useEffect(() => {
    storageSet(
      STORAGE_KEYS.desktopIcons,
      icons.map((i) => i.id),
    )
  }, [icons])

  const list = useMemo(() => icons, [icons])

  const onDrop = (fromId, toId) => {
    if (!fromId || fromId === toId) return
    setIcons((prev) => {
      const next = [...prev]
      const from = next.findIndex((i) => i.id === fromId)
      const to = next.findIndex((i) => i.id === toId)
      if (from < 0 || to < 0) return prev
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  return (
    <div
      className={clsx(
        'pointer-events-auto absolute left-2 top-2 z-20 flex max-h-[calc(100%-5rem)] flex-col flex-wrap content-start gap-0.5 sm:left-3 sm:top-3 sm:gap-1',
        className,
      )}
    >
      {list.map((icon) => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          label={icon.label}
          onOpen={onOpen}
          editMode={editMode}
          onDrop={onDrop}
        />
      ))}
    </div>
  )
}

DesktopIcons.propTypes = {
  onOpen: PropTypes.func,
  className: PropTypes.string,
  editMode: PropTypes.bool,
  refreshKey: PropTypes.number,
}
