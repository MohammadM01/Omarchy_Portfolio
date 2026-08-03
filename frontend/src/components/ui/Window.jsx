import { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Draggable from 'react-draggable'
import { motion } from 'framer-motion'
import { useWindows } from '../../contexts/WindowContext'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { WindowTitleBar } from './WindowControls'
import { WINDOW_ACCENTS } from '../../data/portfolioData'
import { AppIcon } from './AppIcon'

const MIN_W = 360
const MIN_H = 260

function ResizeHandles({ onResizeStart }) {
  // Keep handles clear of the title-bar control buttons (top-right)
  const edges = [
    { dir: 'n', className: 'left-2 right-14 top-0 h-1.5 cursor-n-resize' },
    { dir: 's', className: 'left-2 right-2 bottom-0 h-1.5 cursor-s-resize' },
    { dir: 'e', className: 'top-10 bottom-2 right-0 w-1.5 cursor-e-resize' },
    { dir: 'w', className: 'top-2 bottom-2 left-0 w-1.5 cursor-w-resize' },
    { dir: 'ne', className: 'right-0 top-10 h-3 w-3 cursor-ne-resize' },
    { dir: 'nw', className: 'left-0 top-0 h-3 w-3 cursor-nw-resize' },
    { dir: 'se', className: 'right-0 bottom-0 h-3 w-3 cursor-se-resize' },
    { dir: 'sw', className: 'left-0 bottom-0 h-3 w-3 cursor-sw-resize' },
  ]
  return edges.map((e) => (
    <div
      key={e.dir}
      className={clsx('absolute z-20', e.className)}
      onMouseDown={(ev) => onResizeStart(ev, e.dir)}
    />
  ))
}

ResizeHandles.propTypes = {
  onResizeStart: PropTypes.func.isRequired,
}

/** Win12 mica window — centered, draggable, resizable. */
export function Window({
  id,
  title,
  children,
  width: defaultWidth = 520,
  height: defaultHeight = 420,
  className,
  accent,
}) {
  const nodeRef = useRef(null)
  const isMobile = useIsMobile()
  const {
    windows,
    activeId,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    isLoading,
  } = useWindows()

  const win = windows[id]
  const isVisible = Boolean(win?.open && !win?.minimized)
  const isActive = activeId === id
  const loading = isLoading(id)
  const color = accent || WINDOW_ACCENTS[id] || '#3b91d8'
  const w = win?.width || defaultWidth
  const h = win?.height || defaultHeight

  // Hooks must run every render — never after an early return
  const onResizeStart = useCallback(
    (e, dir) => {
      if (!win) return
      e.preventDefault()
      e.stopPropagation()
      focusWindow(id)
      const startX = e.clientX
      const startY = e.clientY
      const start = { x: win.x, y: win.y, width: w, height: h }

      const onMove = (ev) => {
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        let next = { ...start }

        if (dir.includes('e')) next.width = start.width + dx
        if (dir.includes('s')) next.height = start.height + dy
        if (dir.includes('w')) {
          next.width = start.width - dx
          next.x = start.x + dx
          if (next.width < MIN_W) {
            next.x = start.x + start.width - MIN_W
            next.width = MIN_W
          }
        }
        if (dir.includes('n')) {
          next.height = start.height - dy
          next.y = start.y + dy
          if (next.height < MIN_H) {
            next.y = start.y + start.height - MIN_H
            next.height = MIN_H
          }
        }

        resizeWindow(id, next)
      }

      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [focusWindow, id, resizeWindow, win, w, h],
  )

  if (!isVisible || !win) return null

  const shellClass = clsx(
    'pointer-events-auto flex flex-col overflow-hidden border border-[var(--color-win-border)] transition-[box-shadow,background] duration-200',
    win.maximized ? 'rounded-none' : 'rounded-[10px]',
    isActive
      ? 'win-mica-foc shadow-[3px_3px_28px_4px_var(--color-win-shadow)]'
      : 'bg-[var(--color-win-unfoc)] shadow-[2px_2px_8px_var(--color-win-shadow)]',
    className,
  )

  const chrome = (
    <>
      <WindowTitleBar
        title={title}
        accent={color}
        icon={
          <AppIcon
            id={id.startsWith('project-') ? 'projects' : id}
            size={18}
          />
        }
        loading={loading}
        isActive={isActive}
        showMinimize={!isMobile}
        showMaximize={!isMobile}
        onMinimize={() => minimizeWindow(id)}
        onMaximize={() => maximizeWindow(id)}
        onClose={() => closeWindow(id)}
      />

      <div
        className={clsx(
          'scrollbar-win min-h-0 flex-1 overflow-auto p-4 md:p-5',
          isActive
            ? 'bg-[color-mix(in_srgb,var(--color-win-bg)_62%,transparent)]'
            : 'bg-transparent',
        )}
      >
        {children}
      </div>

      {!isMobile && !win.maximized && (
        <ResizeHandles onResizeStart={onResizeStart} />
      )}
    </>
  )

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        onMouseDown={() => focusWindow(id)}
        className={clsx(shellClass, 'relative mb-3 w-full max-h-[70vh]')}
        role="dialog"
        aria-label={title}
        aria-modal={false}
      >
        {chrome}
      </motion.div>
    )
  }

  // Outer node owns drag transform; inner motion only fades (no transform conflict)
  const shell = (
    <div
      ref={nodeRef}
      onMouseDown={() => focusWindow(id)}
      onDoubleClick={(e) => {
        if (e.target.closest('.window-drag')) maximizeWindow(id)
      }}
      style={{
        width: win.maximized ? '100%' : w,
        height: win.maximized ? '100%' : h,
        zIndex: win.zIndex,
      }}
      className={clsx(shellClass, 'absolute')}
      role="dialog"
      aria-label={title}
      aria-modal={false}
    >
      <motion.div
        className="flex h-full min-h-0 w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {chrome}
      </motion.div>
    </div>
  )

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag"
      cancel=".window-no-drag,button,a,input,textarea,select"
      bounds="parent"
      disabled={win.maximized}
      position={{ x: win.x ?? 0, y: win.y ?? 0 }}
      onStop={(_, data) => moveWindow(id, data.x, data.y)}
      onStart={() => focusWindow(id)}
    >
      {shell}
    </Draggable>
  )
}

Window.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  accent: PropTypes.string,
}
