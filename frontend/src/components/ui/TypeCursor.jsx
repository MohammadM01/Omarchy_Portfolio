import PropTypes from 'prop-types'
import clsx from 'clsx'

/** Blinking caret used with typewriter output */
export function TypeCursor({ className, color = 'accent' }) {
  return (
    <span
      aria-hidden
      className={clsx(
        'ml-0.5 inline-block h-3 w-1.5 animate-[cursor-blink_1s_step-end_infinite] align-middle',
        color === 'rose' ? 'bg-win-accent' : 'bg-win-accent',
        className,
      )}
    />
  )
}

TypeCursor.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['accent', 'rose']),
}
