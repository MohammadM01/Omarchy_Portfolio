import PropTypes from 'prop-types'
import { Minus, Square, X, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function WindowControls({
  onMinimize,
  onMaximize,
  onClose,
  showMinimize = true,
  showMaximize = true,
}) {
  return (
    <div className="window-no-drag relative z-30 flex h-full shrink-0 items-stretch">
      {showMinimize && (
        <button
          type="button"
          aria-label="Minimize"
          className="grid h-[38px] w-[46px] place-items-center text-win-text transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onMinimize?.()
          }}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      )}
      {showMaximize && (
        <button
          type="button"
          aria-label="Maximize"
          className="grid h-[38px] w-[46px] place-items-center text-win-text transition-colors hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            onMaximize?.()
          }}
        >
          <Square className="h-3 w-3" strokeWidth={2} />
        </button>
      )}
      <button
        type="button"
        aria-label="Close"
        className="grid h-[38px] w-[46px] place-items-center text-win-text transition-colors hover:bg-[#c42b1c] hover:text-white"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClose?.()
        }}
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
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
}) {
  return (
    <div
      className={clsx(
        'relative z-10 flex h-[38px] shrink-0 items-center justify-between',
        !isActive && 'opacity-50',
      )}
    >
      <div className="window-drag flex min-w-0 flex-1 cursor-grab items-center gap-2 self-stretch pl-2.5 active:cursor-grabbing">
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
        <h2 className="truncate text-[15px] leading-none text-win-text">
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
}
