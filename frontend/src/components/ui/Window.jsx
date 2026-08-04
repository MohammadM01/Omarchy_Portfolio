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
import {
  useMotionPrefs,
  windowOpen,
  windowOpenReduced,
} from '../../utils/motion'

const MIN_W = 360
const MIN_H = 260

function ResizeHandles({ onResizeStart }) {
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

/** Mica-style window — centered, draggable, resizable. */
export function Window({
  id,
  title,
  children,
  width: defaultWidth = 620,
  height: defaultHeight = 540,
  className,
  accent,
  variant = 'default',
}) {
  const nodeRef = useRef(null)
  const isMobile = useIsMobile()
  const { windowTransition, reduced } = useMotionPrefs()
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

  const isWelcome = variant === 'welcome'
  const win = windows[id]
  const isVisible = Boolean(win?.open && !win?.minimized)
  const isActive = activeId === id
  const loading = isLoading(id)
  const color = accent || WINDOW_ACCENTS[id] || '#3b91d8'
  const w = isWelcome ? 580 : win?.width || defaultWidth
  const h = win?.height || defaultHeight
  const openAnim = reduced ? windowOpenReduced : windowOpen

  const onResizeStart = useCallback(
    (e, dir) => {
      if (!win || isWelcome) return
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
    [focusWindow, id, resizeWindow, win, w, h, isWelcome],
  )

  const shellClass = clsx(
    'pointer-events-auto flex flex-col overflow-hidden win-window-shell',
    isWelcome
      ? 'welcome-shell rounded-xl'
      : clsx(
          'border border-[var(--color-win-border)]',
          win?.maximized ? 'rounded-none' : 'rounded-[10px]',
          isActive
            ? 'win-mica-foc shadow-[3px_3px_28px_4px_var(--color-win-shadow)]'
            : 'bg-[var(--color-win-unfoc)] shadow-[2px_2px_8px_var(--color-win-shadow)]',
        ),
    className,
  )

  const chrome = win ? (
    <>
      <WindowTitleBar
        title={title}
        accent={color}
        compact={isWelcome}
        icon={
          <AppIcon
            id={id.startsWith('project-') ? 'projects' : id}
            size={isWelcome ? 16 : 18}
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

      <motion.div
        className={clsx(
          'scrollbar-win min-h-0 flex-1 overflow-auto',
          isWelcome
            ? 'welcome-shell__body px-8 pb-8 pt-6'
            : clsx(
                'p-4 md:p-5',
                isActive
                  ? 'bg-[color-mix(in_srgb,var(--color-win-bg)_62%,transparent)]'
                  : 'bg-transparent',
              ),
        )}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.08, duration: 0.2 }}
      >
        {children}
      </motion.div>

      {!isMobile && !win.maximized && !isWelcome && (
        <ResizeHandles onResizeStart={onResizeStart} />
      )}
    </>
  ) : null

  if (isMobile) {
    if (!isVisible || !win) return null
    return (
      <motion.div
        key={id}
        {...openAnim}
        transition={windowTransition}
        onMouseDown={() => focusWindow(id)}
        className={clsx(
          shellClass,
          'relative mb-3 w-full max-h-[70vh]',
          isWelcome && 'max-w-[580px]',
        )}
        role="dialog"
        aria-label={title}
        aria-modal={false}
        style={{ '--win-accent': color }}
      >
        {chrome}
      </motion.div>
    )
  }

  if (!isVisible || !win) return null

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
          '--win-accent': color,
        }}
        className={clsx(shellClass, 'absolute')}
        role="dialog"
        aria-label={title}
        aria-modal={false}
      >
        <motion.div
          className="flex h-full min-h-0 w-full flex-col"
          {...openAnim}
          transition={windowTransition}
        >
          {chrome}
        </motion.div>
      </div>
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
  variant: PropTypes.oneOf(['default', 'welcome']),
}
