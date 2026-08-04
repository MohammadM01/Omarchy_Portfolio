import PropTypes from 'prop-types'
import clsx from 'clsx'

/**
 * Classic 4-pane Start mark (not win-logo.svg — that file is boot-only).
 */
export function StartMark({ className = 'h-8 w-8' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      fill="none"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.5" fill="#F25022" />
      <rect x="26" y="2" width="20" height="20" rx="2.5" fill="#7FBA00" />
      <rect x="2" y="26" width="20" height="20" rx="2.5" fill="#00A4EF" />
      <rect x="26" y="26" width="20" height="20" rx="2.5" fill="#FFB900" />
    </svg>
  )
}

StartMark.propTypes = {
  className: PropTypes.string,
}

/**
 * Start / chrome mark. Does not load /win-logo.svg (reserved for boot screen).
 */
export function WinLogo({ className = 'h-5 w-5', glow = true }) {
  return (
    <StartMark
      className={clsx(glow && 'win-logo-glow', 'aspect-square', className)}
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
