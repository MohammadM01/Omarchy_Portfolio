import PropTypes from 'prop-types'
import { Minus, Square, X, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function WindowControls({
  onMinimize,
  onMaximize,
  onClose,
  showMinimize = true,
  showMaximize = true,
  compact = false,
}) {
  const btn = compact
    ? 'welcome-ctrl grid h-6 w-6 place-items-center rounded-sm transition-colors'
    : 'grid h-[38px] w-[46px] place-items-center text-win-text transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08]'
  const closeBtn = compact
    ? 'welcome-ctrl grid h-6 w-6 place-items-center rounded-sm transition-colors hover:!bg-[#c42b1c] hover:!text-white'
    : 'grid h-[38px] w-[46px] place-items-center text-win-text transition-colors hover:bg-[#c42b1c] hover:text-white'
  const iconClass = compact ? 'h-3 w-3' : 'h-3.5 w-3.5'
  const squareClass = compact ? 'h-2.5 w-2.5' : 'h-3 w-3'

  return (
    <div
      className={clsx(
        'window-no-drag relative z-30 flex shrink-0 items-center',
        compact ? 'h-full gap-0.5 pr-2.5' : 'h-full items-stretch',
      )}
    >
      {showMinimize && (
        <button
          type="button"
          aria-label="Minimize"
          className={btn}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onMinimize?.()
          }}
        >
          <Minus className={iconClass} strokeWidth={2} />
        </button>
      )}
      {showMaximize && (
        <button
          type="button"
          aria-label="Maximize"
          className={btn}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onMaximize?.()
          }}
        >
          <Square className={squareClass} strokeWidth={2} />
        </button>
      )}
      <button
        type="button"
        aria-label="Close"
        className={closeBtn}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClose?.()
        }}
      >
        <X className={iconClass} strokeWidth={2} />
      </button>
    </div>
  )
}

WindowControls.propTypes = {
  onMinimize: PropTypes.func,
  onMaximize: PropTypes.func,
  onClose: PropTypes.func,
  showMinimize: PropTypes.bool,
  showMaximize: PropTypes.bool,
  compact: PropTypes.bool,
}

export function WindowTitleBar({
  title,
  accent,
  icon,
  loading,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
  showMinimize = true,
  showMaximize = true,
  compact = false,
}) {
  return (
    <div
      className={clsx(
        'relative z-10 flex shrink-0 items-center justify-between',
        compact ? 'h-11' : 'h-[38px]',
        !isActive && 'opacity-50',
      )}
    >
      <div
        className={clsx(
          'window-drag flex min-w-0 flex-1 cursor-grab items-center self-stretch active:cursor-grabbing',
          compact ? 'gap-2 pl-4' : 'gap-2 pl-2.5',
        )}
      >
        {icon || (
          <span
            className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[4px] text-[9px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 65%, #000))`,
            }}
          >
            ●
          </span>
        )}
        <h2
          className={clsx(
            'truncate leading-none',
            compact
              ? 'welcome-title text-[13px] font-medium'
              : 'text-[15px] text-win-text',
          )}
        >
          {title}
        </h2>
        {loading && (
          <Loader2
            className="h-3.5 w-3.5 animate-spin"
            style={{ color: accent }}
          />
        )}
      </div>
      <WindowControls
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
        showMinimize={showMinimize}
        showMaximize={showMaximize}
        compact={compact}
      />
    </div>
  )
}

WindowTitleBar.propTypes = {
  title: PropTypes.string.isRequired,
  accent: PropTypes.string,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  isActive: PropTypes.bool,
  onMinimize: PropTypes.func,
  onMaximize: PropTypes.func,
  onClose: PropTypes.func,
  showMinimize: PropTypes.bool,
  showMaximize: PropTypes.bool,
  compact: PropTypes.bool,
}
