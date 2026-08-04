import PropTypes from 'prop-types'
import clsx from 'clsx'

export function Badge({ children, tone = 'accent', className, variant = 'default', ...props }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium',
        variant === 'welcome'
          ? 'h-[26px] rounded-md px-3 text-[12px]'
          : 'rounded-full border px-2.5 py-0.5 text-[11px]',
        variant === 'welcome' &&
          tone === 'accent' &&
          'bg-win-accent/12 text-win-accent',
        variant === 'welcome' &&
          tone === 'warm' &&
          'bg-orange-500/12 text-orange-700 dark:text-orange-300',
        variant === 'default' &&
          tone === 'accent' &&
          'border-win-accent/40 bg-win-accent/10 text-win-accent',
        variant === 'default' &&
          tone === 'warm' &&
          'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node,
  tone: PropTypes.oneOf(['accent', 'warm']),
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'welcome']),
}

export function BadgeList({ items = [], variant = 'default' }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((b) => (
        <Badge
          key={b.id}
          tone={b.id === 'bnb' ? 'warm' : 'accent'}
          title={b.label}
          variant={variant}
        >
          {b.short || b.label}
        </Badge>
      ))}
    </div>
  )
}

BadgeList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      short: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  variant: PropTypes.oneOf(['default', 'welcome']),
}
