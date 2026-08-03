import PropTypes from 'prop-types'
import clsx from 'clsx'

/**
 * Accent-aware button used across windows and the dock.
 */
export function Button({
  children,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'font-mono transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-omarchy-accent disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'px-2 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-4 py-2 text-sm',
        variant === 'ghost' &&
          'bg-transparent text-omarchy-dim hover:bg-omarchy-panel hover:text-omarchy-text',
        variant === 'accent' &&
          'bg-omarchy-accent text-[#12081a] hover:bg-omarchy-rose hover:text-[#12081a]',
        variant === 'outline' &&
          'border border-omarchy-border text-omarchy-text hover:border-omarchy-accent hover:text-omarchy-accent',
        variant === 'danger' &&
          'text-omarchy-danger hover:bg-omarchy-danger/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['ghost', 'accent', 'outline', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
}
