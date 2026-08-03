import PropTypes from 'prop-types'
import clsx from 'clsx'

export function Badge({ children, tone = 'accent', className, ...props }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
        tone === 'accent' &&
          'border-win-accent/40 bg-win-accent/10 text-win-accent',
        tone === 'warm' &&
          'border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-300',
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
}

export function BadgeList({ items = [] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((b) => (
        <Badge key={b.id} tone={b.id === 'bnb' ? 'warm' : 'accent'} title={b.label}>
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
}
