import PropTypes from 'prop-types'
import clsx from 'clsx'

/**
 * Official-style Windows square logo (4 panes, full square — no black padding).
 */
export function WinLogo({ className = 'h-5 w-5', glow = true }) {
  return (
    <img
      src="/win-logo.svg"
      alt=""
      draggable={false}
      className={clsx(
        'aspect-square object-contain',
        glow && 'win-logo-glow',
        className,
      )}
      aria-hidden
    />
  )
}

WinLogo.propTypes = {
  className: PropTypes.string,
  glow: PropTypes.bool,
}

export function Monogram({ value = 'MM', size = 'md', className = '', accent }) {
  const sizes = {
    sm: 'h-9 w-9 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
  }
  return (
    <div
      className={clsx(
        'grid place-items-center rounded-2xl font-semibold text-white shadow-md',
        sizes[size] || sizes.md,
        className,
      )}
      style={{
        background:
          accent ||
          'linear-gradient(135deg, #6EC3F4 0%, #8B7CF6 50%, #F472B6 100%)',
        color: accent ? '#fff' : '#1a1a2e',
      }}
    >
      {value}
    </div>
  )
}

Monogram.propTypes = {
  value: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  accent: PropTypes.string,
}
