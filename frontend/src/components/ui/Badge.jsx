import PropTypes from 'prop-types'
import clsx from 'clsx'

export function Badge({ label, title, tone = 'accent' }) {
  return (
    <span
      title={title || label}
      className={clsx(
        'border px-2 py-0.5 font-mono text-[10px]',
        tone === 'rose'
          ? 'border-omarchy-rose/40 bg-omarchy-rose/10 text-omarchy-rose'
          : 'border-omarchy-accent/40 bg-omarchy-accent/10 text-omarchy-accent',
      )}
    >
      {label}
    </span>
  )
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  tone: PropTypes.oneOf(['accent', 'rose']),
}

export function BadgeList({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <Badge
          key={item.id}
          label={item.short}
          title={item.label}
          tone={i % 2 === 0 ? 'accent' : 'rose'}
        />
      ))}
    </div>
  )
}

BadgeList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      short: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
  ).isRequired,
}
