import PropTypes from 'prop-types'

export function OmarchyMark({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <rect x="3" y="3" width="26" height="26" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 22V10l7 7 7-7v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

OmarchyMark.propTypes = {
  className: PropTypes.string,
}

export function Monogram({ value, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-14 w-14 text-lg',
    lg: 'h-20 w-20 text-2xl',
  }

  return (
    <div
      className={`grid place-items-center border border-omarchy-accent/50 bg-omarchy-panel font-mono font-bold text-omarchy-accent ${sizes[size] || sizes.md} ${className}`}
      aria-hidden
    >
      {value}
    </div>
  )
}

Monogram.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
}
