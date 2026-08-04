import PropTypes from 'prop-types'
import clsx from 'clsx'

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
        'rounded-lg font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-win-accent disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'px-2.5 py-1 text-xs',
        size === 'md' && 'px-3.5 py-1.5 text-sm',
        size === 'lg' && 'px-4 py-2 text-sm',
        variant === 'ghost' &&
          'bg-transparent text-win-dim hover:bg-black/5 hover:text-win-text dark:hover:bg-white/10',
        variant === 'accent' &&
          'bg-win-accent text-white hover:brightness-110',
        variant === 'outline' &&
          'border border-win-border text-win-text hover:border-win-accent hover:text-win-accent',
        variant === 'danger' &&
          'text-win-danger hover:bg-win-danger/10',
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
