import { useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import Draggable from 'react-draggable'
import { motion } from 'framer-motion'
import { Minus, X, Loader2 } from 'lucide-react'
import { useWindows } from '../../contexts/WindowContext'
import { useIsMobile } from '../../hooks/useMediaQuery'

/**
 * OS-style window shell — draggable on desktop, stacked full-width on mobile.
 */
export function Window({
  id,
  title,
  children,
  width = 520,
  height,
  className,
  defaultPosition,
}) {
  const nodeRef = useRef(null)
  const isMobile = useIsMobile()
  const {
    windows,
    activeId,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    isLoading,
  } = useWindows()

  const win = windows[id]
  if (!win?.open || win.minimized) return null

  const isActive = activeId === id
  const loading = isLoading(id)

  const content = (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseDown={() => focusWindow(id)}
      style={
        isMobile
          ? undefined
          : {
              width,
              maxHeight: height || 'min(72vh, 640px)',
              zIndex: win.zIndex,
            }
      }
      className={clsx(
        'pointer-events-auto flex flex-col overflow-hidden border bg-omarchy-surface/95 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-[10px]',
        isActive
          ? 'border-omarchy-rose/40 shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,107,157,0.25),0_0_28px_rgba(255,107,157,0.12)]'
          : 'border-omarchy-border',
        isMobile
          ? 'relative mb-3 w-full max-h-[65vh]'
          : 'absolute',
        className,
      )}
      role="dialog"
      aria-label={title}
      aria-modal={false}
    >
      {/* Title bar */}
      <div
        className={clsx(
          'window-drag flex h-9 shrink-0 cursor-grab items-center justify-between border-b border-omarchy-border px-3 active:cursor-grabbing',
          isActive ? 'bg-omarchy-panel' : 'bg-omarchy-bg/80',
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={clsx(
              'h-1.5 w-1.5 shrink-0',
              isActive ? 'bg-omarchy-accent' : 'bg-omarchy-muted',
            )}
          />
          <h2 className="truncate font-mono text-xs font-medium tracking-wide text-omarchy-text">
            {title}
          </h2>
          {loading && (
            <Loader2 className="h-3 w-3 animate-spin text-omarchy-accent" />
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {!isMobile && (
            <button
              type="button"
              aria-label="Minimize"
              className="grid h-6 w-6 place-items-center text-omarchy-muted transition-colors hover:bg-omarchy-border hover:text-omarchy-text"
              onClick={(e) => {
                e.stopPropagation()
                minimizeWindow(id)
              }}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Close"
            className="grid h-6 w-6 place-items-center text-omarchy-muted transition-colors hover:bg-omarchy-danger/20 hover:text-omarchy-danger"
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(id)
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="scrollbar-omarchy flex-1 overflow-auto p-4 md:p-5">
        {children}
      </div>
    </motion.div>
  )

  if (isMobile) return content

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag"
      bounds="parent"
      position={{ x: win.x, y: win.y }}
      defaultPosition={defaultPosition}
      onStop={(_, data) => moveWindow(id, data.x, data.y)}
      onStart={() => focusWindow(id)}
    >
      {content}
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
  defaultPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
}
